# Proyecto Final — Lenguajes Formales, Autómatas e Investigación sobre Implementación de Compiladores

## Proyecto
**Intérprete con Análisis Semántico para un DSL de Cálculos Matemáticos**

- Período académico: 2026-1
- Modalidad: grupos de 2 estudiantes
- Duración: 8 semanas

---

# 1. Descripción General del Proyecto

Los estudiantes diseñarán e implementarán un intérprete completo para un lenguaje de dominio específico (DSL) orientado a cálculos matemáticos básicos.

El proyecto integra:

- Lenguajes formales
- Autómatas finitos
- Gramáticas libres de contexto
- Análisis léxico
- Análisis sintáctico
- Análisis semántico
- Interpretación mediante recorrido de árbol

El sistema permitirá:

- Declarar variables
- Definir funciones
- Evaluar expresiones aritméticas
- Ejecutar estructuras de control

El intérprete procesará el código fuente mediante las fases clásicas de compilación y mostrará resultados en una aplicación web desplegada en la nube.

---

# 2. Objetivos del Proyecto

## 2.1 Objetivo General

Construir un intérprete funcional para el DSL aplicando:

- análisis léxico,
- análisis sintáctico con AST,
- análisis semántico,
- interpretación,
- documentación formal,
- casos de prueba.

## 2.2 Objetivos Específicos

- Definir alfabeto, tokens y gramática EBNF/BNF.
- Implementar lexer con reporte de errores.
- Construir parser recursivo descendente.
- Diseñar nodos AST.
- Implementar análisis semántico.
- Desarrollar intérprete mediante recorrido del AST.
- Manejar errores en todas las fases.
- Crear interfaz web con almacenamiento NoSQL en la nube.

---

# 3. Especificación del Lenguaje

## 3.1 Características Generales

- Lenguaje imperativo
- Tipado dinámico
- Evaluación estricta

## 3.2 Tipos de Datos

| Tipo | Descripción |
|---|---|
| Int | Enteros positivos y negativos |
| Real | Números decimales |
| Bool | true / false |
| String | Texto entre comillas |

## 3.3 Construcciones del Lenguaje

- Variables:
```mathlite
let x = 5
let y = 3.14
```

- Operadores:
```text
+, -, *, /, ^, %, ()
```

- Operadores relacionales/lógicos:
```text
== != < > <= >= and or not
```

- Funciones:
```mathlite
def nombre(p1, p2) {
    return expr
}
```

- Condicionales:
```mathlite
if condicion {
    ...
} else {
    ...
}
```

- Ciclos:
```mathlite
while condicion {
    ...
}
```

- Funciones integradas:
```text
sin, cos, tan, sqrt, log, abs, floor, ceil
```

- Salida:
```mathlite
print(expr)
```

- Comentarios:
```text
-- comentario
```

---

# 4. Ejemplo de Programa

```mathlite
-- Declaración de variables
let base = 5
let altura = 3.0

-- Función área
def area(b, h) {
    return (b * h) / 2
}

-- Uso de función
let resultado = area(base, altura)

print(resultado)

-- Ciclo while
let i = 1

while i <= 5 {
    print(i * i)
    let i = i + 1
}
```

---

# 5. Fases del Proyecto

| Fase | Nombre | Peso |
|---|---|---|
| 1 | Especificación Formal | 10% |
| 2 | Analizador Léxico | 15% |
| 3 | Parser y AST | 25% |
| 4 | Análisis Semántico | 20% |
| 5 | Intérprete | 20% |
| 6 | Web y Pruebas | 10% |

---

# 6. Fase 1 — Especificación Formal

## Entregables

- Definición del alfabeto Σ
- Tokens
- Gramática EBNF
- AFDs
- FIRST/FOLLOW
- Árboles de derivación

---

# 7. Fase 2 — Analizador Léxico

## Requerimientos

- Reconocer todos los tokens
- Incluir:
  - tipo
  - lexema
  - línea
  - columna
- Detectar errores léxicos sin abortar
- Ignorar espacios y comentarios
- Mostrar flujo de tokens
- Documentar equivalencia AFD ↔ implementación

---

