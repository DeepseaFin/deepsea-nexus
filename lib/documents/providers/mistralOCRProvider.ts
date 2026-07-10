import type { OCRProvider, OCRResult } from '@/lib/documents/ocrProvider';

/**
 * Placeholder Mistral OCR provider.
 *
 * This implementation intentionally returns mock data so ORACLE can be
 * integrated and tested without external OCR dependencies.
 * Replace with real vendor API integration in a future sprint.
 */
export class MistralOCRProvider implements OCRProvider {
  async extract(storageBucket: string, storagePath: string): Promise<OCRResult> {
    void storageBucket;
    void storagePath;

    return {
      text: 'Mock OCR output.',
      confidence: 100,
      pages: 1,
      metadata: {
        provider: 'Mistral',
        version: 'mock',
      },
    };
  }
}
