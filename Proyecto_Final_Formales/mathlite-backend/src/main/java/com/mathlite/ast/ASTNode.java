package com.mathlite.ast;

/**
 * Interfaz sellada (sealed) base para todos los nodos del AST de MathLite.
 *
 * Cada nodo del AST almacena su posición en el código fuente (línea y columna)
 * para facilitar el reporte de errores en fases posteriores.
 *
 * Utiliza el patrón Visitor para permitir recorrer el árbol de forma polimórfica
 * sin acoplar la lógica de cada fase al propio nodo.
 */
public sealed interface ASTNode
    permits NumberNode, BoolNode, StringNode, VariableNode,
            BinOpNode, UnaryOpNode, AssignNode, FuncDefNode,
            FuncCallNode, IfNode, WhileNode, PrintNode,
            ReturnNode, BlockNode {

    /**
     * @return Línea del código fuente donde aparece este nodo (1-indexed)
     */
    int line();

    /**
     * @return Columna del código fuente donde aparece este nodo (1-indexed)
     */
    int column();

    /**
     * Acepta un visitor para procesar este nodo.
     * Cada implementación invoca el método visit correspondiente.
     *
     * @param visitor Visitor que procesará este nodo
     * @param <T>     Tipo de retorno del visitor
     * @return Resultado de la visita
     */
    <T> T accept(ASTVisitor<T> visitor);
}
