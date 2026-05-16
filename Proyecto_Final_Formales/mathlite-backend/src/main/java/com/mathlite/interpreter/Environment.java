package com.mathlite.interpreter;

import java.util.HashMap;
import java.util.Map;

/**
 * Entorno de ejecución con soporte para scoping léxico (anidado).
 * Cada entorno tiene un mapa de variables y una referencia al entorno padre.
 */
public class Environment {
    private final Map<String, MathLiteValue> variables = new HashMap<>();
    private final Environment parent;

    /** Entorno global (sin padre). */
    public Environment() { this.parent = null; }

    /** Entorno hijo (scope local). */
    public Environment(Environment parent) { this.parent = parent; }

    public void define(String name, MathLiteValue value) {
        variables.put(name, value);
    }

    public MathLiteValue get(String name) {
        if (variables.containsKey(name)) return variables.get(name);
        if (parent != null) return parent.get(name);
        throw new RuntimeError("Variable '" + name + "' no definida");
    }

    /**
     * Asigna valor a una variable existente (busca en la cadena de scopes).
     * Si la variable no existe en ningún scope, la define en el scope actual.
     */
    public void assign(String name, MathLiteValue value) {
        if (variables.containsKey(name)) {
            variables.put(name, value);
            return;
        }
        if (parent != null) {
            parent.assign(name, value);
            return;
        }
        // Si no existe en ningún scope, definir en el actual
        variables.put(name, value);
    }

    public Environment getParent() { return parent; }
}
