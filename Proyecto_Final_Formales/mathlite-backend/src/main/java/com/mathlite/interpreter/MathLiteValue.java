package com.mathlite.interpreter;

import com.mathlite.ast.FuncDefNode;

/**
 * Wrapper para valores en tiempo de ejecución de MathLite.
 * Soporta: Int, Real, Bool, String, Function.
 */
public class MathLiteValue {

    public enum Type { INT, REAL, BOOL, STRING, NULL, FUNCTION }

    private final Type type;
    private final Object value;
    // Entorno de captura para closures (solo para FUNCTION)
    private final Environment closure;

    private MathLiteValue(Type type, Object value) {
        this(type, value, null);
    }

    private MathLiteValue(Type type, Object value, Environment closure) {
        this.type = type;
        this.value = value;
        this.closure = closure;
    }

    public static MathLiteValue ofInt(int v)        { return new MathLiteValue(Type.INT, v); }
    public static MathLiteValue ofReal(double v)     { return new MathLiteValue(Type.REAL, v); }
    public static MathLiteValue ofBool(boolean v)    { return new MathLiteValue(Type.BOOL, v); }
    public static MathLiteValue ofString(String v)   { return new MathLiteValue(Type.STRING, v); }
    public static MathLiteValue ofNull()             { return new MathLiteValue(Type.NULL, null); }

    /** Crea un valor de tipo función (closure) que captura su entorno de definición. */
    public static MathLiteValue ofFunction(FuncDefNode def, Environment closure) {
        return new MathLiteValue(Type.FUNCTION, def, closure);
    }

    public Type getType()       { return type; }
    public int asInt()          { return (int) value; }
    public double asReal()      { return value instanceof Integer i ? i.doubleValue() : (double) value; }
    public boolean asBool()     { return (boolean) value; }
    public String asString()    { return (String) value; }
    public boolean isNumeric()  { return type == Type.INT || type == Type.REAL; }
    public boolean isFunction() { return type == Type.FUNCTION; }
    public FuncDefNode asFunction() { return (FuncDefNode) value; }
    public Environment getClosure() { return closure; }

    public double toDouble() {
        return switch (type) {
            case INT -> (int) value;
            case REAL -> (double) value;
            default -> throw new RuntimeError("No se puede convertir " + type + " a número");
        };
    }

    public boolean isTruthy() {
        return switch (type) {
            case BOOL -> (boolean) value;
            case NULL -> false;
            case INT -> (int) value != 0;
            case REAL -> (double) value != 0.0;
            case STRING -> !((String) value).isEmpty();
            case FUNCTION -> true;
        };
    }

    @Override
    public String toString() {
        return switch (type) {
            case INT -> String.valueOf((int) value);
            case REAL -> String.valueOf((double) value);
            case BOOL -> String.valueOf((boolean) value);
            case STRING -> (String) value;
            case NULL -> "null";
            case FUNCTION -> "<función " + ((FuncDefNode) value).name() + ">";
        };
    }
}
