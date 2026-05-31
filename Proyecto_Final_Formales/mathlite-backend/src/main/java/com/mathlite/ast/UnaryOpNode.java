package com.mathlite.ast;

import com.mathlite.lexer.TokenType;

/**
 * Nodo de operación unaria.
 *
 * Ejemplos: -x, not condition
 *
 * @param operator Tipo de operador unario (MINUS, NOT)
 * @param operand  Subexpresión sobre la que se aplica el operador
 * @param line     Línea en el código fuente
 * @param column   Columna en el código fuente
 */
public record UnaryOpNode(
    TokenType operator,
    ASTNode operand,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitUnaryOp(this);
    }
}
