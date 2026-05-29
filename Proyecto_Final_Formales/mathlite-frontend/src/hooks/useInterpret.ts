import { useMutation } from "@tanstack/react-query";
import { executeCode } from "../api/interpret";
import { useEditorStore } from "../store/editorStore";
import type { AxiosError } from "axios";

export function useInterpret() {
  const setResults = useEditorStore((s) => s.setResults);
  const setIsExecuting = useEditorStore((s) => s.setIsExecuting);

  return useMutation({
    mutationFn: executeCode,
    onMutate: () => {
      setIsExecuting(true);
      setResults(null);
    },
    onSuccess: (data) => {
      setResults(data);
    },
    onError: (error: AxiosError) => {
      setResults({
        success: false,
        output: [],
        tokens: [],
        ast: {},
        errors: {
          lexical: [],
          syntactic: [],
          semantic: [],
          runtime: [error.message],
        },
        executionTimeMs: 0,
      });
    },
    onSettled: () => {
      setIsExecuting(false);
    },
  });
}
