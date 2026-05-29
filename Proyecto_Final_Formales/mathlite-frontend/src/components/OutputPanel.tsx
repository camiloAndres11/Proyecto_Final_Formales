interface OutputPanelProps {
  output: string[];
  executionTimeMs: number;
  success: boolean;
}

export default function OutputPanel({ output, executionTimeMs, success }: OutputPanelProps) {
  if (output.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Ejecuta un programa para ver la salida</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${success ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <span className="text-xs text-zinc-500">
            {success ? "Completado" : "Errores"} — {executionTimeMs}ms
          </span>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-sm leading-relaxed overflow-auto bg-zinc-950/50">
        {output.map((line, i) => (
          <div key={i} className="text-zinc-200 whitespace-pre-wrap break-words">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
