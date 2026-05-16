package com.mathlite.parser;

import com.mathlite.ast.*;
import com.mathlite.lexer.Token;
import com.mathlite.lexer.TokenType;

import java.util.ArrayList;
import java.util.List;

/**
 * Parser recursivo descendente LL(1) para el lenguaje MathLite.
 *
 * NO utiliza generadores de parsers (ANTLR, Yacc, Bison).
 * Cada regla de producción de la gramática EBNF se mapea a un método.
 *
 * Precedencia de operadores (menor a mayor):
 * 1. or
 * 2. and
 * 3. ==  !=  <  >  <=  >=
 * 4. +  -
 * 5. *  /  %
 * 6. ^
 * 7. not  - (unario)
 * 8. llamada a función
 * 9. literales / paréntesis
 */
public class Parser {

    private final List<Token> tokens;
    private int current = 0;
    private final List<ParseError> errors = new ArrayList<>();

    public Parser(List<Token> tokens) {
        // Filtrar tokens NEWLINE y ERROR para simplificar el parsing
        this.tokens = tokens.stream()
            .filter(t -> t.type() != TokenType.NEWLINE && t.type() != TokenType.ERROR)
            .toList();
    }

    /**
     * Punto de entrada: parsea el programa completo.
     *
     * @return BlockNode raíz que contiene todas las sentencias del programa
     */
    public BlockNode parse() {
        List<ASTNode> statements = new ArrayList<>();

        while (!isAtEnd()) {
            try {
                ASTNode stmt = parseStatement();
                if (stmt != null) {
                    statements.add(stmt);
                }
            } catch (ParseError e) {
                errors.add(e);
                synchronize(); // Recuperación de errores: avanzar hasta la siguiente sentencia
            }
        }

        return new BlockNode(statements, 1, 1);
    }

    /**
     * Retorna la lista de errores sintácticos encontrados.
     */
    public List<ParseError> getErrors() {
        return errors;
    }

    // ============================================================
    // Parsing de sentencias
    // ============================================================

    /**
     * statement → assignStmt | funcDef | ifStmt | whileStmt | printStmt | returnStmt | exprStmt
     */
    private ASTNode parseStatement() {
        if (check(TokenType.LET))    return parseAssign();
        if (check(TokenType.DEF))    return parseFuncDef();
        if (check(TokenType.IF))     return parseIf();
        if (check(TokenType.WHILE))  return parseWhile();
        if (check(TokenType.PRINT))  return parsePrint();
        if (check(TokenType.RETURN)) return parseReturn();

        // Si no es ninguna sentencia conocida, intentar parsear como expresión
        return parseExpression();
    }

    /**
     * assignStmt → 'let' IDENTIFIER '=' expression
     */
    private AssignNode parseAssign() {
        Token letToken = consume(TokenType.LET, "Se esperaba 'let'");
        Token name = consume(TokenType.IDENTIFIER, "Se esperaba un nombre de variable después de 'let'");
        consume(TokenType.EQUAL, "Se esperaba '=' después del nombre de variable");
        ASTNode value = parseExpression();

        return new AssignNode(name.lexeme(), value, letToken.line(), letToken.column());
    }

    /**
     * funcDef → 'def' IDENTIFIER '(' params? ')' '{' block '}'
     * params  → IDENTIFIER (',' IDENTIFIER)*
     */
    private FuncDefNode parseFuncDef() {
        Token defToken = consume(TokenType.DEF, "Se esperaba 'def'");
        Token name = consume(TokenType.IDENTIFIER, "Se esperaba el nombre de la función después de 'def'");
        consume(TokenType.LPAREN, "Se esperaba '(' después del nombre de la función");

        // Parsear parámetros
        List<String> params = new ArrayList<>();
        if (!check(TokenType.RPAREN)) {
            do {
                Token param = consume(TokenType.IDENTIFIER, "Se esperaba un nombre de parámetro");
                params.add(param.lexeme());
            } while (match(TokenType.COMMA));
        }
        consume(TokenType.RPAREN, "Se esperaba ')' después de los parámetros");

        // Parsear cuerpo
        consume(TokenType.LBRACE, "Se esperaba '{' para iniciar el cuerpo de la función");
        BlockNode body = parseBlock();
        consume(TokenType.RBRACE, "Se esperaba '}' para cerrar el cuerpo de la función");

        return new FuncDefNode(name.lexeme(), params, body, defToken.line(), defToken.column());
    }

    /**
     * ifStmt → 'if' expression '{' block '}' ('else' '{' block '}')?
     */
    private IfNode parseIf() {
        Token ifToken = consume(TokenType.IF, "Se esperaba 'if'");
        ASTNode condition = parseExpression();

        consume(TokenType.LBRACE, "Se esperaba '{' después de la condición del if");
        BlockNode thenBranch = parseBlock();
        consume(TokenType.RBRACE, "Se esperaba '}' para cerrar el bloque if");

        BlockNode elseBranch = null;
        if (match(TokenType.ELSE)) {
            consume(TokenType.LBRACE, "Se esperaba '{' después de 'else'");
            elseBranch = parseBlock();
            consume(TokenType.RBRACE, "Se esperaba '}' para cerrar el bloque else");
        }

        return new IfNode(condition, thenBranch, elseBranch, ifToken.line(), ifToken.column());
    }

