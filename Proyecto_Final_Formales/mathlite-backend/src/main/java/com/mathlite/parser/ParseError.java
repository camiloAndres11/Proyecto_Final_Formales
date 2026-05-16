package com.mathlite.parser;

/**
 * Representa un error sintáctico detectado durante el parsing.
 */
public class ParseError extends RuntimeException {

    private final int line;
    private final int column;

    public ParseError(String message, int line, int column) {
        super(message);
        this.line = line;
        this.column = column;
    }

    public int getLine() {
        return line;
    }

    public int getColumn() {
        return column;
    }

    @Override
    public String toString() {
        return String.format("Error sintáctico en L%d:C%d: %s", line, column, getMessage());
    }
}
