package com.mathlite.interpreter;

import com.mathlite.ast.*;
import com.mathlite.lexer.TokenType;

import java.util.ArrayList;
import java.util.List;

/**
 * Intérprete que evalúa el AST nodo por nodo.
 * Implementa ASTVisitor<MathLiteValue> — NO usa eval().
 * Cada nodo se recorre y evalúa de forma explícita.
 */
public class Interpreter implements ASTVisitor<MathLiteValue> {

    private Environment environment = new Environment();
    private final List<String> output = new ArrayList<>();
    private final List<String> runtimeErrors = new ArrayList<>();

    public List<String> getOutput() { return output; }
    public List<String> getRuntimeErrors() { return runtimeErrors; }

    public void interpret(BlockNode program) {
        try {
            visitBlock(program);
        } catch (RuntimeError e) {
            runtimeErrors.add(e.toString());
        }
    }

    @Override
    public MathLiteValue visitNumber(NumberNode node) {
        if (node.isInteger()) return MathLiteValue.ofInt((int) node.value());
        return MathLiteValue.ofReal(node.value());
    }

    @Override
    public MathLiteValue visitBool(BoolNode node) {
        return MathLiteValue.ofBool(node.value());
    }

    @Override
    public MathLiteValue visitString(StringNode node) {
        return MathLiteValue.ofString(node.value());
    }

    @Override
    public MathLiteValue visitVariable(VariableNode node) {
        try {
            return environment.get(node.name());
        } catch (RuntimeError e) {
            throw new RuntimeError("Variable '" + node.name() + "' no definida", node.line(), node.column());
        }
    }

    @Override
    public MathLiteValue visitBinOp(BinOpNode node) {
        MathLiteValue left = node.left().accept(this);
        MathLiteValue right = node.right().accept(this);

        return switch (node.operator()) {
            case PLUS -> arithmeticOp(left, right, "+", node);
            case MINUS -> arithmeticOp(left, right, "-", node);
            case STAR -> arithmeticOp(left, right, "*", node);
            case SLASH -> {
                if (right.isNumeric() && right.toDouble() == 0) {
                    throw new RuntimeError("División por cero", node.line(), node.column());
                }
                yield arithmeticOp(left, right, "/", node);
            }
            case CARET -> arithmeticOp(left, right, "^", node);
            case PERCENT -> arithmeticOp(left, right, "%", node);
            case EQUAL_EQUAL -> MathLiteValue.ofBool(left.toString().equals(right.toString()));
            case BANG_EQUAL -> MathLiteValue.ofBool(!left.toString().equals(right.toString()));
            case LESS -> compareOp(left, right, "<", node);
            case GREATER -> compareOp(left, right, ">", node);
            case LESS_EQUAL -> compareOp(left, right, "<=", node);
            case GREATER_EQUAL -> compareOp(left, right, ">=", node);
            case AND -> MathLiteValue.ofBool(left.isTruthy() && right.isTruthy());
            case OR -> MathLiteValue.ofBool(left.isTruthy() || right.isTruthy());
            default -> throw new RuntimeError("Operador no soportado: " + node.operator(), node.line(), node.column());
        };
    }

    @Override
    public MathLiteValue visitUnaryOp(UnaryOpNode node) {
        MathLiteValue operand = node.operand().accept(this);
        return switch (node.operator()) {
            case MINUS -> {
                if (operand.getType() == MathLiteValue.Type.INT)
                    yield MathLiteValue.ofInt(-operand.asInt());
                yield MathLiteValue.ofReal(-operand.toDouble());
            }
            case NOT -> MathLiteValue.ofBool(!operand.isTruthy());
            default -> throw new RuntimeError("Operador unario no soportado", node.line(), node.column());
        };
    }

    @Override
    public MathLiteValue visitAssign(AssignNode node) {
        MathLiteValue value = node.value().accept(this);
        environment.assign(node.name(), value);
        return value;
    }

    @Override
    public MathLiteValue visitFuncDef(FuncDefNode node) {
        // Guardar la función como un valor closure que captura el entorno actual.
        MathLiteValue function = MathLiteValue.ofFunction(node, environment);
        environment.define(node.name(), function);
        return function;
    }

