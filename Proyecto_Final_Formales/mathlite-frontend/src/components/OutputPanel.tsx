interface OutputPanelProps {
  output: string[];
  executionTimeMs: number;
  success: boolean;
}

export default function OutputPanel({
  output,
  executionTimeMs,
  success,
}: OutputPanelProps) {
  if (output.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-text-muted">
            Ejecuta un programa para ver la salida
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/40">
        <div className="flex items-center gap-2.5">
          <span
            className={`relative w-2 h-2 rounded-full ${
              success
                ? "bg-gold shadow-[0_0_6px_rgba(201,168,76,0.5)]"
                : "bg-error shadow-[0_0_6px_rgba(200,90,90,0.5)]"
            }`}
          />
          <span className="text-xs text-text-secondary font-mono">
            {success ? "Completado" : "Errores"}
          </span>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-text-muted font-mono">
            {executionTimeMs}ms
          </span>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-sm leading-relaxed overflow-auto bg-bg/30">
        {output.map((line, i) => (
          <div
            key={i}
            className="text-text/90 whitespace-pre-wrap break-words hover:text-text transition-colors"
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
