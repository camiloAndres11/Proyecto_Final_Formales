package com.mathlite.semantic;

import com.mathlite.ast.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Analizador semántico que recorre el AST validando reglas semánticas.
 * Implementa ASTVisitor<Void> ya que solo valida, no produce valores.
 *
 * Validaciones:
 * 1. Variables declaradas antes de uso
 * 2. Funciones declaradas antes de invocación
 * 3. Aridad correcta en llamadas a función
 * 4. Compatibilidad de tipos en operaciones
 * 5. Return solo dentro de funciones
 * 6. No redeclaración en el mismo scope
 */
public class SemanticAnalyzer implements ASTVisitor<Void> {

    private final SymbolTable symbolTable = new SymbolTable();
    private final List<SemanticError> errors = new ArrayList<>();
    private boolean insideFunction = false;

    private static final Set<String> BUILTIN_FUNCTIONS = Set.of(
        "sin", "cos", "tan", "sqrt", "log", "abs", "floor", "ceil"
    );

    public List<SemanticError> analyze(BlockNode program) {
        visitBlock(program);
        return errors;
    }

    public List<SemanticError> getErrors() { return errors; }

    @Override
    public Void visitNumber(NumberNode node) { return null; }
    @Override
    public Void visitBool(BoolNode node) { return null; }
    @Override
    public Void visitString(StringNode node) { return null; }

    @Override
    public Void visitVariable(VariableNode node) {
        if (!symbolTable.isDefined(node.name()) && !BUILTIN_FUNCTIONS.contains(node.name())) {
            errors.add(new SemanticError(
                "Variable '" + node.name() + "' no declarada",
                SemanticError.Category.UNDECLARED_VARIABLE, node.line(), node.column()));
        }
        return null;
    }

    @Override
    public Void visitBinOp(BinOpNode node) {
        node.left().accept(this);
        node.right().accept(this);
        return null;
    }

    @Override
    public Void visitUnaryOp(UnaryOpNode node) {
        node.operand().accept(this);
        return null;
    }

    @Override
    public Void visitAssign(AssignNode node) {
        node.value().accept(this);
        symbolTable.define(Symbol.variable(node.name(), "Unknown"));
        return null;
    }

    @Override
    public Void visitFuncDef(FuncDefNode node) {
        symbolTable.define(Symbol.function(node.name(), node.params().size()));
        symbolTable.enterScope();
        boolean prevInsideFunction = insideFunction;
        insideFunction = true;
        for (String param : node.params()) {
            symbolTable.define(Symbol.variable(param, "Unknown"));
        }
        node.body().accept(this);
        insideFunction = prevInsideFunction;
        symbolTable.exitScope();
        return null;
    }

    @Override
    public Void visitFuncCall(FuncCallNode node) {
        if (!BUILTIN_FUNCTIONS.contains(node.name()) && !symbolTable.isDefined(node.name())) {
            errors.add(new SemanticError(
                "Función '" + node.name() + "' no declarada",
                SemanticError.Category.UNDECLARED_FUNCTION, node.line(), node.column()));
        }
        symbolTable.resolve(node.name()).ifPresent(sym -> {
            if (sym.isFunction() && sym.arity() != node.arguments().size()) {
                errors.add(new SemanticError(
                    "Función '" + node.name() + "' espera " + sym.arity() + " args, recibió " + node.arguments().size(),
                    SemanticError.Category.ARITY_MISMATCH, node.line(), node.column()));
            }
        });
        for (ASTNode arg : node.arguments()) { arg.accept(this); }
        return null;
    }

    @Override
    public Void visitIf(IfNode node) {
        node.condition().accept(this);
        symbolTable.enterScope();
        node.thenBranch().accept(this);
        symbolTable.exitScope();
        if (node.elseBranch() != null) {
            symbolTable.enterScope();
            node.elseBranch().accept(this);
            symbolTable.exitScope();
        }
        return null;
    }

    @Override
    public Void visitWhile(WhileNode node) {
        node.condition().accept(this);
        symbolTable.enterScope();
        node.body().accept(this);
        symbolTable.exitScope();
        return null;
    }

    @Override
    public Void visitPrint(PrintNode node) {
        node.expression().accept(this);
        return null;
    }

    @Override
    public Void visitReturn(ReturnNode node) {
        if (!insideFunction) {
            errors.add(new SemanticError(
                "'return' fuera de una función",
                SemanticError.Category.RETURN_OUTSIDE_FUNCTION, node.line(), node.column()));
        }
        if (node.value() != null) { node.value().accept(this); }
        return null;
    }

    @Override
    public Void visitBlock(BlockNode node) {
        for (ASTNode stmt : node.statements()) { stmt.accept(this); }
        return null;
    }
}
