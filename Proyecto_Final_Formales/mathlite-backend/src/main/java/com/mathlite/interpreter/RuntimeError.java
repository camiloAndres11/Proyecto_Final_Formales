package com.mathlite.interpreter;

/**
 * Error en tiempo de ejecución del intérprete MathLite.
 */
public class RuntimeError extends RuntimeException {
    private final int line;
    private final int column;

    public RuntimeError(String message) {
        super(message);
        this.line = 0;
        this.column = 0;
    }

    public RuntimeError(String message, int line, int column) {
        super(message);
        this.line = line;
        this.column = column;
    }

    public int getLine() { return line; }
    public int getColumn() { return column; }

    @Override
    public String toString() {
        if (line > 0) {
            return String.format("Error runtime en L%d:C%d: %s", line, column, getMessage());
        }
        return "Error runtime: " + getMessage();
    }
}
