import type { ExecutionErrors } from "../types";

interface DiagnosticsPanelProps {
  errors: ExecutionErrors;
}

type Phase = "lexical" | "syntactic" | "semantic" | "runtime";

const PHASE_CONFIG: Record<
  Phase,
  { label: string; border: string; bg: string; dot: string; text: string }
> = {
  lexical: {
    label: "Léxico",
    border: "border-gold-dim/30",
    bg: "bg-gold-dim/8",
    dot: "bg-gold-dim",
    text: "text-gold-dim",
  },
  syntactic: {
    label: "Sintáctico",
    border: "border-teal/30",
    bg: "bg-teal/8",
    dot: "bg-teal",
    text: "text-teal",
  },
  semantic: {
    label: "Semántico",
    border: "border-error/30",
    bg: "bg-error/8",
    dot: "bg-error",
    text: "text-error",
  },
  runtime: {
    label: "Runtime",
    border: "border-error/40",
    bg: "bg-error/10",
    dot: "bg-error",
    text: "text-error",
  },
};

export default function DiagnosticsPanel({ errors }: DiagnosticsPanelProps) {
  const phases = Object.keys(errors) as Phase[];
  const hasErrors = phases.some((p) => errors[p].length > 0);

  if (!hasErrors) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        <div className="text-center animate-fade-in">
          <svg
            className="w-10 h-10 mx-auto mb-3 text-text-muted/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">Sin errores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full p-3 space-y-2 animate-fade-in">
      {phases.map((phase) => {
        const phaseErrors = errors[phase];
        if (phaseErrors.length === 0) return null;

        const config = PHASE_CONFIG[phase];

        return (
          <div
            key={phase}
            className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden`}
          >
            <div className={`flex items-center gap-2 px-3 py-2 ${config.border} border-b`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              <span className={`text-xs font-medium ${config.text}`}>
                {config.label}
              </span>
              <span
                className={`text-[10px] font-mono ${config.text} opacity-60`}
              >
                {phaseErrors.length}
              </span>
            </div>
            <div className="divide-y divide-border/20">
              {phaseErrors.map((err, i) => (
                <div
                  key={i}
                  className="px-3 py-2 text-xs text-text-secondary font-mono"
                >
                  {err}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