    @Override
    public MathLiteValue visitFuncCall(FuncCallNode node) {
        // Evaluar argumentos
        List<MathLiteValue> args = new ArrayList<>();
        for (ASTNode arg : node.arguments()) {
            args.add(arg.accept(this));
        }

        // Verificar si es una función integrada
        if (BuiltinFunctions.isBuiltin(node.name())) {
            return BuiltinFunctions.call(node.name(), args);
        }

        // Buscar la función definida por el usuario en el entorno
        MathLiteValue callee;
        try {
            callee = environment.get(node.name());
        } catch (RuntimeError e) {
            throw new RuntimeError("Funcion '" + node.name() + "' no se encontro en el entorno",
                node.line(), node.column());
        }

        if (!callee.isFunction()) {
            throw new RuntimeError("'" + node.name() + "' no es una función",
                node.line(), node.column());
        }

        FuncDefNode def = callee.asFunction();

        // Validar aridad
        if (def.params().size() != args.size()) {
            throw new RuntimeError("La función '" + node.name() + "' espera "
                + def.params().size() + " argumento(s), recibió " + args.size(),
                node.line(), node.column());
        }

        // Crear el scope de ejecución a partir del entorno de captura (closure)
        Environment funcEnv = new Environment(callee.getClosure());
        for (int i = 0; i < def.params().size(); i++) {
            funcEnv.define(def.params().get(i), args.get(i));
        }

        // Ejecutar el cuerpo con el nuevo entorno, capturando el return
        Environment prev = environment;
        environment = funcEnv;
        MathLiteValue result = MathLiteValue.ofNull();
        try {
            visitBlock(def.body());
        } catch (ReturnException re) {
            result = re.getValue();
        } finally {
            environment = prev;
        }
        return result;
    }

    @Override
    public MathLiteValue visitIf(IfNode node) {
        MathLiteValue condition = node.condition().accept(this);
        if (condition.isTruthy()) {
            Environment prev = environment;
            environment = new Environment(environment);
            visitBlock(node.thenBranch());
            environment = prev;
        } else if (node.elseBranch() != null) {
            Environment prev = environment;
            environment = new Environment(environment);
            visitBlock(node.elseBranch());
            environment = prev;
        }
        return MathLiteValue.ofNull();
    }

    @Override
    public MathLiteValue visitWhile(WhileNode node) {
        while (node.condition().accept(this).isTruthy()) {
            Environment prev = environment;
            environment = new Environment(environment);
            visitBlock(node.body());
            environment = prev;
        }
        return MathLiteValue.ofNull();
    }

    @Override
    public MathLiteValue visitPrint(PrintNode node) {
        MathLiteValue value = node.expression().accept(this);
        output.add(value.toString());
        return MathLiteValue.ofNull();
    }

    @Override
    public MathLiteValue visitReturn(ReturnNode node) {
        MathLiteValue value = node.value() != null ? node.value().accept(this) : MathLiteValue.ofNull();
        throw new ReturnException(value);
    }

    @Override
    public MathLiteValue visitBlock(BlockNode node) {
        MathLiteValue result = MathLiteValue.ofNull();
        for (ASTNode stmt : node.statements()) {
            result = stmt.accept(this);
        }
        return result;
    }

    // --- Helpers ---
    private MathLiteValue arithmeticOp(MathLiteValue l, MathLiteValue r, String op, BinOpNode node) {
        if (!l.isNumeric() || !r.isNumeric()) {
            if (op.equals("+") && (l.getType() == MathLiteValue.Type.STRING || r.getType() == MathLiteValue.Type.STRING)) {
                return MathLiteValue.ofString(l.toString() + r.toString());
            }
            throw new RuntimeError("Operación '" + op + "' requiere operandos numéricos", node.line(), node.column());
        }
        double a = l.toDouble(), b = r.toDouble();
        boolean isInt = l.getType() == MathLiteValue.Type.INT && r.getType() == MathLiteValue.Type.INT;
        double result = switch (op) {
            case "+" -> a + b; case "-" -> a - b; case "*" -> a * b;
            case "/" -> a / b; case "^" -> Math.pow(a, b); case "%" -> a % b;
            default -> throw new RuntimeError("Operador desconocido");
        };
        return isInt && !op.equals("/") ? MathLiteValue.ofInt((int) result) : MathLiteValue.ofReal(result);
    }

    private MathLiteValue compareOp(MathLiteValue l, MathLiteValue r, String op, BinOpNode node) {
        if (!l.isNumeric() || !r.isNumeric()) {
            throw new RuntimeError("Comparación '" + op + "' requiere operandos numéricos", node.line(), node.column());
        }
        double a = l.toDouble(), b = r.toDouble();
        boolean result = switch (op) {
            case "<" -> a < b; case ">" -> a > b;
            case "<=" -> a <= b; case ">=" -> a >= b;
            default -> false;
        };
        return MathLiteValue.ofBool(result);
    }
}
