import type { Token } from "../types";

interface TokenTableProps {
  tokens: Token[];
}

export default function TokenTable({ tokens }: TokenTableProps) {
  if (tokens.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
        Sin tokens
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            <th className="text-left px-3 py-2 text-zinc-500 font-medium">#</th>
            <th className="text-left px-3 py-2 text-zinc-500 font-medium">Tipo</th>
            <th className="text-left px-3 py-2 text-zinc-500 font-medium">Lexema</th>
            <th className="text-left px-3 py-2 text-zinc-500 font-medium">L:C</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
              <td className="px-3 py-1.5 text-zinc-600">{i}</td>
              <td className="px-3 py-1.5">
                <span className="text-sky-400">{t.type}</span>
              </td>
              <td className="px-3 py-1.5 text-zinc-300">{t.lexeme}</td>
              <td className="px-3 py-1.5 text-zinc-500">
                {t.line}:{t.column}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
