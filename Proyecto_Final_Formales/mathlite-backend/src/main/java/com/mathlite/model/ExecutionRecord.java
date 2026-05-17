package com.mathlite.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Documento MongoDB para persistir los registros de ejecución.
 */
@Data
@NoArgsConstructor
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
    private Instant createdAt = Instant.now();
}
