import { useParams, useNavigate } from "react-router-dom";
import { useHistoryDetail } from "../hooks/useHistory";
import OutputPanel from "../components/OutputPanel";
import DiagnosticsPanel from "../components/DiagnosticsPanel";
import ASTViewer from "../components/ASTViewer";
import { useState } from "react";
import { useEditorStore } from "../store/editorStore";

type Tab = "output" | "ast" | "diagnostics";

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setCode = useEditorStore((s) => s.setCode);
  const { data: record, isLoading, error } = useHistoryDetail(id || "");
  const [activeTab, setActiveTab] = useState<Tab>("output");

  const handleOpenInPlayground = () => {
    if (!record) return;
    setCode(record.code);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <span className="text-sm text-text-muted">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-fade-in">
        <svg
          className="w-12 h-12 text-text-muted/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-text-muted">Ejecucion no encontrada</p>
        <button
          onClick={() => navigate("/history")}
          className="text-xs text-gold-dim hover:text-gold-light transition-colors underline underline-offset-4 decoration-gold-dim/30"
        >
          Volver al historial
        </button>
      </div>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "output", label: "Salida" },
    { id: "ast", label: "AST" },
    { id: "diagnostics", label: "Diagnosticos" },
  ];

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/history")}
            className="text-text-muted hover:text-gold-light transition-colors p-1 -ml-1 rounded-md hover:bg-gold/10"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-display font-semibold text-text">
              Detalle de Ejecucion
            </h2>
            <p className="text-[11px] text-text-muted font-mono">
              {record.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenInPlayground}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       bg-gold/15 text-gold-light border border-gold/20
                       hover:bg-gold/25 hover:border-gold/40
                       transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            Abrir en Playground
          </button>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              record.success
                ? "bg-gold/10 text-gold-light"
                : "bg-error/10 text-error"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                record.success
                  ? "bg-gold shadow-[0_0_4px_rgba(201,168,76,0.4)]"
                  : "bg-error shadow-[0_0_4px_rgba(200,90,90,0.4)]"
              }`}
            />
            {record.success ? "Exito" : "Error"} — {record.executionTimeMs}ms
          </span>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-border bg-surface/15">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            <p className="text-xs text-text-muted">Codigo fuente</p>
          </div>
          <button
            onClick={handleOpenInPlayground}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
                       text-gold-dim hover:text-gold-light hover:bg-gold/10
                       transition-all duration-200"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            Abrir en Playground
          </button>
        </div>
        <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap bg-bg/50 rounded-lg p-4 border border-border leading-relaxed">
          {record.code}
        </pre>
        <p className="text-xs text-text-muted/60 mt-2 font-mono">
          {new Date(record.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="flex border-b border-border bg-surface/20">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "text-gold-light bg-gold/[0.04] shadow-[inset_0_1px_0_rgba(201,168,76,0.3)]"
                : "text-text-muted hover:text-text-secondary"
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
        {activeTab === "diagnostics" && (
          <DiagnosticsPanel errors={record.errors} />
        )}
      </div>
    </div>
  );
}
