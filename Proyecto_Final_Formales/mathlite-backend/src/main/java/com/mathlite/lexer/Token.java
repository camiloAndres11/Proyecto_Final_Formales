package com.mathlite.lexer;

/**
 * Representa un token producido por el analizador léxico.
 * Incluye tipo, lexema, y posición (línea y columna) para reportar errores.
 *
 * @param type   Tipo del token (ver {@link TokenType})
 * @param lexeme Texto original del token en el código fuente
 * @param line   Número de línea donde aparece (1-indexed)
 * @param column Número de columna donde inicia (1-indexed)
 */
public record Token(
    TokenType type,
    String lexeme,
    int line,
    int column
) {
    @Override
    public String toString() {
        return String.format("Token{%s, '%s', L%d:C%d}", type, lexeme, line, column);
    }
}
