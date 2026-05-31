package com.mathlite.ast;

import java.util.List;

/**
 * Nodo de definición de función.
 *
 * Ejemplo:
 * <pre>
 * def area(b, h) {
 *     return (b * h) / 2
 * }
 * </pre>
 *
 * @param name   Nombre de la función
 * @param params Lista de nombres de parámetros
 * @param body   Cuerpo de la función (bloque de sentencias)
 * @param line   Línea en el código fuente (posición de 'def')
 * @param column Columna en el código fuente
 */
public record FuncDefNode(
    String name,
    List<String> params,
    BlockNode body,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitFuncDef(this);
    }
}
