import type { OCRProvider } from '@/lib/documents/ocrProvider';
import type { DocumentQueueService } from '@/lib/documents/documentQueueService';

/**
 * ORACLE document processing worker.
 *
 * This worker orchestrates queue-driven processing and OCR execution while
 * remaining independent of specific OCR vendor implementations.
 * OCR behavior is provided through dependency injection via OCRProvider.
 */
export class DocumentWorker {
  constructor(
    private readonly queue: DocumentQueueService,
    private readonly ocrProvider: OCRProvider,
  ) {}

  async processNext(): Promise<void> {
    const dequeued = (await this.queue.dequeue()) as string | null | undefined;

    if (!dequeued) {
      console.log('No documents available.');
      return;
    }

    const ocrResult = await this.ocrProvider.extract('documents', 'intake/mock-path');

    console.log('OCR completed.');
    console.log(`OCR confidence: ${ocrResult.confidence}`);
    console.log(`OCR page count: ${ocrResult.pages}`);
  }
}
