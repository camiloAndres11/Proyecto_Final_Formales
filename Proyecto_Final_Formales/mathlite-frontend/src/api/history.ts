import apiClient from "./client";
import type { ExecutionRecord } from "../types";

export async function getHistory(): Promise<ExecutionRecord[]> {
  const { data } = await apiClient.get<ExecutionRecord[]>("/api/history");
  return data;
}

export async function getHistoryById(id: string): Promise<ExecutionRecord> {
  const { data } = await apiClient.get<ExecutionRecord>(`/api/history/${id}`);
  return data;
}

export async function deleteHistory(id: string): Promise<void> {
  await apiClient.delete(`/api/history/${id}`);
}