    /**
     * whileStmt → 'while' expression '{' block '}'
     */
    private WhileNode parseWhile() {
        Token whileToken = consume(TokenType.WHILE, "Se esperaba 'while'");
        ASTNode condition = parseExpression();

        consume(TokenType.LBRACE, "Se esperaba '{' después de la condición del while");
        BlockNode body = parseBlock();
        consume(TokenType.RBRACE, "Se esperaba '}' para cerrar el bloque while");

        return new WhileNode(condition, body, whileToken.line(), whileToken.column());
    }

    /**
     * printStmt → 'print' '(' expression ')'
     */
    private PrintNode parsePrint() {
        Token printToken = consume(TokenType.PRINT, "Se esperaba 'print'");
        consume(TokenType.LPAREN, "Se esperaba '(' después de 'print'");
        ASTNode expr = parseExpression();
        consume(TokenType.RPAREN, "Se esperaba ')' después de la expresión de print");

        return new PrintNode(expr, printToken.line(), printToken.column());
    }

    /**
     * returnStmt → 'return' expression
     */
    private ReturnNode parseReturn() {
        Token returnToken = consume(TokenType.RETURN, "Se esperaba 'return'");
        ASTNode value = parseExpression();

        return new ReturnNode(value, returnToken.line(), returnToken.column());
    }

    /**
     * block → statement*
     * Parsea sentencias hasta encontrar '}' o EOF.
     */
    private BlockNode parseBlock() {
        List<ASTNode> statements = new ArrayList<>();
        Token start = peek();

        while (!check(TokenType.RBRACE) && !isAtEnd()) {
            try {
                ASTNode stmt = parseStatement();
                if (stmt != null) {
                    statements.add(stmt);
                }
            } catch (ParseError e) {
                errors.add(e);
                synchronize();
            }
        }

        return new BlockNode(statements, start.line(), start.column());
    }

    // ============================================================
    // Parsing de expresiones (por precedencia, menor a mayor)
    // ============================================================

    /**
     * expression → orExpr
     */
    private ASTNode parseExpression() {
        return parseOr();
    }

    /**
     * orExpr → andExpr ('or' andExpr)*
     */
    private ASTNode parseOr() {
        ASTNode left = parseAnd();

        while (match(TokenType.OR)) {
            Token op = previous();
            ASTNode right = parseAnd();
            left = new BinOpNode(left, op.type(), right, op.line(), op.column());
        }

        return left;
    }

    /**
     * andExpr → comparison ('and' comparison)*
     */
    private ASTNode parseAnd() {
        ASTNode left = parseComparison();

        while (match(TokenType.AND)) {
            Token op = previous();
            ASTNode right = parseComparison();
            left = new BinOpNode(left, op.type(), right, op.line(), op.column());
        }

        return left;
    }

