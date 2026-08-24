import type {
  CreateDocumentInput,
  DocumentRecord,
  ListDocumentsFilters,
  UpdateDocumentInput,
} from "@/lib/documents/documentRepository";
import type { DocumentsRepository } from "@/lib/documents/repositories/DocumentsRepository";

type JsonLikeRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is JsonLikeRecord {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const clone: JsonLikeRecord = {};
  for (const [key, entry] of Object.entries(value)) {
    clone[key] = cloneValue(entry);
  }

  return clone as T;
}

function cloneDocument(record: DocumentRecord): DocumentRecord {
  return cloneValue(record);
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase();
}

function matchesFilters(record: DocumentRecord, filters: ListDocumentsFilters): boolean {
  if (filters.client_id && record.client_id !== filters.client_id) {
    return false;
  }

  if (filters.deal_id && record.deal_id !== filters.deal_id) {
    return false;
  }

  if (filters.entity_id && record.entity_id !== filters.entity_id) {
    return false;
  }

  if (filters.status && normalizeStatus(record.status) !== normalizeStatus(filters.status)) {
    return false;
  }

  if (filters.document_type && record.document_type !== filters.document_type) {
    return false;
  }

  if (filters.uploaded_by && record.uploaded_by !== filters.uploaded_by) {
    return false;
  }

  return true;
}

function createRecordFromInput(input: CreateDocumentInput): DocumentRecord {
  const timestamp = input.uploaded_at ?? nowIso();
  return {
    id: `${input.document_code}-${Math.random().toString(36).slice(2, 10)}`,
    document_code: input.document_code,
    file_name: input.file_name,
    original_file_name: input.original_file_name,
    storage_bucket: input.storage_bucket,
    storage_path: input.storage_path,
    mime_type: input.mime_type,
    file_size: input.file_size,
    checksum: input.checksum ?? null,
    client_id: input.client_id ?? null,
    deal_id: input.deal_id ?? null,
    entity_id: input.entity_id ?? null,
    document_type: input.document_type ?? "UNKNOWN",
    status: input.status ?? "UPLOADED",
    ocr_status: input.ocr_status ?? "PENDING",
    classification_status: input.classification_status ?? "PENDING",
    metadata: input.metadata ?? {},
    uploaded_by: input.uploaded_by ?? null,
    uploaded_at: timestamp,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export class InMemoryDocumentsRepository implements DocumentsRepository {
  private readonly documentsById = new Map<string, DocumentRecord>();

  constructor(seed: readonly DocumentRecord[] = []) {
    for (const record of seed) {
      this.documentsById.set(record.id, cloneDocument(record));
    }
  }

  async findById(id: string): Promise<DocumentRecord | null> {
    const stored = this.documentsById.get(id);
    return stored ? cloneDocument(stored) : null;
  }

  async list(filters: ListDocumentsFilters = {}): Promise<readonly DocumentRecord[]> {
    const matches = Array.from(this.documentsById.values())
      .filter((record) => matchesFilters(record, filters))
      .sort((left, right) => right.uploaded_at.localeCompare(left.uploaded_at));

    if (filters.limit && filters.limit > 0) {
      return matches.slice(0, filters.limit).map((record) => cloneDocument(record));
    }

    return matches.map((record) => cloneDocument(record));
  }

  async create(input: CreateDocumentInput): Promise<DocumentRecord> {
    const record = createRecordFromInput(input);
    this.documentsById.set(record.id, cloneDocument(record));
    return cloneDocument(record);
  }

  async update(id: string, input: UpdateDocumentInput): Promise<DocumentRecord> {
    const existing = this.documentsById.get(id);
    if (!existing) {
      throw new Error(`Document ${id} was not found.`);
    }

    const updated: DocumentRecord = {
      ...existing,
      ...input,
      updated_at: nowIso(),
    };

    this.documentsById.set(id, cloneDocument(updated));
    return cloneDocument(updated);
  }

  async delete(id: string): Promise<DocumentRecord> {
    const existing = this.documentsById.get(id);
    if (!existing) {
      throw new Error(`Document ${id} was not found.`);
    }

    this.documentsById.delete(id);
    return cloneDocument(existing);
  }
}

export function createInMemoryDocumentsRepository(
  seed: readonly DocumentRecord[] = [],
): DocumentsRepository {
  return new InMemoryDocumentsRepository(seed);
}
