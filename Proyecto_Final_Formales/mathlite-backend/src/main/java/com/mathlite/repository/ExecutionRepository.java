package com.mathlite.repository;

import com.mathlite.model.ExecutionRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio MongoDB para los registros de ejecución.
 */
@Repository
public interface ExecutionRepository extends MongoRepository<ExecutionRecord, String> {

    /**
     * Obtiene las ejecuciones más recientes ordenadas por fecha de creación.
     */
    List<ExecutionRecord> findAllByOrderByCreatedAtDesc();
}
