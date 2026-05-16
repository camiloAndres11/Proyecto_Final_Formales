package com.mathlite.ast;

/**
 * Nodo de sentencia return.
 *
 * Ejemplo: return (b * h) / 2
 *
 * @param value  Expresión a retornar (puede ser null para return vacío)
 * @param line   Línea en el código fuente
 * @param column Columna en el código fuente
 */
public record ReturnNode(
    ASTNode value,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitReturn(this);
    }
}
