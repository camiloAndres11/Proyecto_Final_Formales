import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistory, getHistoryById, deleteHistory } from "../api/history";

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
    refetchInterval: 5000,
  });
}

export function useHistoryDetail(id: string) {
  return useQuery({
    queryKey: ["history", id],
    queryFn: () => getHistoryById(id),
    enabled: !!id,
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
