package com.mathlite.ast;

/**
 * Nodo de referencia a variable.
 *
 * Ejemplo: x, resultado, base
 *
 * @param name   Nombre de la variable referenciada
 * @param line   Línea en el código fuente
 * @param column Columna en el código fuente
 */
public record VariableNode(
    String name,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitVariable(this);
    }
}
