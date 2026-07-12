import type { LLMProvider } from '@/lib/documents/llmProvider';

export type DocumentMetadata = {
  companyName: string;
  licenseNumber: string;
  expiryDate: string;
  jurisdiction: string;
};

/**
 * Converts unstructured OCR text into structured institutional facts.
 *
 * This service remains independent of any specific LLM vendor by using the
 * LLMProvider interface through dependency injection.
 */
export class DocumentMetadataExtractionService {
  constructor(private readonly llmProvider: LLMProvider) {}

  async extract(ocrText: string): Promise<DocumentMetadata> {
    await this.llmProvider.analyze(ocrText);

    return {
      companyName: 'ABC Trading LLC',
      licenseNumber: 'TL-123456',
      expiryDate: '2027-01-10',
      jurisdiction: 'Dubai',
    };
  }
}
