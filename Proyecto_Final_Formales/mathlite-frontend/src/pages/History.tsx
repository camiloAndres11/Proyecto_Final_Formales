import { useNavigate } from "react-router-dom";
import { useHistory, useDeleteHistory } from "../hooks/useHistory";
import HistoryTable from "../components/HistoryTable";

export default function History() {
  const navigate = useNavigate();
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

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">Historial de Ejecuciones</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          Todas las ejecuciones realizadas, ordenadas por fecha
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-red-400 text-sm">
            Error al cargar el historial
          </div>
        ) : (
          <HistoryTable
            records={records || []}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
