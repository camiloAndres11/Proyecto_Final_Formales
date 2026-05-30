import type { Token } from "../types";

interface TokenTableProps {
  tokens: Token[];
}

export default function TokenTable({ tokens }: TokenTableProps) {
  if (tokens.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        Sin tokens
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full animate-fade-in">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-border bg-surface/40">
            <th className="text-left px-4 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              #
            </th>
            <th className="text-left px-4 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Tipo
            </th>
            <th className="text-left px-4 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Lexema
            </th>
            <th className="text-left px-4 py-2.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              L:C
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr
              key={i}
              className="border-b border-border/40 hover:bg-gold/[0.02] transition-colors"
            >
              <td className="px-4 py-2 text-text-muted/60">{i}</td>
              <td className="px-4 py-2">
                <span className="text-gold">{t.type}</span>
              </td>
              <td className="px-4 py-2 text-text/80">{t.lexeme}</td>
              <td className="px-4 py-2 text-text-muted">
                {t.line}:{t.column}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
