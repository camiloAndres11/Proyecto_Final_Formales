package com.mathlite.controller;

import com.mathlite.dto.ExecutionRequest;
import com.mathlite.dto.ExecutionResponse;
import com.mathlite.model.ExecutionRecord;
import com.mathlite.service.InterpreterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * REST Controller que expone los endpoints del intérprete MathLite.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InterpreterController {

    private final InterpreterService service;

    /**
     * POST /api/interpret — Ejecuta código MathLite completo (todas las fases).
     */
    @PostMapping("/interpret")
    public ResponseEntity<ExecutionResponse> interpret(@Valid @RequestBody ExecutionRequest request) {
        ExecutionResponse response = service.execute(request.code());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/history — Obtiene el historial de ejecuciones.
     */
    @GetMapping("/history")
    public ResponseEntity<List<ExecutionRecord>> getHistory() {
        return ResponseEntity.ok(service.getHistory());
    }

    /**
     * GET /api/history/{id} — Obtiene el detalle de una ejecución.
     */
    @GetMapping("/history/{id}")
    public ResponseEntity<ExecutionRecord> getExecution(@PathVariable String id) {
        return service.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/history/{id} — Elimina un registro de ejecución.
     */
    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteExecution(@PathVariable String id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
