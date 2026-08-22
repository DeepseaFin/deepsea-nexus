CREATE TABLE IF NOT EXISTS workflow_contexts (
  workflow_id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL,
  opportunity_id TEXT NOT NULL,
  receivable_id TEXT NULL,
  opportunity_lifecycle TEXT NOT NULL,
  current_owner TEXT NOT NULL,
  current_workspace TEXT NOT NULL,
  payload JSONB NOT NULL
);

COMMENT ON TABLE workflow_contexts IS 'Durable workflow business-context persistence aligned to WorkflowContextRepository contract.';
COMMENT ON COLUMN workflow_contexts.workflow_id IS 'Canonical workflow identifier used as the repository key.';
COMMENT ON COLUMN workflow_contexts.institution_id IS 'Institution identity associated with the workflow context.';
COMMENT ON COLUMN workflow_contexts.opportunity_id IS 'Business opportunity identity associated with the workflow context.';
COMMENT ON COLUMN workflow_contexts.receivable_id IS 'Optional receivable identity carried by the workflow context.';
COMMENT ON COLUMN workflow_contexts.opportunity_lifecycle IS 'Opportunity lifecycle value from the workflow domain lifecycle enum.';
COMMENT ON COLUMN workflow_contexts.current_owner IS 'Current owner value from the workflow business context.';
COMMENT ON COLUMN workflow_contexts.current_workspace IS 'Current workspace value from the workflow business context.';
COMMENT ON COLUMN workflow_contexts.payload IS 'Structured persisted business-context payload used for reconstruction.';
