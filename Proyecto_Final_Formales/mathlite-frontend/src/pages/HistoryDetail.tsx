import { useParams, useNavigate } from "react-router-dom";
import { useHistoryDetail } from "../hooks/useHistory";
import OutputPanel from "../components/OutputPanel";
import DiagnosticsPanel from "../components/DiagnosticsPanel";
import ASTViewer from "../components/ASTViewer";
import { useState } from "react";

type Tab = "output" | "ast" | "diagnostics";

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading, error } = useHistoryDetail(id || "");
  const [activeTab, setActiveTab] = useState<Tab>("output");

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">Ejecución no encontrada</p>
        <button
          onClick={() => navigate("/history")}
          className="text-xs text-zinc-400 hover:text-zinc-200 underline"
        >
          Volver al historial
        </button>
      </div>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "output", label: "Salida" },
    { id: "ast", label: "AST" },
    { id: "diagnostics", label: "Diagnósticos" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/history")}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-semibold text-white">Detalle de Ejecución</h2>
            <p className="text-xs text-zinc-500 font-mono">{record.id}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            record.success
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${record.success ? "bg-emerald-500" : "bg-red-500"}`} />
          {record.success ? "Éxito" : "Error"} — {record.executionTimeMs}ms
        </span>
      </div>

      <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/30">
        <p className="text-xs text-zinc-500 mb-1">Código fuente:</p>
        <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap bg-zinc-950 rounded-lg p-3 border border-zinc-800">
          {record.code}
        </pre>
        <p className="text-xs text-zinc-600 mt-2">
          {new Date(record.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="flex border-b border-zinc-800 bg-zinc-900/50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "text-zinc-200 bg-zinc-800/50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "output" && (
          <OutputPanel
            output={record.output}
            executionTimeMs={record.executionTimeMs}
            success={record.success}
          />
        )}
        {activeTab === "ast" && <ASTViewer ast={record.astJson} />}
        {activeTab === "diagnostics" && <DiagnosticsPanel errors={record.errors} />}
      </div>
    </div>
  );
}
