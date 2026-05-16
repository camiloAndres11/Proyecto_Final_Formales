package com.mathlite.interpreter;

/**
 * Excepción de control de flujo para implementar 'return'.
 * No es un error real: se usa para desenrollar la pila de llamadas
 * cuando se ejecuta una sentencia return dentro de una función.
 */
public class ReturnException extends RuntimeException {
    private final MathLiteValue value;

    public ReturnException(MathLiteValue value) {
        super(null, null, true, false); // Sin overhead de stack trace
        this.value = value;
    }

    public MathLiteValue getValue() { return value; }
}
