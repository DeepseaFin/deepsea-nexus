/**
 * Queue orchestration service for ORACLE document processing.
 *
 * This service abstracts queue technology from ORACLE business logic so the
 * processing pipeline can remain stable while queue backends evolve.
 * Future implementations can use Redis, Supabase Queues, SQS, or other
 * providers without changing callers.
 */
export class DocumentQueueService {
  async enqueue(documentId: string): Promise<void> {
    console.log(`[DocumentQueueService] enqueue documentId=${documentId}`);
  }

  async dequeue(): Promise<void> {
    console.log('[DocumentQueueService] dequeue');
  }

  async markProcessing(documentId: string): Promise<void> {
    console.log(`[DocumentQueueService] markProcessing documentId=${documentId}`);
  }

  async markCompleted(documentId: string): Promise<void> {
    console.log(`[DocumentQueueService] markCompleted documentId=${documentId}`);
  }

  async markFailed(documentId: string, reason: string): Promise<void> {
    console.log(`[DocumentQueueService] markFailed documentId=${documentId} reason=${reason}`);
  }
}
