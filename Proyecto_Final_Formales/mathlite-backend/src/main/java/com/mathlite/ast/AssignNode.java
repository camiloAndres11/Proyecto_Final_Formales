package com.mathlite.ast;

/**
 * Nodo de asignación / declaración de variable.
 *
 * Ejemplo: let x = 5
 *
 * Semántica: Si la variable ya existe en el entorno actual, se reasigna.
 * Si no existe, se declara como nueva.
 *
 * @param name   Nombre de la variable
 * @param value  Expresión asignada (subárbol AST)
 * @param line   Línea en el código fuente
 * @param column Columna en el código fuente
 */
public record AssignNode(
    String name,
    ASTNode value,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitAssign(this);
    }
}
