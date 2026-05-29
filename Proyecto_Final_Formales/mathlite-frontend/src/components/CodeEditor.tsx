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
    /("(?:[^"\\]|\\.)*")|(\b(?:let|def|if|else|while|return|print|and|or|not|true|false|sin|cos|tan|sqrt|log|abs|floor|ceil)\b)|(\b\d+(?:\.\d+)?\b)|(--[^\n]*)/g,
    (match, str, kw, num, comment) => {
      if (comment)
        return `<span style="color:#5c5770;font-style:italic">${comment}</span>`;
      if (str)
        return `<span style="color:#5cb8c8">${str}</span>`;
      if (kw)
        return `<span style="color:#c9a84c">${kw}</span>`;
      if (num)
        return `<span style="color:#e8cd72">${num}</span>`;
      return match;
    }
  );
}

export default function CodeEditor({
  value,
  onChange,
  onExecute,
  isExecuting,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  });

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-surface/50">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gold-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          <span className="text-xs text-text-muted font-mono tracking-wide">
            main.ml
          </span>
        </div>
        <button
          onClick={onExecute}
          disabled={isExecuting || !value.trim()}
          className="group relative flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg
                     bg-gold/15 text-gold-light border border-gold/20
                     hover:bg-gold/25 hover:border-gold/40
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gold/15 disabled:hover:border-gold/20
                     transition-all duration-200"
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {isExecuting ? (
            <>
              <span className="relative w-3 h-3 border-2 border-gold-light/30 border-t-gold-light rounded-full animate-spin" />
              <span className="relative">Ejecutando</span>
            </>
          ) : (
            <>
              <svg className="relative w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 3l7 5-7 5V3z" />
              </svg>
              <span className="relative">Ejecutar</span>
              <span className="relative text-[9px] text-gold-dim hidden sm:inline">
                ⌘⏎
              </span>
            </>
          )}
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden bg-bg">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-5 font-mono text-sm leading-relaxed pointer-events-none whitespace-pre-wrap break-words overflow-auto"
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
          className="absolute inset-0 w-full h-full p-5 font-mono text-sm leading-relaxed
                     bg-transparent text-text resize-none outline-none border-none
                     selection:bg-gold/20"
          placeholder="-- Escribe tu codigo MathLite aqui...
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
