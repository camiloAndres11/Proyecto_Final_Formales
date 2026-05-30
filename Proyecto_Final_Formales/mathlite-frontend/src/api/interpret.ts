import apiClient from "./client";
import type { ExecutionResponse, ExecutionRequest } from "../types";

export async function executeCode(code: string): Promise<ExecutionResponse> {
  const body: ExecutionRequest = { code };
  const { data } = await apiClient.post<ExecutionResponse>(
    "/api/interpret",
    body
  );
  return data;
}
