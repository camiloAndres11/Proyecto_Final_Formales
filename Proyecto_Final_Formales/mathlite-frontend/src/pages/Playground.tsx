import { useState } from "react";
import { useInterpret } from "../hooks/useInterpret";
import { useEditorStore } from "../store/editorStore";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import TokenTable from "../components/TokenTable";
import ASTViewer from "../components/ASTViewer";
import DiagnosticsPanel from "../components/DiagnosticsPanel";

type Tab = "output" | "tokens" | "ast" | "diagnostics";

const TABS: { id: Tab; label: string }[] = [
  { id: "output", label: "Salida" },
  { id: "tokens", label: "Tokens" },
  { id: "ast", label: "AST" },
  { id: "diagnostics", label: "Diagnósticos" },
];

export default function Playground() {
  const { code, setCode, results, isExecuting } = useEditorStore();
  const interpret = useInterpret();
  const [activeTab, setActiveTab] = useState<Tab>("output");

  const handleExecute = () => {
    if (code.trim()) interpret.mutate(code);
  };

  const hasErrorResults =
    results && !results.success && (Object.values(results.errors) as string[][]).some((e) => e.length > 0);

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col border-r border-zinc-800">
        <CodeEditor
          value={code}
          onChange={setCode}
          onExecute={handleExecute}
          isExecuting={isExecuting}
        />
      </div>

      <div className="w-[45%] min-w-[400px] flex flex-col">
        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isErrorTab = tab.id === "diagnostics" && hasErrorResults;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-medium transition-colors relative ${
                  isActive
                    ? "text-zinc-200 bg-zinc-800/50"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {isErrorTab && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-hidden">
          {!results ? (
            <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <p className="text-xs">Ejecuta código para ver resultados</p>
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
              {activeTab === "tokens" && <TokenTable tokens={results.tokens} />}
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
