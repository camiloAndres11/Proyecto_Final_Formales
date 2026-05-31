package com.mathlite.lexer;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Analizador léxico (scanner) para el lenguaje MathLite.
 *
 * Implementa un AFD manual que recorre el código fuente carácter por carácter
 * y produce una lista de tokens. NO utiliza generadores de parsers.
 *
 * Características:
 * - Reconoce todos los tokens definidos en {@link TokenType}
 * - Reporta errores léxicos sin abortar (recopila todos los errores)
 * - Ignora espacios en blanco y comentarios (-- comentario)
 * - Registra posición (línea/columna) para cada token
 */
public class Lexer {

    private final String source;
    private final List<Token> tokens = new ArrayList<>();
    /**
     * -- GETTER --
     *  Retorna los errores léxicos encontrados durante el escaneo.
     */
    @Getter
    private final List<String> errors = new ArrayList<>();

    private int start = 0;     // Inicio del lexema actual
    private int current = 0;   // Posición actual en el source
    private int line = 1;      // Línea actual (1-indexed)
    private int column = 1;    // Columna actual (1-indexed)
    private int startColumn = 1;

    /**
     * Mapa de palabras reservadas del lenguaje MathLite.
     * Mapea el lexema a su TokenType correspondiente.
     */
    private static final Map<String, TokenType> KEYWORDS = Map.ofEntries(
        Map.entry("let", TokenType.LET),
        Map.entry("def", TokenType.DEF),
        Map.entry("if", TokenType.IF),
        Map.entry("else", TokenType.ELSE),
        Map.entry("while", TokenType.WHILE),
        Map.entry("return", TokenType.RETURN),
        Map.entry("print", TokenType.PRINT),
        Map.entry("and", TokenType.AND),
        Map.entry("or", TokenType.OR),
        Map.entry("not", TokenType.NOT),
        Map.entry("true", TokenType.TRUE),
        Map.entry("false", TokenType.FALSE),
        Map.entry("sin", TokenType.SIN),
        Map.entry("cos", TokenType.COS),
        Map.entry("tan", TokenType.TAN),
        Map.entry("sqrt", TokenType.SQRT),
        Map.entry("log", TokenType.LOG),
        Map.entry("abs", TokenType.ABS),
        Map.entry("floor", TokenType.FLOOR),
        Map.entry("ceil", TokenType.CEIL)
    );

    public Lexer(String source) {
        this.source = source;
    }

    /**
     * Escanea todo el código fuente y produce la lista de tokens.
     *
     * @return Lista de tokens, siempre terminada con un token EOF
     */
    public List<Token> tokenize() {
        while (!isAtEnd()) {
            start = current;
            startColumn = column;
            scanToken();
        }

        tokens.add(new Token(TokenType.EOF, "", line, column));
        return tokens;
    }

    // ============================================================
    // Métodos principales del scanner
    // ============================================================

    /**
     * Escanea un solo token desde la posición actual.
     * Implementa el AFD principal del lexer.
     */
    private void scanToken() {
        char c = advance();

        switch (c) {
            // --- Delimitadores y operadores de un solo carácter ---
            case '(' -> addToken(TokenType.LPAREN);
            case ')' -> addToken(TokenType.RPAREN);
            case '{' -> addToken(TokenType.LBRACE);
            case '}' -> addToken(TokenType.RBRACE);
            case ',' -> addToken(TokenType.COMMA);
            case '+' -> addToken(TokenType.PLUS);
            case '*' -> addToken(TokenType.STAR);
            case '/' -> addToken(TokenType.SLASH);
            case '^' -> addToken(TokenType.CARET);
            case '%' -> addToken(TokenType.PERCENT);

            // --- Operadores que pueden ser dobles ---
            case '-' -> {
                if (match('-')) {
                    // Comentario: -- hasta fin de línea
                    skipComment();
                } else {
                    addToken(TokenType.MINUS);
                }
            }
            case '=' -> {
                if (match('=')) {
                    addToken(TokenType.EQUAL_EQUAL);
                } else {
                    addToken(TokenType.EQUAL);
                }
            }
            case '!' -> {
                if (match('=')) {
                    addToken(TokenType.BANG_EQUAL);
                } else {
                    reportError("Carácter inesperado '!'");
                }
            }
            case '<' -> {
                if (match('=')) {
                    addToken(TokenType.LESS_EQUAL);
                } else {
                    addToken(TokenType.LESS);
                }
            }
            case '>' -> {
                if (match('=')) {
                    addToken(TokenType.GREATER_EQUAL);
                } else {
                    addToken(TokenType.GREATER);
                }
            }

            // --- Strings ---
            case '"' -> scanString();

            // --- Newlines ---
            case '\n' -> {
                addToken(TokenType.NEWLINE);
                line++;
                column = 1;
            }

            // --- Espacios en blanco (ignorar) ---
            case ' ', '\r', '\t' -> {
                // Ignorar
            }

            // --- Números e identificadores ---
            default -> {
                if (isDigit(c)) {
                    scanNumber();
                } else if (isAlpha(c)) {
                    scanIdentifier();
                } else {
                    reportError("Carácter inválido '" + c + "'");
                }
            }
        }
    }

