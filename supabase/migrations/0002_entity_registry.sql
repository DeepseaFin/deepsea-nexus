DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_status') THEN
    CREATE TYPE entity_status AS ENUM (
      'ACTIVE',
      'INACTIVE',
      'SUSPENDED',
      'ARCHIVED'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_type') THEN
    CREATE TYPE entity_type AS ENUM (
      'CLIENT',
      'DEAL',
      'DOCUMENT',
      'FACILITY',
      'COUNTERPARTY',
      'BANK',
      'USER'
    );
  END IF;
END$$;

CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_prefix TEXT NOT NULL,
  entity_number BIGINT NOT NULL,
  entity_type entity_type NOT NULL,
  display_name TEXT NOT NULL,
  status entity_status NOT NULL DEFAULT 'ACTIVE',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NULL,
  updated_by UUID NULL,
  UNIQUE(entity_prefix, entity_number)
);

COMMENT ON COLUMN entities.id IS 'Primary key identifier for the entity record.';
COMMENT ON COLUMN entities.entity_prefix IS 'Prefix segment of the business entity code.';
COMMENT ON COLUMN entities.entity_number IS 'Numeric segment of the business entity code.';
COMMENT ON COLUMN entities.entity_type IS 'Classification of the entity (for example: client, bank, counterparty).';
COMMENT ON COLUMN entities.display_name IS 'Human-readable name for display in UI and reports.';
COMMENT ON COLUMN entities.status IS 'Lifecycle status of the entity, defaulting to ACTIVE.';
COMMENT ON COLUMN entities.metadata IS 'Flexible JSON metadata for additional attributes.';
COMMENT ON COLUMN entities.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN entities.updated_at IS 'Timestamp when the record was last updated.';
COMMENT ON COLUMN entities.created_by IS 'Optional UUID of the actor that created the record.';
COMMENT ON COLUMN entities.updated_by IS 'Optional UUID of the actor that last updated the record.';

CREATE INDEX idx_entities_entity_type ON entities (entity_type);
CREATE INDEX idx_entities_status ON entities (status);
CREATE INDEX idx_entities_created_at ON entities (created_at);
