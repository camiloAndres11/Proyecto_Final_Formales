package com.mathlite.ast;

/**
 * Nodo de sentencia print.
 *
 * Ejemplo: print(resultado)
 *
 * @param expression Expresión cuyo valor se imprime
 * @param line       Línea en el código fuente
 * @param column     Columna en el código fuente
 */
public record PrintNode(
    ASTNode expression,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitPrint(this);
    }
}
