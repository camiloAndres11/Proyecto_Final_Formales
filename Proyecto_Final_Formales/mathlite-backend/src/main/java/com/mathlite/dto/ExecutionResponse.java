package com.mathlite.dto;

import java.util.List;
import java.util.Map;

/**
 * DTO de respuesta con los resultados de la ejecución del intérprete.
 * Incluye output, tokens, AST serializado, y errores por fase.
 */
public record ExecutionResponse(
    boolean success,
    List<String> output,
    List<Map<String, Object>> tokens,
    Map<String, Object> ast,
    Map<String, List<String>> errors,
    long executionTimeMs
) {}
