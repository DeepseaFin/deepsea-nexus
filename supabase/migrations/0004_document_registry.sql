CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_code TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  storage_bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  checksum TEXT NULL,
  client_id UUID NULL,
  deal_id UUID NULL,
  entity_id UUID NULL,
  document_type TEXT NOT NULL DEFAULT 'UNKNOWN',
  status TEXT NOT NULL DEFAULT 'UPLOADED',
  ocr_status TEXT NOT NULL DEFAULT 'PENDING',
  classification_status TEXT NOT NULL DEFAULT 'PENDING',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  uploaded_by UUID NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_document_code ON documents (document_code);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents (client_id);
CREATE INDEX IF NOT EXISTS idx_documents_deal_id ON documents (deal_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity_id ON documents (entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents (document_type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents (uploaded_at);

COMMENT ON TABLE documents IS 'Registry of uploaded documents and their storage, classification, and lifecycle metadata.';

COMMENT ON COLUMN documents.id IS 'Primary unique identifier for the document record.';
COMMENT ON COLUMN documents.document_code IS 'Unique institutional document code used for operational reference.';
COMMENT ON COLUMN documents.file_name IS 'Stored file name used within the storage destination.';
COMMENT ON COLUMN documents.original_file_name IS 'Original file name supplied at upload time.';
COMMENT ON COLUMN documents.storage_bucket IS 'Supabase Storage bucket that contains the document binary.';
COMMENT ON COLUMN documents.storage_path IS 'Full object path of the stored document inside the bucket.';
COMMENT ON COLUMN documents.mime_type IS 'Detected or provided MIME type of the uploaded document.';
COMMENT ON COLUMN documents.file_size IS 'File size in bytes.';
COMMENT ON COLUMN documents.checksum IS 'Optional checksum for integrity validation and deduplication workflows.';
COMMENT ON COLUMN documents.client_id IS 'Optional reference to the related client identifier.';
COMMENT ON COLUMN documents.deal_id IS 'Optional reference to the related deal identifier.';
COMMENT ON COLUMN documents.entity_id IS 'Optional reference to the related institutional entity identifier.';
COMMENT ON COLUMN documents.document_type IS 'Canonical document type classification label.';
COMMENT ON COLUMN documents.status IS 'Current lifecycle status of the document record.';
COMMENT ON COLUMN documents.ocr_status IS 'Processing status of OCR for the document.';
COMMENT ON COLUMN documents.classification_status IS 'Processing status of document classification and extraction.';
COMMENT ON COLUMN documents.metadata IS 'Flexible JSON metadata payload associated with the document.';
COMMENT ON COLUMN documents.uploaded_by IS 'Optional identifier of the user who uploaded the document.';
COMMENT ON COLUMN documents.uploaded_at IS 'Timestamp when the document upload was completed.';
COMMENT ON COLUMN documents.created_at IS 'Timestamp when the document record was created.';
COMMENT ON COLUMN documents.updated_at IS 'Timestamp when the document record was last updated.';
