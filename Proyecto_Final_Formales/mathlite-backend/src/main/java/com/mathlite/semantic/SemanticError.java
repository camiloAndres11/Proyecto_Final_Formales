package com.mathlite.semantic;

/**
 * Representa un error semántico detectado durante el análisis.
 *
 * Categorías de errores semánticos:
 * 1. Variable no declarada
 * 2. Variable ya declarada (en el mismo scope)
 * 3. Función no declarada
 * 4. Aridad incorrecta (número de argumentos)
 * 5. Tipos incompatibles
 * 6. Return fuera de función
 */
public class SemanticError extends RuntimeException {

    public enum Category {
        UNDECLARED_VARIABLE,
        DUPLICATE_VARIABLE,
        UNDECLARED_FUNCTION,
        ARITY_MISMATCH,
        TYPE_INCOMPATIBLE,
        RETURN_OUTSIDE_FUNCTION
    }

    private final Category category;
    private final int line;
    private final int column;

    public SemanticError(String message, Category category, int line, int column) {
        super(message);
        this.category = category;
        this.line = line;
        this.column = column;
    }

    public Category getCategory() {
        return category;
    }

    public int getLine() {
        return line;
    }

    public int getColumn() {
        return column;
    }

    @Override
    public String toString() {
        return String.format("Error semántico [%s] en L%d:C%d: %s", category, line, column, getMessage());
    }
}
