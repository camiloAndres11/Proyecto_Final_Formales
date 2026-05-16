package com.mathlite.ast;

import java.util.List;

/**
 * Nodo de llamada a función.
 *
 * Ejemplos: area(base, altura), sin(x), factorial(5)
 *
 * @param name      Nombre de la función invocada
 * @param arguments Lista de expresiones pasadas como argumentos
 * @param line      Línea en el código fuente
 * @param column    Columna en el código fuente
 */
public record FuncCallNode(
    String name,
    List<ASTNode> arguments,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitFuncCall(this);
    }
}