    /**
     * AFD para reconocer números enteros y reales.
     * Transiciones: dígito+ ('.' dígito+)?
     */
    private void scanNumber() {
        while (!isAtEnd() && isDigit(peek())) {
            advance();
        }

        // Verificar si es un número real (tiene parte decimal)
        if (!isAtEnd() && peek() == '.' && isDigit(peekNext())) {
            advance(); // consumir el '.'
            while (!isAtEnd() && isDigit(peek())) {
                advance();
            }
            addToken(TokenType.REAL_LITERAL);
        } else {
            addToken(TokenType.INTEGER_LITERAL);
        }
    }

    /**
     * AFD para reconocer identificadores y palabras reservadas.
     * Transiciones: letra (letra | dígito | '_')*
     */
    private void scanIdentifier() {
        while (!isAtEnd() && isAlphaNumeric(peek())) {
            advance();
        }

        String text = source.substring(start, current);
        TokenType type = KEYWORDS.getOrDefault(text, TokenType.IDENTIFIER);
        addToken(type);
    }

    /**
     * AFD para reconocer string literals.
     * Transiciones: '"' (cualquier carácter excepto '"')* '"'
     * Reporta error si el string no se cierra.
     */
    private void scanString() {
        while (!isAtEnd() && peek() != '"' && peek() != '\n') {
            advance();
        }

        if (isAtEnd() || peek() == '\n') {
            reportError("String sin cerrar");
            return;
        }

        advance(); // consumir el '"' de cierre
        // El lexema incluye las comillas, el valor no
        addToken(TokenType.STRING_LITERAL);
    }

    /**
     * Ignora un comentario de línea (-- hasta fin de línea).
     */
    private void skipComment() {
        while (!isAtEnd() && peek() != '\n') {
            advance();
        }
    }

    // ============================================================
    // Métodos auxiliares de navegación
    // ============================================================

    private char advance() {
        char c = source.charAt(current);
        current++;
        column++;
        return c;
    }

    private char peek() {
        if (isAtEnd()) return '\0';
        return source.charAt(current);
    }

    private char peekNext() {
        if (current + 1 >= source.length()) return '\0';
        return source.charAt(current + 1);
    }

    private boolean match(char expected) {
        if (isAtEnd()) return false;
        if (source.charAt(current) != expected) return false;
        current++;
        column++;
        return true;
    }

    private boolean isAtEnd() {
        return current >= source.length();
    }

    private boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    private boolean isAlpha(char c) {
        return (c >= 'a' && c <= 'z') ||
               (c >= 'A' && c <= 'Z') ||
               c == '_';
    }

    private boolean isAlphaNumeric(char c) {
        return isAlpha(c) || isDigit(c);
    }

    // ============================================================
    // Métodos de producción de tokens y errores
    // ============================================================

    private void addToken(TokenType type) {
        String lexeme = source.substring(start, current);
        tokens.add(new Token(type, lexeme, line, startColumn));
    }

    private void reportError(String message) {
        String errorMsg = String.format("Error léxico en L%d:C%d: %s", line, startColumn, message);
        errors.add(errorMsg);
        // Añadir token de error para que el parser pueda reportar el contexto
        String lexeme = source.substring(start, current);
        tokens.add(new Token(TokenType.ERROR, lexeme, line, startColumn));
    }
}
