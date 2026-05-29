import { useNavigate } from "react-router-dom";
import { useHistory, useDeleteHistory } from "../hooks/useHistory";
import HistoryTable from "../components/HistoryTable";
import { useEditorStore } from "../store/editorStore";

export default function History() {
  const navigate = useNavigate();
  const setCode = useEditorStore((s) => s.setCode);
  const { data: records, isLoading, error } = useHistory();
  const deleteMutation = useDeleteHistory();

  const handleSelect = (id: string) => {
    navigate(`/history/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este registro?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleLoadCode = (code: string) => {
    setCode(code);
    navigate("/");
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      <div className="px-6 py-5 border-b border-border bg-surface/20">
        <div className="flex items-center gap-2 mb-0.5">
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-base font-display font-semibold text-text">
            Historial de Ejecuciones
          </h2>
        </div>
        <p className="text-xs text-text-muted ml-6">
          Todas las ejecuciones realizadas, ordenadas por fecha
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <span className="text-sm text-text-muted">Cargando...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="w-10 h-10 mx-auto mb-3 text-error/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-error">Error al cargar el historial</p>
            </div>
          </div>
        ) : (
          <HistoryTable
            records={records || []}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onLoadCode={handleLoadCode}
          />
        )}
      </div>
    </div>
  );
}
