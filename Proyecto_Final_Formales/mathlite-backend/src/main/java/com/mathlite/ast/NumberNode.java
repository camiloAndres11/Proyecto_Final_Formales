package com.mathlite.ast;

/**
 * Nodo literal numérico (entero o real).
 *
 * Ejemplos: 42, 3.14, -7
 *
 * @param value     Valor numérico almacenado como double
 * @param isInteger true si el literal es entero, false si es real
 * @param line      Línea en el código fuente
 * @param column    Columna en el código fuente
 */
public record NumberNode(
    double value,
    boolean isInteger,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitNumber(this);
    }
}
