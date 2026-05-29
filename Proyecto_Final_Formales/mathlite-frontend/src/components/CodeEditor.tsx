import { useRef, useEffect } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

function highlightSyntax(code: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(?:[^"\\]|\\.)*")|(\b(?:let|def|if|else|while|return|print|and|or|not|true|false|sin|cos|tan|sqrt|log|abs|floor|ceil)\b)|(\b\d+(?:\.\d+)?\b)|(--[^\n]*)|(\/\/[^\n]*)/g,
    (match, str, kw, num, comment) => {
      if (comment) return `<span class="text-zinc-600 italic">${comment}</span>`;
      if (str) return `<span class="text-emerald-400">${str}</span>`;
      if (kw) return `<span class="text-sky-400">${kw}</span>`;
      if (num) return `<span class="text-amber-400">${num}</span>`;
      return match;
    }
  );
}

export default function CodeEditor({ value, onChange, onExecute, isExecuting }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [value]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <span className="text-xs text-zinc-500 font-mono">main.ml</span>
        <button
          onClick={onExecute}
          disabled={isExecuting || !value.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white transition-colors"
        >
          {isExecuting ? (
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 3l7 5-7 5V3z" />
            </svg>
          )}
          {isExecuting ? "Ejecutando..." : "Ejecutar"}
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden bg-zinc-950">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none whitespace-pre-wrap break-words overflow-auto"
          dangerouslySetInnerHTML={{
            __html: highlightSyntax(value) || "\u00A0",
          }}
          style={{ color: "transparent" }}
          aria-hidden="true"
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onExecute();
            }
          }}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-relaxed bg-transparent text-white caret-white resize-none outline-none border-none"
          placeholder="-- Escribe tu código MathLite aquí...
let x = 42
print(x)

Ctrl+Enter para ejecutar"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}
