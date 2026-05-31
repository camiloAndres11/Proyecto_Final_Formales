package com.mathlite.lexer;

/**
 * Enumeración de todos los tipos de tokens del lenguaje MathLite.
 * Basado en las 45 categorías definidas en la especificación formal.
 */
public enum TokenType {

    // --- Literales ---
    INTEGER_LITERAL,    // 42, -7
    REAL_LITERAL,       // 3.14, -0.5
    STRING_LITERAL,     // "hello"
    TRUE,               // true
    FALSE,              // false

    // --- Identificadores ---
    IDENTIFIER,         // nombreVariable, area, x

    // --- Palabras reservadas ---
    LET,                // let
    DEF,                // def
    IF,                 // if
    ELSE,               // else
    WHILE,              // while
    RETURN,             // return
    PRINT,              // print
    AND,                // and
    OR,                 // or
    NOT,                // not

    // --- Funciones matemáticas integradas ---
    SIN,                // sin
    COS,                // cos
    TAN,                // tan
    SQRT,               // sqrt
    LOG,                // log
    ABS,                // abs
    FLOOR,              // floor
    CEIL,               // ceil

    // --- Operadores aritméticos ---
    PLUS,               // +
    MINUS,              // -
    STAR,               // *
    SLASH,              // /
    CARET,              // ^
    PERCENT,            // %

    // --- Operadores relacionales ---
    EQUAL_EQUAL,        // ==
    BANG_EQUAL,         // !=
    LESS,               // <
    GREATER,            // >
    LESS_EQUAL,         // <=
    GREATER_EQUAL,      // >=

    // --- Delimitadores ---
    LPAREN,             // (
    RPAREN,             // )
    LBRACE,             // {
    RBRACE,             // }
    COMMA,              // ,
    EQUAL,              // =

    // --- Especiales ---
    NEWLINE,            // Fin de línea (separador de sentencias)
    EOF,                // Fin de archivo

    // --- Error ---
    ERROR               // Token de error léxico
}
