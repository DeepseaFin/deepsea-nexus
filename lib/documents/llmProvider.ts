/**
 * Standardized result returned by LLM providers used by ORACLE.
 */
export interface LLMResult {
  rawResponse: string;
  confidence: number;
  metadata: Record<string, unknown>;
}

/**
 * LLM provider contract for ORACLE analysis workflows.
 *
 * This interface isolates ORACLE from specific LLM vendors such as OpenAI,
 * Anthropic, Google, or future providers by enforcing a stable API surface.
 * Provider implementations can be swapped without changing business logic.
 */
export interface LLMProvider {
  analyze(prompt: string, context?: string): Promise<LLMResult>;
}
