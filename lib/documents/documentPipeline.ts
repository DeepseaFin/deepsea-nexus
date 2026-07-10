import type { DocumentQueueService } from '@/lib/documents/documentQueueService';
import type { DocumentWorker } from '@/lib/documents/documentWorker';

/**
 * Orchestrates ORACLE document processing stages.
 *
 * This pipeline coordinates queue and worker execution while staying
 * independent of specific OCR or LLM vendors. Vendor behavior is injected
 * through the worker and provider abstractions.
 */
export class DocumentPipeline {
  constructor(
    private readonly queue: DocumentQueueService,
    private readonly worker: DocumentWorker,
  ) {
    void this.queue;
  }

  async run(): Promise<void> {
    console.log('Starting document pipeline');
    await this.worker.processNext();
    console.log('Document pipeline completed');
  }
}
