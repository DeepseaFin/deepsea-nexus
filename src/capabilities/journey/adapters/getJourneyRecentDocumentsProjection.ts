import { listDocuments, type DocumentRecord } from "@/lib/documents/documentRepository";

export interface JourneyRecentDocument {
  readonly id: string;
  readonly documentCode: string;
  readonly name: string;
  readonly type: string;
  readonly uploadStatus: string;
  readonly uploadDate: string;
  readonly source: string;
}

export type JourneyRecentDocumentsViewModel = readonly JourneyRecentDocument[];

function toJourneyRecentDocument(document: DocumentRecord): JourneyRecentDocument {
  return {
    id: document.id,
    documentCode: document.document_code,
    name: document.original_file_name || document.file_name,
    type: document.document_type || "UNKNOWN",
    uploadStatus: document.status || "PENDING",
    uploadDate: document.uploaded_at,
    source: document.uploaded_by || document.storage_bucket || "ORACLE",
  };
}

export async function getJourneyRecentDocumentsProjection(limit = 6): Promise<JourneyRecentDocumentsViewModel> {
  const documents = await listDocuments({ limit });
  return documents.map(toJourneyRecentDocument);
}