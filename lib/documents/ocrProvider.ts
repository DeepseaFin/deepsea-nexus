/**
 * OCR extraction result returned by a provider implementation.
 */
export interface OCRResult {
  text: string;
  confidence: number;
  pages: number;
  metadata: Record<string, unknown>;
}

/**
 * OCR provider contract for ORACLE document processing.
 *
 * This interface isolates ORACLE from specific OCR vendors by defining
 * a stable extraction contract that can be implemented by any provider.
 * Implementations can be swapped without changing calling services.
 */
export interface OCRProvider {
  extract(storageBucket: string, storagePath: string): Promise<OCRResult>;
}
