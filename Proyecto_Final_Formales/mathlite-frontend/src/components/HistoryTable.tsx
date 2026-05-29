import type { ExecutionRecord } from "../types";

interface HistoryTableProps {
  records: ExecutionRecord[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryTable({ records, onSelect, onDelete }: HistoryTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No hay ejecuciones registradas</p>
        <p className="text-xs mt-1">Ejecuta código en el Playground para verlo aquí</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
              Estado
            </th>
            <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
              Código
            </th>
            <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
              Output
            </th>
            <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
              Tiempo
            </th>
            <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
              Fecha
            </th>
            <th className="text-right px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {records.map((record) => (
            <tr
              key={record.id}
              className="hover:bg-zinc-900/30 cursor-pointer transition-colors"
              onClick={() => onSelect(record.id)}
            >
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    record.success
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      record.success ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {record.success ? "Éxito" : "Error"}
                </span>
              </td>
              <td className="px-4 py-3 max-w-[300px]">
                <code className="text-xs text-zinc-300 font-mono truncate block">
                  {record.code.split("\n")[0]}
                  {record.code.includes("\n") ? " ..." : ""}
                </code>
              </td>
              <td className="px-4 py-3 text-zinc-400 text-xs max-w-[200px] truncate">
                {record.output.join(", ") || "—"}
              </td>
              <td className="px-4 py-3 text-zinc-500 text-xs font-mono">
                {record.executionTimeMs}ms
              </td>
              <td className="px-4 py-3 text-zinc-500 text-xs">
                {new Date(record.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(record.id);
                  }}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                  title="Eliminar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
