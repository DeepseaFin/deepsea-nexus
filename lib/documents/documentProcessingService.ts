import { getDocument, type DocumentRecord } from '@/lib/documents/documentRepository';

export type DocumentProcessingStage = 'QUEUED' | 'LOADING_DOCUMENT' | 'READY_FOR_OCR';

type ProcessingContext = {
  documentId: string;
  document: DocumentRecord | null;
};

type StageHandler = (context: ProcessingContext) => Promise<ProcessingContext>;

function logStage(stage: DocumentProcessingStage, documentId: string): void {
  console.log(`[DocumentProcessing] ${stage} documentId=${documentId}`);
}

const queueStage: StageHandler = async (context) => {
  logStage('QUEUED', context.documentId);
  return context;
};

const loadingDocumentStage: StageHandler = async (context) => {
  logStage('LOADING_DOCUMENT', context.documentId);

  const document = await getDocument(context.documentId);
  if (!document) {
    throw new Error(`Document not found: ${context.documentId}`);
  }

  return {
    ...context,
    document,
  };
};

const readyForOcrStage: StageHandler = async (context) => {
  logStage('READY_FOR_OCR', context.documentId);
  return context;
};

const stagePipeline: StageHandler[] = [queueStage, loadingDocumentStage, readyForOcrStage];

export async function processDocument(documentId: string): Promise<void> {
  let context: ProcessingContext = {
    documentId,
    document: null,
  };

  for (const stage of stagePipeline) {
    context = await stage(context);
  }
}
