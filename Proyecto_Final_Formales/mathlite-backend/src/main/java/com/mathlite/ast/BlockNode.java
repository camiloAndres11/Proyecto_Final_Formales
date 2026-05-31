package com.mathlite.ast;

import java.util.List;

/**
 * Nodo de bloque (secuencia de sentencias).
 *
 * Representa el cuerpo de funciones, if/else, while, o el programa principal.
 *
 * @param statements Lista ordenada de sentencias del bloque
 * @param line       Línea del inicio del bloque
 * @param column     Columna del inicio del bloque
 */
public record BlockNode(
    List<ASTNode> statements,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitBlock(this);
    }
}
