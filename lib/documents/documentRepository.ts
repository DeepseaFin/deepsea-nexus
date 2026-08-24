import { getSupabaseClient } from '@/lib/supabase/client';

export type DocumentRecord = {
  id: string;
  document_code: string;
  file_name: string;
  original_file_name: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  checksum: string | null;
  client_id: string | null;
  deal_id: string | null;
  entity_id: string | null;
  document_type: string;
  status: string;
  ocr_status: string;
  classification_status: string;
  metadata: Record<string, unknown>;
  uploaded_by: string | null;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
};

export type CreateDocumentInput = {
  document_code: string;
  file_name: string;
  original_file_name: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  checksum?: string | null;
  client_id?: string | null;
  deal_id?: string | null;
  entity_id?: string | null;
  document_type?: string;
  status?: string;
  ocr_status?: string;
  classification_status?: string;
  metadata?: Record<string, unknown>;
  uploaded_by?: string | null;
  uploaded_at?: string;
};

export type ListDocumentsFilters = {
  client_id?: string;
  deal_id?: string;
  entity_id?: string;
  status?: string;
  document_type?: string;
  uploaded_by?: string;
  limit?: number;
};

export type UpdateDocumentInput = Partial<
  Pick<
    DocumentRecord,
    | 'file_name'
    | 'original_file_name'
    | 'storage_bucket'
    | 'storage_path'
    | 'mime_type'
    | 'file_size'
    | 'checksum'
    | 'client_id'
    | 'deal_id'
    | 'entity_id'
    | 'document_type'
    | 'status'
    | 'ocr_status'
    | 'classification_status'
    | 'metadata'
    | 'uploaded_by'
    | 'uploaded_at'
  >
>;

function ensureSingleResult<T>(data: T | null, error: { message: string } | null, action: string): T {
  if (error) {
    throw new Error(`Document repository ${action} failed: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Document repository ${action} failed: no data returned.`);
  }

  return data;
}

export async function createDocument(input: CreateDocumentInput): Promise<DocumentRecord> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .insert({
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
      document_type: input.document_type ?? 'UNKNOWN',
      status: input.status ?? 'UPLOADED',
      ocr_status: input.ocr_status ?? 'PENDING',
      classification_status: input.classification_status ?? 'PENDING',
      metadata: input.metadata ?? {},
      uploaded_by: input.uploaded_by ?? null,
      uploaded_at: input.uploaded_at,
    })
    .select('*')
    .single<DocumentRecord>();

  return ensureSingleResult(data, error, 'create');
}

export async function getDocument(id: string): Promise<DocumentRecord | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .maybeSingle<DocumentRecord>();

  if (error) {
    throw new Error(`Document repository get failed: ${error.message}`);
  }

  return data;
}

export async function listDocuments(filters: ListDocumentsFilters = {}): Promise<DocumentRecord[]> {
  const supabase = getSupabaseClient();
  let query = supabase.from('documents').select('*').order('uploaded_at', { ascending: false });

  if (filters.client_id) {
    query = query.eq('client_id', filters.client_id);
  }

  if (filters.deal_id) {
    query = query.eq('deal_id', filters.deal_id);
  }

  if (filters.entity_id) {
    query = query.eq('entity_id', filters.entity_id);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.document_type) {
    query = query.eq('document_type', filters.document_type);
  }

  if (filters.uploaded_by) {
    query = query.eq('uploaded_by', filters.uploaded_by);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query.returns<DocumentRecord[]>();

  if (error) {
    throw new Error(`Document repository list failed: ${error.message}`);
  }

  return data ?? [];
}

export async function updateDocument(id: string, input: UpdateDocumentInput): Promise<DocumentRecord> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single<DocumentRecord>();

  return ensureSingleResult(data, error, 'update');
}

export async function deleteDocument(id: string): Promise<DocumentRecord> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .select('*')
    .single<DocumentRecord>();

  return ensureSingleResult(data, error, 'delete');
}