    /**
     * comparison → addition (('==' | '!=' | '<' | '>' | '<=' | '>=') addition)*
     */
    private ASTNode parseComparison() {
        ASTNode left = parseAddition();

        while (match(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL,
                      TokenType.LESS, TokenType.GREATER,
                      TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
            Token op = previous();
            ASTNode right = parseAddition();
            left = new BinOpNode(left, op.type(), right, op.line(), op.column());
        }

        return left;
    }

    /**
     * addition → multiplication (('+' | '-') multiplication)*
     */
    private ASTNode parseAddition() {
        ASTNode left = parseMultiplication();

        while (match(TokenType.PLUS, TokenType.MINUS)) {
            Token op = previous();
            ASTNode right = parseMultiplication();
            left = new BinOpNode(left, op.type(), right, op.line(), op.column());
        }

        return left;
    }

    /**
     * multiplication → power (('*' | '/' | '%') power)*
     */
    private ASTNode parseMultiplication() {
        ASTNode left = parsePower();

        while (match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
            Token op = previous();
            ASTNode right = parsePower();
            left = new BinOpNode(left, op.type(), right, op.line(), op.column());
        }

        return left;
    }

    /**
     * power → unary ('^' unary)*
     * Nota: La potenciación es asociativa a la derecha (2^3^2 = 2^(3^2))
     */
    private ASTNode parsePower() {
        ASTNode left = parseUnary();

        if (match(TokenType.CARET)) {
            Token op = previous();
            ASTNode right = parsePower(); // Recursión a la derecha para asociatividad derecha
            left = new BinOpNode(left, op.type(), right, op.line(), op.column());
        }

        return left;
    }

    /**
     * unary → ('-' | 'not') unary | call
     */
    private ASTNode parseUnary() {
        if (match(TokenType.MINUS, TokenType.NOT)) {
            Token op = previous();
            ASTNode operand = parseUnary();
            return new UnaryOpNode(op.type(), operand, op.line(), op.column());
        }

        return parseCall();
    }

    /**
     * call → primary ('(' arguments? ')')?
     * arguments → expression (',' expression)*
     *
     * También maneja llamadas a funciones integradas (sin, cos, etc.)
     */
    private ASTNode parseCall() {
        // Verificar si es una función integrada o un identificador seguido de '('
        if (checkBuiltinFunction() || check(TokenType.IDENTIFIER)) {
            Token name = peek();

            // Solo es una llamada si el siguiente token después del nombre es '('
            if (peekNext() != null && peekNext().type() == TokenType.LPAREN) {
                advance(); // consumir el nombre
                advance(); // consumir '('

                // Parsear argumentos
                List<ASTNode> args = new ArrayList<>();
                if (!check(TokenType.RPAREN)) {
                    do {
                        args.add(parseExpression());
                    } while (match(TokenType.COMMA));
                }
                consume(TokenType.RPAREN, "Se esperaba ')' después de los argumentos");

                return new FuncCallNode(name.lexeme(), args, name.line(), name.column());
            }
        }

        return parsePrimary();
    }

    /**
     * primary → INTEGER_LITERAL | REAL_LITERAL | STRING_LITERAL | 'true' | 'false' | IDENTIFIER | '(' expression ')'
     */
    private ASTNode parsePrimary() {
        // Números
        if (match(TokenType.INTEGER_LITERAL)) {
            Token t = previous();
            return new NumberNode(Double.parseDouble(t.lexeme()), true, t.line(), t.column());
        }
        if (match(TokenType.REAL_LITERAL)) {
            Token t = previous();
            return new NumberNode(Double.parseDouble(t.lexeme()), false, t.line(), t.column());
        }

        // Strings
        if (match(TokenType.STRING_LITERAL)) {
            Token t = previous();
            // Remover las comillas del lexema
            String value = t.lexeme().substring(1, t.lexeme().length() - 1);
            return new StringNode(value, t.line(), t.column());
        }

        // Booleanos
        if (match(TokenType.TRUE)) {
            Token t = previous();
            return new BoolNode(true, t.line(), t.column());
        }
        if (match(TokenType.FALSE)) {
            Token t = previous();
            return new BoolNode(false, t.line(), t.column());
        }

        // Identificadores (variables)
        if (match(TokenType.IDENTIFIER)) {
            Token t = previous();
            return new VariableNode(t.lexeme(), t.line(), t.column());
        }

        // Funciones integradas usadas como variables (sin ser llamadas)
        if (checkBuiltinFunction()) {
            Token t = advance();
            return new VariableNode(t.lexeme(), t.line(), t.column());
        }

        // Paréntesis para agrupación
        if (match(TokenType.LPAREN)) {
            ASTNode expr = parseExpression();
            consume(TokenType.RPAREN, "Se esperaba ')' para cerrar la expresión agrupada");
            return expr;
        }

        // Error: token inesperado
        throw error(peek(), "Se esperaba una expresión, pero se encontró '" + peek().lexeme() + "'");
    }

    // ============================================================
    // Métodos auxiliares
    // ============================================================

    /**
     * Verifica si el token actual es una función matemática integrada.
     */
    private boolean checkBuiltinFunction() {
        return check(TokenType.SIN) || check(TokenType.COS) || check(TokenType.TAN) ||
               check(TokenType.SQRT) || check(TokenType.LOG) || check(TokenType.ABS) ||
               check(TokenType.FLOOR) || check(TokenType.CEIL);
    }

    private Token peek() {
        return tokens.get(current);
    }

    private Token peekNext() {
        if (current + 1 < tokens.size()) {
            return tokens.get(current + 1);
        }
        return null;
    }

    private Token previous() {
        return tokens.get(current - 1);
    }

    private boolean isAtEnd() {
        return peek().type() == TokenType.EOF;
    }

    private Token advance() {
        if (!isAtEnd()) current++;
        return previous();
    }

    private boolean check(TokenType type) {
        if (isAtEnd()) return false;
        return peek().type() == type;
    }

    private boolean match(TokenType... types) {
        for (TokenType type : types) {
            if (check(type)) {
                advance();
                return true;
            }
        }
        return false;
    }

    private Token consume(TokenType type, String message) {
        if (check(type)) return advance();
        throw error(peek(), message);
    }

    private ParseError error(Token token, String message) {
        return new ParseError(message, token.line(), token.column());
    }

    /**
     * Recuperación de errores: avanza tokens hasta encontrar el inicio
     * de una nueva sentencia (punto de sincronización).
     */
    private void synchronize() {
        advance();

        while (!isAtEnd()) {
            // Los keywords que inician sentencias son puntos de sincronización
            switch (peek().type()) {
                case LET:
                case DEF:
                case IF:
                case WHILE:
                case PRINT:
                case RETURN:
                    return;
                default:
                    break;
            }
            advance();
        }
    }
}
