import { useState } from "react";

interface ASTViewerProps {
  ast: Record<string, unknown> | null;
}

function ASTNodeDisplay({
  node,
  depth = 0,
}: {
  node: unknown;
  depth: number;
}) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  if (node === null || node === undefined) return null;

  if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "boolean"
  ) {
    return <span className="text-gold-light">{String(node)}</span>;
  }

  if (Array.isArray(node)) {
    return (
      <div className="ml-4 border-l border-border/50 pl-3">
        <span className="text-text-muted text-[10px] font-mono">
          Array[{node.length}]
        </span>
        {node.map((item, i) => (
          <div key={i} className="mt-0.5">
            <span className="text-text-muted/50 text-[10px] font-mono">
              [{i}]
            </span>{" "}
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
      <div>
        <div
          className={`flex items-center gap-1.5 py-0.5 ${
            hasChildren ? "cursor-pointer hover:text-text" : ""
          } transition-colors`}
          onClick={() => hasChildren && setCollapsed(!collapsed)}
        >
          {hasChildren && (
            <span className="text-text-muted/50 text-[10px] font-mono w-3 text-center shrink-0">
              {collapsed ? "+" : "−"}
            </span>
          )}
          <span className="text-gold font-medium text-xs">{typeName}</span>
          {collapsed && hasChildren && (
            <span className="text-text-muted/50 text-[10px] font-mono">
              ({Object.keys(obj).length - 1} campos)
            </span>
          )}
        </div>
        {!collapsed && hasChildren && (
          <div className="ml-4 border-l border-border/50 pl-3 space-y-0.5 mt-0.5">
            {Object.entries(obj).map(([key, val]) => {
              if (key === "type") return null;
              return (
                <div key={key} className="flex items-start gap-2">
                  <span className="text-text-muted text-[10px] font-mono shrink-0 mt-0.5">
                    {key}:
                  </span>
                  <ASTNodeDisplay node={val} depth={depth + 1} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return <span className="text-text-muted">{String(node)}</span>;
}

export default function ASTViewer({ ast }: ASTViewerProps) {
  const [expanded, setExpanded] = useState(false);

  if (!ast || Object.keys(ast).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        Sin AST
      </div>
    );
  }

  return (
    <>
      <div className="relative h-full group">
        <button
          onClick={() => setExpanded(true)}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-md
                     opacity-0 group-hover:opacity-100 transition-all duration-200
                     text-text-muted hover:text-gold-light hover:bg-surface-hover"
          title="Ver AST en pantalla completa"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </button>

        <div className="absolute inset-0 p-4 font-mono text-xs leading-relaxed overflow-y-auto bg-bg/20 animate-fade-in
                        [&::-webkit-scrollbar]:w-[6px]
                        [&::-webkit-scrollbar-thumb]:bg-border-light
                        [&::-webkit-scrollbar-thumb]:rounded
                        [&::-webkit-scrollbar-thumb]:hover:bg-text-muted
                        [&::-webkit-scrollbar-track]:bg-transparent">
          <ASTNodeDisplay node={ast} depth={0} />
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setExpanded(false)}
        >
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-[90vw] h-[85vh] flex flex-col
                       bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/60">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16m-7 5h7m-7 0l-4-4m4 4l-4 4" />
                </svg>
                <span className="text-sm font-display font-semibold text-text">
                  Árbol de Sintaxis Abstracta
                </span>
                <span className="text-[10px] text-text-muted font-mono bg-bg/40 px-2 py-0.5 rounded">
                  expandido
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-text-muted mr-2 hidden sm:inline">
                  Click en nodos para colapsar/expandir
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-all"
                  title="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto bg-bg/20
                            [&::-webkit-scrollbar]:w-[7px]
                            [&::-webkit-scrollbar-thumb]:bg-border-light
                            [&::-webkit-scrollbar-thumb]:rounded
                            [&::-webkit-scrollbar-thumb]:hover:bg-text-muted
                            [&::-webkit-scrollbar-track]:bg-transparent">
              <ASTNodeDisplay node={ast} depth={0} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
