package com.mathlite.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Documento MongoDB para persistir los registros de ejecución.
 */
@Document(collection = "executions")
public class ExecutionRecord {

    @Id
    private String id;
    private String code;
    private List<String> output;
    private Map<String, Object> astJson;
    private Map<String, List<String>> errors;
    private boolean success;
    private long executionTimeMs;
    private Instant createdAt;

    public ExecutionRecord() {
        this.createdAt = Instant.now();
    }

    // --- Getters y Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public List<String> getOutput() { return output; }
    public void setOutput(List<String> output) { this.output = output; }

    public Map<String, Object> getAstJson() { return astJson; }
    public void setAstJson(Map<String, Object> astJson) { this.astJson = astJson; }

    public Map<String, List<String>> getErrors() { return errors; }
    public void setErrors(Map<String, List<String>> errors) { this.errors = errors; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
