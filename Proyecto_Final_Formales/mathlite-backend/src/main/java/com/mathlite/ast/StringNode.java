package com.mathlite.ast;

/**
 * Nodo literal de cadena de texto.
 *
 * Ejemplo: "Hola mundo"
 *
 * @param value  Valor del string (sin las comillas)
 * @param line   Línea en el código fuente
 * @param column Columna en el código fuente
 */
public record StringNode(
    String value,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitString(this);
    }
}
