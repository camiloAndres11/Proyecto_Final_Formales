import { useState } from "react";
import { useInterpret } from "../hooks/useInterpret";
import { useEditorStore } from "../store/editorStore";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import TokenTable from "../components/TokenTable";
import ASTViewer from "../components/ASTViewer";
import DiagnosticsPanel from "../components/DiagnosticsPanel";

type Tab = "output" | "tokens" | "ast" | "diagnostics";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "output", label: "Salida", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" },
  { id: "tokens", label: "Tokens", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "ast", label: "AST", icon: "M4 7h16M4 12h16m-7 5h7m-7 0l-4-4m4 4l-4 4" },
  { id: "diagnostics", label: "Diagnosticos", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" },
];

export default function Playground() {
  const { code, setCode, results, isExecuting } = useEditorStore();
  const interpret = useInterpret();
  const [activeTab, setActiveTab] = useState<Tab>("output");

  const handleExecute = () => {
    if (code.trim()) interpret.mutate(code);
  };

  const hasErrorResults =
    results &&
    !results.success &&
    (Object.values(results.errors) as string[][]).some((e) => e.length > 0);

  return (
    <div className="flex-1 flex animate-fade-in">
      <div className="flex-1 flex flex-col border-r border-border min-w-0">
        <CodeEditor
          value={code}
          onChange={setCode}
          onExecute={handleExecute}
          isExecuting={isExecuting}
        />
      </div>

      <div className="w-[45%] min-w-[420px] flex flex-col border-l border-border/50">
        <div className="flex border-b border-border bg-surface/30">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isErrorTab = tab.id === "diagnostics" && hasErrorResults;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "text-gold-light bg-gold/[0.04] shadow-[inset_0_1px_0_rgba(201,168,76,0.3)]"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={tab.icon}
                  />
                </svg>
                {tab.label}
                {isErrorTab && (
                  <span className="w-1.5 h-1.5 rounded-full bg-error shadow-[0_0_4px_rgba(200,90,90,0.5)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-hidden">
          {!results ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center animate-fade-in">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <svg
                    className="w-16 h-16 text-gold/10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <div className="absolute inset-0 animate-glow-pulse rounded-full opacity-30" />
                </div>
                <p className="text-sm text-text-muted mb-1">
                  Esperando codigo...
                </p>
                <p className="text-xs text-text-muted/50">
                  Escribe y ejecuta un programa para ver los resultados
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "output" && (
                <OutputPanel
                  output={results.output}
                  executionTimeMs={results.executionTimeMs}
                  success={results.success}
                />
              )}
              {activeTab === "tokens" && (
                <TokenTable tokens={results.tokens} />
              )}
              {activeTab === "ast" && <ASTViewer ast={results.ast} />}
              {activeTab === "diagnostics" && (
                <DiagnosticsPanel errors={results.errors} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
