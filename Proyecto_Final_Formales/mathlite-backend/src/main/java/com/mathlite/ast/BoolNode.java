package com.mathlite.ast;

/**
 * Nodo literal booleano.
 *
 * Ejemplos: true, false
 *
 * @param value  Valor booleano
 * @param line   Línea en el código fuente
 * @param column Columna en el código fuente
 */
public record BoolNode(
    boolean value,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitBool(this);
    }
}
