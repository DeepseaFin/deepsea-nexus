import type { LLMProvider, LLMResult } from '@/lib/documents/llmProvider';

/**
 * Placeholder OpenAI LLM provider.
 *
 * This implementation intentionally returns mock analysis data so ORACLE
 * workflows can be integrated without external dependencies.
 * Replace with real OpenAI integration in a future sprint.
 */
export class OpenAILLMProvider implements LLMProvider {
  async analyze(prompt: string, context?: string): Promise<LLMResult> {
    void prompt;
    void context;

    return {
      rawResponse: 'Mock document analysis completed.',
      confidence: 100,
      metadata: {
        provider: 'OpenAI',
        model: 'mock',
      },
    };
  }
}
