import type {
  CreateDocumentInput,
  DocumentRecord,
  ListDocumentsFilters,
  UpdateDocumentInput,
} from "@/lib/documents/documentRepository";

export interface DocumentsRepository {
  findById(id: string): Promise<DocumentRecord | null>;
  list(filters?: ListDocumentsFilters): Promise<readonly DocumentRecord[]>;
  create(input: CreateDocumentInput): Promise<DocumentRecord>;
  update(id: string, input: UpdateDocumentInput): Promise<DocumentRecord>;
  delete(id: string): Promise<DocumentRecord>;
}
