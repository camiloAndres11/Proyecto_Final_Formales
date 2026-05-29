import { create } from "zustand";
import type { ExecutionResponse } from "../types";

interface EditorState {
  code: string;
  results: ExecutionResponse | null;
  isExecuting: boolean;
  setCode: (code: string) => void;
  setResults: (results: ExecutionResponse | null) => void;
  setIsExecuting: (v: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: "",
  results: null,
  isExecuting: false,
  setCode: (code) => set({ code }),
  setResults: (results) => set({ results }),
  setIsExecuting: (isExecuting) => set({ isExecuting }),
}));
