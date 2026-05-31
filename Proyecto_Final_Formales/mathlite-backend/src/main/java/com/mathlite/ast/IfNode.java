package com.mathlite.ast;

/**
 * Nodo condicional if/else.
 *
 * Ejemplo:
 * <pre>
 * if x > 0 {
 *     print(x)
 * } else {
 *     print(-x)
 * }
 * </pre>
 *
 * @param condition  Expresión de condición (debe evaluar a booleano)
 * @param thenBranch Bloque ejecutado si la condición es verdadera
 * @param elseBranch Bloque ejecutado si la condición es falsa (puede ser null)
 * @param line       Línea en el código fuente
 * @param column     Columna en el código fuente
 */
public record IfNode(
    ASTNode condition,
    BlockNode thenBranch,
    BlockNode elseBranch,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitIf(this);
    }
}
