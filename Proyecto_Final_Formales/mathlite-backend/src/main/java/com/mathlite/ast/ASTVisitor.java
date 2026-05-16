package com.mathlite.ast;

/**
 * Interfaz Visitor para recorrer los nodos del AST.
 *
 * Cada fase del intérprete (semántica, interpretación) implementa este visitor
 * con un tipo de retorno apropiado:
 * - SemanticAnalyzer: ASTVisitor<Void> (solo valida, no retorna valores)
 * - Interpreter: ASTVisitor<MathLiteValue> (evalúa y retorna valores)
 *
 * @param <T> Tipo de retorno de cada método visit
 */
public interface ASTVisitor<T> {

    T visitNumber(NumberNode node);

    T visitBool(BoolNode node);

    T visitString(StringNode node);

    T visitVariable(VariableNode node);

    T visitBinOp(BinOpNode node);

    T visitUnaryOp(UnaryOpNode node);

    T visitAssign(AssignNode node);

    T visitFuncDef(FuncDefNode node);

    T visitFuncCall(FuncCallNode node);

    T visitIf(IfNode node);

    T visitWhile(WhileNode node);

    T visitPrint(PrintNode node);

    T visitReturn(ReturnNode node);

    T visitBlock(BlockNode node);
}
