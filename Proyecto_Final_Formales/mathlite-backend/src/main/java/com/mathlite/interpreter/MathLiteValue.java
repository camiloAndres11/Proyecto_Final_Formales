package com.mathlite.interpreter;

/**
 * Wrapper para valores en tiempo de ejecución de MathLite.
 * Soporta: Int, Real, Bool, String.
 */
public class MathLiteValue {

    public enum Type { INT, REAL, BOOL, STRING, NULL }

    private final Type type;
    private final Object value;

    private MathLiteValue(Type type, Object value) {
        this.type = type;
        this.value = value;
    }

    public static MathLiteValue ofInt(int v)        { return new MathLiteValue(Type.INT, v); }
    public static MathLiteValue ofReal(double v)     { return new MathLiteValue(Type.REAL, v); }
    public static MathLiteValue ofBool(boolean v)    { return new MathLiteValue(Type.BOOL, v); }
    public static MathLiteValue ofString(String v)   { return new MathLiteValue(Type.STRING, v); }
    public static MathLiteValue ofNull()             { return new MathLiteValue(Type.NULL, null); }

    public Type getType()       { return type; }
    public int asInt()          { return (int) value; }
    public double asReal()      { return value instanceof Integer i ? i.doubleValue() : (double) value; }
    public boolean asBool()     { return (boolean) value; }
    public String asString()    { return (String) value; }
    public boolean isNumeric()  { return type == Type.INT || type == Type.REAL; }

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
        };
    }
}
