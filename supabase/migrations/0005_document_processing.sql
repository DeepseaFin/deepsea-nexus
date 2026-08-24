ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS processing_status TEXT NOT NULL DEFAULT 'QUEUED',
  ADD COLUMN IF NOT EXISTS ocr_text TEXT NULL,
  ADD COLUMN IF NOT EXISTS ocr_confidence NUMERIC(5,2) NULL,
  ADD COLUMN IF NOT EXISTS ocr_started_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS ocr_completed_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS classification_started_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS classification_completed_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS processing_error TEXT NULL;

COMMENT ON COLUMN documents.processing_status IS 'Overall processing lifecycle status for the document pipeline (e.g., QUEUED, OCR_IN_PROGRESS, OCR_COMPLETED).';
COMMENT ON COLUMN documents.ocr_text IS 'Raw OCR extracted text output for the document.';
COMMENT ON COLUMN documents.ocr_confidence IS 'Aggregate OCR confidence score from 0.00 to 100.00.';
COMMENT ON COLUMN documents.ocr_started_at IS 'Timestamp when OCR processing started.';
COMMENT ON COLUMN documents.ocr_completed_at IS 'Timestamp when OCR processing completed.';
COMMENT ON COLUMN documents.classification_started_at IS 'Timestamp when document classification started.';
COMMENT ON COLUMN documents.classification_completed_at IS 'Timestamp when document classification completed.';
COMMENT ON COLUMN documents.processing_error IS 'Latest processing error message captured during OCR or classification stages.';

CREATE INDEX IF NOT EXISTS idx_documents_processing_status ON documents (processing_status);
