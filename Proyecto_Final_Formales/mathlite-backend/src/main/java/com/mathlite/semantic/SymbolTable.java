package com.mathlite.semantic;

import java.util.*;

/**
 * Tabla de símbolos con soporte para scopes anidados.
 *
 * Implementa un stack de scopes donde cada scope es un Map<String, Symbol>.
 * El scope global está siempre en la base del stack.
 *
 * Operaciones:
 * - enterScope(): crear un nuevo scope (al entrar a función, if, while)
 * - exitScope(): destruir el scope actual (al salir del bloque)
 * - define(): registrar un símbolo en el scope actual
 * - resolve(): buscar un símbolo desde el scope actual hacia el global
 */
public class SymbolTable {

    private final Deque<Map<String, Symbol>> scopes = new ArrayDeque<>();

    public SymbolTable() {
        // Iniciar con el scope global
        enterScope();
    }

    /**
     * Crea y entra a un nuevo scope (push).
     */
    public void enterScope() {
        scopes.push(new HashMap<>());
    }

    /**
     * Sale del scope actual (pop).
     */
    public void exitScope() {
        if (scopes.size() > 1) {
            scopes.pop();
        }
    }

    /**
     * Define un símbolo en el scope actual.
     *
     * @param symbol Símbolo a registrar
     * @return true si se registró exitosamente, false si ya existe en el scope actual
     */
    public boolean define(Symbol symbol) {
        Map<String, Symbol> currentScope = scopes.peek();
        if (currentScope.containsKey(symbol.name())) {
            return false; // Ya existe en este scope
        }
        currentScope.put(symbol.name(), symbol);
        return true;
    }

    /**
     * Busca un símbolo desde el scope más interno hasta el global.
     *
     * @param name Nombre del símbolo
     * @return Optional con el símbolo si se encuentra, vacío si no
     */
    public Optional<Symbol> resolve(String name) {
        for (Map<String, Symbol> scope : scopes) {
            if (scope.containsKey(name)) {
                return Optional.of(scope.get(name));
            }
        }
        return Optional.empty();
    }

    /**
     * Verifica si un símbolo está definido en algún scope visible.
     */
    public boolean isDefined(String name) {
        return resolve(name).isPresent();
    }

    /**
     * Verifica si estamos en el scope global (solo hay un scope en el stack).
     */
    public boolean isGlobalScope() {
        return scopes.size() == 1;
    }

    /**
     * Retorna la profundidad actual de scopes.
     */
    public int depth() {
        return scopes.size();
    }
}
