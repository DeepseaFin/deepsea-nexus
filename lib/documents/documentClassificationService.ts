import type { LLMProvider } from '@/lib/documents/llmProvider';

export type DocumentClassificationResult = {
  documentType: string;
  confidence: number;
  reasoning: string;
};

/**
 * Provides ORACLE document classification behavior.
 *
 * This service performs classification independently of any specific LLM
 * vendor by relying on the LLMProvider interface.
 */
export class DocumentClassificationService {
  constructor(private readonly llmProvider: LLMProvider) {}

  async classify(ocrText: string): Promise<DocumentClassificationResult> {
    await this.llmProvider.analyze(ocrText);

    return {
      documentType: 'TRADE_LICENSE',
      confidence: 100,
      reasoning: 'Mock classification.',
    };
  }
}