# 8. Fase 3 — Parser y AST

## Requerimientos

- Parser LL(1)
- AST completo
- Visualización del AST
- Errores sintácticos detallados

## Nodos requeridos

- BinOpNode
- NumberNode
- VariableNode
- AssignNode
- FuncDefNode
- FuncCallNode
- IfNode
- WhileNode
- PrintNode
- BlockNode
- ReturnNode

---

# 9. Fase 4 — Análisis Semántico

## Requerimientos

- Tabla de símbolos
- Alcance global y local
- Verificación de variables
- Validación de funciones
- Compatibilidad de tipos
- Validación de return
- Inferencia de tipos

## Errores semánticos

Debe reportar mínimo 6 categorías de errores.

---

# 10. Fase 5 — Intérprete

## Requerimientos

- Visitor pattern o equivalente
- Entornos separados por función
- Evaluación de expresiones
- if/else y while
- Funciones definidas por usuario
- Funciones matemáticas integradas
- Manejo de errores runtime
- REPL interactivo

## Errores runtime

- División por cero
- Función inexistente
- Argumentos inválidos

---

# 11. Fase 6 — Aplicación Web y Pruebas

## Aplicación Web

Debe incluir:

- Editor de código
- Botón ejecutar
- Consola de salida
- Diagnósticos
- Visualización AST
- Base de datos NoSQL
- Despliegue en nube

## Base de datos permitida

- Firebase
- MongoDB Atlas
- DynamoDB
- Cosmos DB

## Despliegue permitido

- AWS
- Azure
- GCP
- Render

---

# 12. Suite de Pruebas

## Requisito

Mínimo 25 casos automatizados.

## Debe cubrir

- Casos válidos
- Errores léxicos
- Errores sintácticos
- Errores semánticos
- Errores runtime

---

# 13. Casos Obligatorios

## Programas válidos

- Expresión aritmética con precedencia
- Factorial recursivo
- Ciclo while acumulador
- Funciones trigonométricas
- Funciones llamando funciones

## Errores léxicos

- Caracter inválido
- String sin cerrar

## Errores sintácticos

- Paréntesis sin cerrar
- Función sin llaves
- if sin condición

## Errores semánticos

- Variable no declarada
- Aridad incorrecta
- Tipos incompatibles
- return fuera de función

## Errores runtime

- División por cero
- Función inexistente

---

# 14. Requerimientos Funcionales

1. Tokenizar programas
2. Detectar errores léxicos
3. Construir AST
4. Detectar errores sintácticos
5. Validar semántica
6. Evaluar expresiones
7. Ejecutar estructuras de control
8. Mostrar print()
9. Guardar casos en DB

---

# 15. Criterios de Evaluación

| Fase | Peso |
|---|---|
| Formalización | 10% |
| Lexer | 15% |
| Parser + AST | 25% |
| Semántica | 20% |
| Intérprete | 20% |
| Web + pruebas | 10% |

---

# 16. Documentación Técnica Requerida

El informe debe incluir:

- Alfabeto
- Tokens
- Gramática
- AFD
- Flujo del intérprete
- AST
- Árboles de derivación
- Reglas semánticas
- Casos especiales
- Manual de usuario

---

# 17. Restricciones Técnicas

## No permitido

- ANTLR
- Yacc
- Bison
- eval()

## Permitido

- Regex documentadas
- Java
- Python
- JS
- C++
- Go
- Frameworks web

## Requisito obligatorio

Base de datos NoSQL en la nube.

---

# 18. Integridad Académica

- Código original obligatorio
- Revisiones individuales
- Declarar uso de IA generativa
- Se aplicará detección de plagio

---

# 19. Estado Actual del Proyecto del Grupo

Según el documento LaTeX suministrado, el grupo ya implementó/documentó:

- Alfabeto Σ
- 45 categorías de tokens
- Gramática EBNF completa
- AFD para:
  - identificadores
  - enteros
  - reales
  - operadores dobles
- FIRST y FOLLOW
- Árboles de derivación
- Arquitectura del lexer
- Equivalencia AFD ↔ Java
- Manejo de errores léxicos
- Diagrama de flujo
- Casos de prueba

---


