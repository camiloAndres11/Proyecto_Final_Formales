package com.mathlite.ast;

/**
 * Nodo de ciclo while.
 *
 * Ejemplo:
 * <pre>
 * while i <= 5 {
 *     print(i * i)
 *     let i = i + 1
 * }
 * </pre>
 *
 * @param condition Expresión de condición (evaluada antes de cada iteración)
 * @param body      Bloque ejecutado en cada iteración
 * @param line      Línea en el código fuente
 * @param column    Columna en el código fuente
 */
public record WhileNode(
    ASTNode condition,
    BlockNode body,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitWhile(this);
    }
}
