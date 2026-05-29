import type { ExecutionRecord } from "../types";

interface HistoryTableProps {
  records: ExecutionRecord[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadCode: (code: string) => void;
}

export default function HistoryTable({
  records,
  onSelect,
  onDelete,
  onLoadCode,
}: HistoryTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <svg
          className="w-14 h-14 mb-4 text-text-muted/20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-text-muted">
          No hay ejecuciones registradas
        </p>
        <p className="text-xs text-text-muted/60 mt-1.5">
          Ejecuta codigo en el Playground para verlo aqui
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto animate-fade-in">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Estado
            </th>
            <th className="text-left px-5 py-3.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Código
            </th>
            <th className="text-left px-5 py-3.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Output
            </th>
            <th className="text-left px-5 py-3.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Tiempo
            </th>
            <th className="text-left px-5 py-3.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Fecha
            </th>
            <th className="text-right px-5 py-3.5 text-text-muted font-medium text-[10px] uppercase tracking-widest">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {records.map((record, i) => (
            <tr
              key={record.id}
              className="hover:bg-gold/[0.015] cursor-pointer transition-colors group"
              onClick={() => onSelect(record.id)}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
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
                  {record.success ? "Éxito" : "Error"}
                </span>
              </td>
              <td className="px-5 py-3.5 max-w-[300px]">
                <code className="text-xs text-text-secondary font-mono truncate block group-hover:text-text transition-colors">
                  {record.code.split("\n")[0]}
                  {record.code.includes("\n") ? " ..." : ""}
                </code>
              </td>
              <td className="px-5 py-3.5 text-text-muted text-xs max-w-[200px] truncate">
                {record.output.join(", ") || "—"}
              </td>
              <td className="px-5 py-3.5 text-text-muted text-xs font-mono">
                {record.executionTimeMs}ms
              </td>
              <td className="px-5 py-3.5 text-text-muted text-xs">
                {new Date(record.createdAt).toLocaleString()}
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadCode(record.code);
                    }}
                    className="text-text-muted/50 hover:text-gold-light transition-all duration-200 p-1.5 rounded-md hover:bg-gold/10"
                    title="Cargar en el editor"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(record.id);
                    }}
                    className="text-text-muted/50 hover:text-error transition-all duration-200 p-1.5 rounded-md hover:bg-error/10"
                    title="Eliminar"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
