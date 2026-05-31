package com.mathlite.service;

import com.mathlite.ast.BlockNode;
import com.mathlite.dto.ASTNodeDTO;
import com.mathlite.dto.ExecutionResponse;
import com.mathlite.interpreter.Interpreter;
import com.mathlite.lexer.Lexer;
import com.mathlite.lexer.Token;
import com.mathlite.model.ExecutionRecord;
import com.mathlite.parser.ParseError;
import com.mathlite.parser.Parser;
import com.mathlite.repository.ExecutionRepository;
import com.mathlite.semantic.SemanticAnalyzer;
import com.mathlite.semantic.SemanticError;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.*;

/**
 * Servicio que orquesta el pipeline completo de interpretación:
 * Código fuente → Lexer → Parser → Semantic → Interpreter → Resultado
 */
@Service
@RequiredArgsConstructor
public class InterpreterService {

    private final ExecutionRepository repository;

    /**
     * Ejecuta el pipeline completo de interpretación.
     */
    public ExecutionResponse execute(String code) {
        long startTime = System.currentTimeMillis();

        List<String> lexicalErrors = new ArrayList<>();
        List<String> syntacticErrors = new ArrayList<>();
        List<String> semanticErrors = new ArrayList<>();
        List<String> runtimeErrors = new ArrayList<>();
        List<String> output = new ArrayList<>();
        List<Map<String, Object>> tokenMaps = new ArrayList<>();
        Map<String, Object> astMap = new HashMap<>();

        // --- FASE 1: Análisis Léxico ---
        Lexer lexer = new Lexer(code);
        List<Token> tokens = lexer.tokenize();
        lexicalErrors.addAll(lexer.getErrors());

        // Serializar tokens
        for (Token t : tokens) {
            Map<String, Object> tm = new LinkedHashMap<>();
            tm.put("type", t.type().name());
            tm.put("lexeme", t.lexeme());
            tm.put("line", t.line());
            tm.put("column", t.column());
            tokenMaps.add(tm);
        }

        BlockNode ast = null;

        // --- FASE 2: Análisis Sintáctico ---
        if (lexicalErrors.isEmpty()) {
            Parser parser = new Parser(tokens);
            ast = parser.parse();
            for (ParseError e : parser.getErrors()) {
                syntacticErrors.add(e.toString());
            }
            astMap = ASTNodeDTO.toMap(ast);
        }

        // --- FASE 3: Análisis Semántico ---
        if (ast != null && syntacticErrors.isEmpty()) {
            SemanticAnalyzer semantic = new SemanticAnalyzer();
            List<SemanticError> semErrors = semantic.analyze(ast);
            for (SemanticError e : semErrors) {
                semanticErrors.add(e.toString());
            }
        }

        // --- FASE 4: Interpretación ---
        if (ast != null && semanticErrors.isEmpty() && syntacticErrors.isEmpty()) {
            Interpreter interpreter = new Interpreter();
            interpreter.interpret(ast);
            output.addAll(interpreter.getOutput());
            runtimeErrors.addAll(interpreter.getRuntimeErrors());
        }

        long executionTime = System.currentTimeMillis() - startTime;

        // Determinar éxito
        boolean success = lexicalErrors.isEmpty() && syntacticErrors.isEmpty()
                          && semanticErrors.isEmpty() && runtimeErrors.isEmpty();

        // Errores agrupados
        Map<String, List<String>> errors = new LinkedHashMap<>();
        errors.put("lexical", lexicalErrors);
        errors.put("syntactic", syntacticErrors);
        errors.put("semantic", semanticErrors);
        errors.put("runtime", runtimeErrors);

        // Persistir en MongoDB
        try {
            ExecutionRecord record = new ExecutionRecord();
            record.setCode(code);
            record.setOutput(output);
            record.setAstJson(astMap);
            record.setErrors(errors);
            record.setSuccess(success);
            record.setExecutionTimeMs(executionTime);
            repository.save(record);
        } catch (Exception e) {
            // No abortar si MongoDB falla
            System.err.println("Error al guardar en MongoDB: " + e.getMessage());
        }

        return new ExecutionResponse(success, output, tokenMaps, astMap, errors, executionTime);
    }

    /**
     * Obtiene el historial de ejecuciones.
     */
    public List<ExecutionRecord> getHistory() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Obtiene un registro de ejecución por ID.
     */
    public Optional<ExecutionRecord> getById(String id) {
        return repository.findById(id);
    }

    /**
     * Elimina un registro de ejecución.
     */
    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
