package com.mathlite.semantic;

/**
 * Representa un símbolo en la tabla de símbolos.
 *
 * @param name    Nombre del símbolo (variable o función)
 * @param type    Tipo inferido ("Int", "Real", "Bool", "String", "Function", "Unknown")
 * @param isFunction true si es una definición de función
 * @param arity   Número de parámetros (solo relevante para funciones)
 */
public record Symbol(
    String name,
    String type,
    boolean isFunction,
    int arity
) {
    /**
     * Crea un símbolo para una variable.
     */
    public static Symbol variable(String name, String type) {
        return new Symbol(name, type, false, 0);
    }

    /**
     * Crea un símbolo para una función.
     */
    public static Symbol function(String name, int arity) {
        return new Symbol(name, "Function", true, arity);
    }
}
