package com.mathlite.interpreter;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Funciones matemáticas integradas de MathLite.
 * Implementa: sin, cos, tan, sqrt, log, abs, floor, ceil
 */
public class BuiltinFunctions {

    private static final Map<String, Function<List<MathLiteValue>, MathLiteValue>> FUNCTIONS = Map.of(
        "sin",   args -> applyMath(args, Math::sin),
        "cos",   args -> applyMath(args, Math::cos),
        "tan",   args -> applyMath(args, Math::tan),
        "sqrt",  args -> applyMath(args, Math::sqrt),
        "log",   args -> applyMath(args, Math::log),
        "abs",   args -> applyMath(args, Math::abs),
        "floor", args -> applyMath(args, Math::floor),
        "ceil",  args -> applyMath(args, Math::ceil)
    );

    public static boolean isBuiltin(String name) {
        return FUNCTIONS.containsKey(name);
    }

    public static MathLiteValue call(String name, List<MathLiteValue> args) {
        Function<List<MathLiteValue>, MathLiteValue> fn = FUNCTIONS.get(name);
        if (fn == null) throw new RuntimeError("Función integrada '" + name + "' no existe");
        return fn.apply(args);
    }

    private static MathLiteValue applyMath(List<MathLiteValue> args,
                                            java.util.function.DoubleUnaryOperator op) {
        if (args.size() != 1) {
            throw new RuntimeError("Función matemática espera 1 argumento, recibió " + args.size());
        }
        MathLiteValue arg = args.get(0);
        if (!arg.isNumeric()) {
            throw new RuntimeError("Función matemática requiere un argumento numérico");
        }
        double result = op.applyAsDouble(arg.toDouble());
        return MathLiteValue.ofReal(result);
    }
}
