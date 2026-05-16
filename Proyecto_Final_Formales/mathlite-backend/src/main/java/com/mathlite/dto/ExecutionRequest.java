package com.mathlite.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para solicitudes de ejecución de código MathLite.
 */
public record ExecutionRequest(
    @NotBlank(message = "El código no puede estar vacío")
    String code
) {}
