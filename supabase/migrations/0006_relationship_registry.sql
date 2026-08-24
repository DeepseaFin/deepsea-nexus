CREATE TABLE IF NOT EXISTS relationships (
  relationship_id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  relationship_name TEXT NOT NULL,
  status TEXT NOT NULL,
  stage TEXT NOT NULL,
  owner JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_relationships_institution_id ON relationships (institution_id);

COMMENT ON TABLE relationships IS 'Institution-scoped relationship records used by the relationship domain service boundary.';
COMMENT ON COLUMN relationships.relationship_id IS 'Domain relationship identifier persisted as text to preserve RelationshipId value semantics.';
COMMENT ON COLUMN relationships.institution_id IS 'Institution scope key used for relationship partitioning and lookups.';
COMMENT ON COLUMN relationships.relationship_name IS 'Display name of the relationship.';
COMMENT ON COLUMN relationships.status IS 'Lifecycle status value from the relationship domain enum.';
COMMENT ON COLUMN relationships.stage IS 'Lifecycle stage value from the relationship domain enum.';
COMMENT ON COLUMN relationships.owner IS 'Structured relationship owner payload.';
COMMENT ON COLUMN relationships.created_at IS 'Timestamp when the relationship record was created.';
COMMENT ON COLUMN relationships.updated_at IS 'Timestamp when the relationship record was last updated.';
COMMENT ON COLUMN relationships.metadata IS 'Flexible relationship metadata payload.';
