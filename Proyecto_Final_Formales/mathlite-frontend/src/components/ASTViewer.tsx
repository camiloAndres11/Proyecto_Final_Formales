import { useState } from "react";

interface ASTViewerProps {
  ast: Record<string, unknown> | null;
}

function ASTNodeDisplay({ node, depth = 0 }: { node: unknown; depth: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  if (node === null || node === undefined) return null;

  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    return (
      <span className="text-amber-400">{String(node)}</span>
    );
  }

  if (Array.isArray(node)) {
    return (
      <div className="ml-4 border-l border-zinc-700/50 pl-3">
        <span className="text-zinc-500 text-xs">Array[{node.length}]</span>
        {node.map((item, i) => (
          <div key={i}>
            <span className="text-zinc-600 text-xs">[{i}] </span>
            <ASTNodeDisplay node={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const typeName = (obj.type as string) || "Object";
    const hasChildren = Object.keys(obj).length > 1;

    return (
      <div className="ml-0">
        <div
          className={`flex items-center gap-1 py-0.5 ${hasChildren ? "cursor-pointer hover:text-zinc-200" : ""}`}
          onClick={() => hasChildren && setCollapsed(!collapsed)}
        >
          {hasChildren && (
            <span className="text-zinc-600 text-xs w-3">
              {collapsed ? "+" : "-"}
            </span>
          )}
          <span className="text-fuchsia-400 font-medium">{typeName}</span>
          {collapsed && hasChildren && (
            <span className="text-zinc-600 text-xs">({Object.keys(obj).length - 1} campos)</span>
          )}
        </div>
        {!collapsed && hasChildren && (
          <div className="ml-3 border-l border-zinc-700/50 pl-3 space-y-0.5">
            {Object.entries(obj).map(([key, val]) => {
              if (key === "type") return null;
              return (
                <div key={key} className="text-sm">
                  <span className="text-zinc-500 text-xs">{key}: </span>
                  <ASTNodeDisplay node={val} depth={depth + 1} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return <span className="text-zinc-500">{String(node)}</span>;
}

export default function ASTViewer({ ast }: ASTViewerProps) {
  if (!ast || Object.keys(ast).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
        Sin AST
      </div>
    );
  }

  return (
    <div className="p-3 font-mono text-xs leading-relaxed overflow-auto h-full bg-zinc-950/30">
      <ASTNodeDisplay node={ast} depth={0} />
    </div>
  );
}
