package com.mathlite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicación MathLite Interpreter.
 * Backend Spring Boot que expone una REST API para interpretar código MathLite.
 */
@SpringBootApplication
public class MathLiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(MathLiteApplication.class, args);
    }
}
