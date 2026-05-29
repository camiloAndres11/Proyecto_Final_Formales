import type { ExecutionErrors } from "../types";

interface DiagnosticsPanelProps {
  errors: ExecutionErrors;
}

type Phase = "lexical" | "syntactic" | "semantic" | "runtime";
const PHASE_LABELS: Record<Phase, string> = {
  lexical: "Léxico",
  syntactic: "Sintáctico",
  semantic: "Semántico",
  runtime: "Runtime",
};
const PHASE_COLORS: Record<Phase, string> = {
  lexical: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  syntactic: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  semantic: "text-red-400 border-red-500/30 bg-red-500/10",
  runtime: "text-rose-400 border-rose-500/30 bg-rose-500/10",
};

export default function DiagnosticsPanel({ errors }: DiagnosticsPanelProps) {
  const phases = Object.keys(errors) as Phase[];
  const hasErrors = phases.some((p) => errors[p].length > 0);

  if (!hasErrors) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
        Sin errores
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full p-3 space-y-2">
      {phases.map((phase) => {
        const phaseErrors = errors[phase];
        if (phaseErrors.length === 0) return null;

        return (
          <div
            key={phase}
            className={`rounded-lg border text-xs font-mono ${PHASE_COLORS[phase]}`}
          >
            <div className="px-3 py-1.5 font-semibold border-b border-inherit/20">
              {PHASE_LABELS[phase]} ({phaseErrors.length})
            </div>
            <div className="divide-y divide-inherit/10">
              {phaseErrors.map((err, i) => (
                <div key={i} className="px-3 py-1.5 text-xs">
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
