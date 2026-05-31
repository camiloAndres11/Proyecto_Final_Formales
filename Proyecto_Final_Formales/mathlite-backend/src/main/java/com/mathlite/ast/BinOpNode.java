package com.mathlite.ast;

import com.mathlite.lexer.TokenType;

/**
 * Nodo de operación binaria.
 *
 * Representa operaciones con dos operandos: aritméticas, relacionales y lógicas.
 *
 * Ejemplos: x + y, a * b, i <= 5, cond1 and cond2
 *
 * @param left     Operando izquierdo (subárbol)
 * @param operator Tipo de operador (PLUS, MINUS, STAR, EQUAL_EQUAL, AND, etc.)
 * @param right    Operando derecho (subárbol)
 * @param line     Línea del operador en el código fuente
 * @param column   Columna del operador en el código fuente
 */
public record BinOpNode(
    ASTNode left,
    TokenType operator,
    ASTNode right,
    int line,
    int column
) implements ASTNode {

    @Override
    public <T> T accept(ASTVisitor<T> visitor) {
        return visitor.visitBinOp(this);
    }
}
