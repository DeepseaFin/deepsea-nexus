import type { OCRProvider } from '@/lib/documents/ocrProvider';
import type { DocumentClassificationService } from '@/lib/documents/documentClassificationService';
import type { DocumentMetadataExtractionService } from '@/lib/documents/documentMetadataExtractionService';
import type { DocumentQueueService } from '@/lib/documents/documentQueueService';

/**
 * ORACLE document processing worker.
 *
 * This worker orchestrates queue-driven processing, OCR, classification,
 * and metadata extraction while remaining independent of provider
 * implementations.
 *
 * OCR and LLM behavior is supplied through injected abstractions so vendor
 * integrations can evolve without changing worker orchestration logic.
 */
export class DocumentWorker {
  constructor(
    private readonly queue: DocumentQueueService,
    private readonly ocrProvider: OCRProvider,
    private readonly classificationService: DocumentClassificationService,
    private readonly metadataExtractionService: DocumentMetadataExtractionService,
  ) {}

  async processNext(): Promise<void> {
    const dequeued = await this.queue.dequeue();

    if (!dequeued) {
      console.log('No documents available.');
      return;
    }

    const ocrResult = await this.ocrProvider.extract('documents', 'intake/mock-path');
    const classification = await this.classificationService.classify(ocrResult.text);
    const metadata = await this.metadataExtractionService.extract(ocrResult.text);

    console.log('OCR completed.');
    console.log(`OCR confidence: ${ocrResult.confidence}`);
    console.log(`OCR page count: ${ocrResult.pages}`);
    console.log(`Document Type: ${classification.documentType}`);
    console.log(`Classification Confidence: ${classification.confidence}`);
    console.log(`Company Name: ${metadata.companyName}`);
    console.log(`License Number: ${metadata.licenseNumber}`);
  }
}
