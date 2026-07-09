DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_event_type') THEN
    CREATE TYPE audit_event_type AS ENUM (
      'CREATED',
      'UPDATED',
      'STATUS_CHANGED',
      'APPROVED',
      'REJECTED',
      'DELETED'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  event_type audit_event_type NOT NULL,
  actor_id UUID NULL,
  actor_name TEXT NULL,
  event_summary TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE audit_logs IS 'Institutional audit ledger capturing material events across DNOS entities.';
COMMENT ON COLUMN audit_logs.id IS 'Primary key identifier for each audit event.';
COMMENT ON COLUMN audit_logs.entity_id IS 'Identifier of the entity associated with the audited event.';
COMMENT ON COLUMN audit_logs.event_type IS 'Categorized audit event type for filtering and reporting.';
COMMENT ON COLUMN audit_logs.actor_id IS 'Optional UUID of the user or system actor that initiated the event.';
COMMENT ON COLUMN audit_logs.actor_name IS 'Optional denormalized actor display name captured at event time.';
COMMENT ON COLUMN audit_logs.event_summary IS 'Short human-readable summary of the audited event.';
COMMENT ON COLUMN audit_logs.details IS 'Structured JSON payload containing event-specific details.';
COMMENT ON COLUMN audit_logs.created_at IS 'Timestamp when the audit event was recorded.';
COMMENT ON COLUMN audit_logs.updated_at IS 'Timestamp when the audit event record was last updated.';

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs (entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at);
