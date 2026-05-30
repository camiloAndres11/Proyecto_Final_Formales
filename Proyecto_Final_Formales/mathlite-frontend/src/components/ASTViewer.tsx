import { useState, useRef, useEffect } from "react";
import { useThemeStore, type Theme } from "../store/themeStore";
import { astToMermaid, getMermaidThemeConfig } from "../utils/astToMermaid";

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

function MermaidDiagram({ definition, theme }: { definition: string; theme: Theme }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const id = useRef(`ast-graph-${Math.random().toString(36).slice(2, 8)}`);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setScale(1);
    setPanX(0);
    setPanY(0);
  }, [definition]);

  useEffect(() => {
    let cancelled = false;
    setSvg(null);
    setError(false);

    import("mermaid").then(({ default: mermaid }) => {
      if (cancelled) return;
      try {
        mermaid.initialize({
          startOnLoad: false,
          ...getMermaidThemeConfig(theme),
        });
        mermaid
          .render(id.current, definition)
          .then(({ svg: result }) => {
            if (!cancelled) setSvg(result);
          })
          .catch((err: unknown) => {
            if (!cancelled) {
              console.error("mermaid render failed:", err);
              setError(true);
            }
          });
      } catch (initErr) {
        if (!cancelled) {
          console.error("mermaid init failed:", initErr);
          setError(true);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [definition, theme]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.max(0.3, Math.min(3, s + (e.deltaY > 0 ? -0.1 : 0.1))));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPanX((px) => px + dx);
    setPanY((py) => py + dy);
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const handleMouseLeave = () => {
    isPanning.current = false;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted gap-2">
        <svg className="w-8 h-8 text-error/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p className="text-xs">Error al renderizar el grafo</p>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="min-h-full cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <div
          className="flex justify-center items-start p-4 [&_svg]:max-w-none"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-0.5 bg-bg/70 backdrop-blur-sm rounded-lg p-1 border border-border/50">
        <button
          onClick={() => setScale((s) => Math.min(3, s + 0.2))}
          className="p-1 rounded text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          title="Acercar"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <span className="text-[10px] text-text-muted w-8 text-center font-mono">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.max(0.3, s - 0.2))}
          className="p-1 rounded text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          title="Alejar"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <div className="w-px h-4 bg-border/50 mx-0.5" />
        <button
          onClick={() => {
            setScale(1);
            setPanX(0);
            setPanY(0);
          }}
          className="p-1 rounded text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          title="Restablecer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ASTViewer({ ast }: ASTViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [modalTab, setModalTab] = useState<"text" | "graph">("text");
  const [inlineTab, setInlineTab] = useState<"text" | "graph">("text");
  const theme = useThemeStore((s) => s.theme);

  if (!ast || Object.keys(ast).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        Sin AST
      </div>
    );
  }

  const mermaidDefinition = astToMermaid(ast);

  return (
    <>
      <div className="relative h-full group flex flex-col">
        <div className="flex items-center shrink-0 px-3 border-b border-border/30 bg-surface/20">
          <button
            onClick={() => setInlineTab("text")}
            className={`px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
              inlineTab === "text"
                ? "text-gold-light shadow-[var(--shadow-tab-active)]"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Texto
          </button>
          <button
            onClick={() => setInlineTab("graph")}
            className={`px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
              inlineTab === "graph"
                ? "text-gold-light shadow-[var(--shadow-tab-active)]"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Gráfico
          </button>
          <div className="ml-auto">
            <button
              onClick={() => setExpanded(true)}
              className="p-1.5 rounded-md text-text-muted hover:text-gold-light hover:bg-surface-hover transition-all duration-200"
              title="Ver AST en pantalla completa"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {inlineTab === "text" ? (
            <div className="absolute inset-0 p-4 font-mono text-xs leading-relaxed overflow-y-auto bg-bg/20 animate-fade-in
                            [&::-webkit-scrollbar]:w-[6px]
                            [&::-webkit-scrollbar-thumb]:bg-border-light
                            [&::-webkit-scrollbar-thumb]:rounded
                            [&::-webkit-scrollbar-thumb]:hover:bg-text-muted
                            [&::-webkit-scrollbar-track]:bg-transparent">
              <ASTNodeDisplay node={ast} depth={0} />
            </div>
          ) : (
            <div className="absolute inset-0 animate-fade-in">
              <MermaidDiagram definition={mermaidDefinition} theme={theme} />
            </div>
          )}
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

            <div className="flex border-b border-border bg-surface/30">
              <button
                onClick={() => setModalTab("text")}
                className={`px-4 py-2 text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                  modalTab === "text"
                    ? "text-gold-light bg-gold/[0.04] shadow-[var(--shadow-tab-active)]"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Texto
              </button>
              <button
                onClick={() => setModalTab("graph")}
                className={`px-4 py-2 text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                  modalTab === "graph"
                    ? "text-gold-light bg-gold/[0.04] shadow-[var(--shadow-tab-active)]"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Gráfico
              </button>
            </div>

            {modalTab === "text" ? (
              <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto bg-bg/20
                              [&::-webkit-scrollbar]:w-[7px]
                              [&::-webkit-scrollbar-thumb]:bg-border-light
                              [&::-webkit-scrollbar-thumb]:rounded
                              [&::-webkit-scrollbar-thumb]:hover:bg-text-muted
                              [&::-webkit-scrollbar-track]:bg-transparent">
                <ASTNodeDisplay node={ast} depth={0} />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden bg-bg/20">
                <MermaidDiagram definition={mermaidDefinition} theme={theme} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
