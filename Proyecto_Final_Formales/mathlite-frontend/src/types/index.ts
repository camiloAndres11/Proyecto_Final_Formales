export interface Token {
  type: string;
  lexeme: string;
  line: number;
  column: number;
}

export interface ExecutionErrors {
  lexical: string[];
  syntactic: string[];
  semantic: string[];
  runtime: string[];
}

export interface ExecutionResponse {
  success: boolean;
  output: string[];
  tokens: Token[];
  ast: Record<string, unknown>;
  errors: ExecutionErrors;
  executionTimeMs: number;
}

export interface ExecutionRecord {
  id: string;
  code: string;
  output: string[];
  astJson: Record<string, unknown>;
  errors: ExecutionErrors;
  success: boolean;
  executionTimeMs: number;
  createdAt: string;
}

export interface ExecutionRequest {
  code: string;
}
