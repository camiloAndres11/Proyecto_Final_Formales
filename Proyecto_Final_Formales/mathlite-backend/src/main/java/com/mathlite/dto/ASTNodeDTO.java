package com.mathlite.dto;

import com.mathlite.ast.*;
import java.util.*;

/**
 * Utilidad para serializar nodos del AST a Maps (para JSON).
 */
public class ASTNodeDTO {

    public static Map<String, Object> toMap(ASTNode node) {
        if (node == null) return null;

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("line", node.line());
        map.put("column", node.column());

        if (node instanceof NumberNode n) {
            map.put("type", "NumberNode");
            map.put("value", n.value());
            map.put("isInteger", n.isInteger());
        } else if (node instanceof BoolNode n) {
            map.put("type", "BoolNode");
            map.put("value", n.value());
        } else if (node instanceof StringNode n) {
            map.put("type", "StringNode");
            map.put("value", n.value());
        } else if (node instanceof VariableNode n) {
            map.put("type", "VariableNode");
            map.put("name", n.name());
        } else if (node instanceof BinOpNode n) {
            map.put("type", "BinOpNode");
            map.put("operator", n.operator().name());
            map.put("left", toMap(n.left()));
            map.put("right", toMap(n.right()));
        } else if (node instanceof UnaryOpNode n) {
            map.put("type", "UnaryOpNode");
            map.put("operator", n.operator().name());
            map.put("operand", toMap(n.operand()));
        } else if (node instanceof AssignNode n) {
            map.put("type", "AssignNode");
            map.put("name", n.name());
            map.put("value", toMap(n.value()));
        } else if (node instanceof FuncDefNode n) {
            map.put("type", "FuncDefNode");
            map.put("name", n.name());
            map.put("params", n.params());
            map.put("body", toMap(n.body()));
        } else if (node instanceof FuncCallNode n) {
            map.put("type", "FuncCallNode");
            map.put("name", n.name());
            map.put("arguments", n.arguments().stream().map(ASTNodeDTO::toMap).toList());
        } else if (node instanceof IfNode n) {
            map.put("type", "IfNode");
            map.put("condition", toMap(n.condition()));
            map.put("thenBranch", toMap(n.thenBranch()));
            map.put("elseBranch", toMap(n.elseBranch()));
        } else if (node instanceof WhileNode n) {
            map.put("type", "WhileNode");
            map.put("condition", toMap(n.condition()));
            map.put("body", toMap(n.body()));
        } else if (node instanceof PrintNode n) {
            map.put("type", "PrintNode");
            map.put("expression", toMap(n.expression()));
        } else if (node instanceof ReturnNode n) {
            map.put("type", "ReturnNode");
            map.put("value", toMap(n.value()));
        } else if (node instanceof BlockNode n) {
            map.put("type", "BlockNode");
            map.put("statements", n.statements().stream().map(ASTNodeDTO::toMap).toList());
        }
        return map;
    }
}
