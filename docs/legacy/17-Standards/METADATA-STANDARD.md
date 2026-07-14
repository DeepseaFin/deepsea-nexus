# Metadata Standard

## Purpose

Define mandatory metadata for each Knowledge Object so identity, ownership, lifecycle, and governance traceability are machine-readable and operationally enforceable.

## Scope

Applies to all governed documents and derived section objects in docs/legacy.

## Responsibilities

- Document Owner
  - Provide complete metadata at draft creation and every revision.
- Registry Steward
  - Verify metadata consistency between document and registry.
- Ingestion Engineers
  - Reject records with invalid or incomplete metadata.

## Process

1. Mandatory metadata fields
- document_id
- title
- domain
- document_type
- version
- status
- owner_role
- reviewers
- effective_date
- last_reviewed
- source_path
- classification
- tags

2. Field validation rules
- document_id must satisfy DOCUMENT-ID-STANDARD.
- version must satisfy semantic version format.
- status must be one of Draft, Active, Superseded, Retired.
- effective_date and last_reviewed use ISO date format.
- source_path must be repository-relative.

3. Metadata placement
- Place metadata in the opening section of each document.
- Mirror required fields in registry/document-registry.md.

4. Update policy
- Update metadata in same change set as document body updates.
- last_reviewed must change on approved content revision.

## Examples

Metadata block example:

```markdown
- Document ID: DLR-STD-STD-0101
- Title: Metadata Standard
- Domain: Standards
- Type: Standard
- Version: 1.0.0
- Status: Active
- Owner Role: Knowledge Architecture Owner
- Reviewers: Domain Custodian, Editorial Steward
- Effective Date: 2026-07-14
- Last Reviewed: 2026-07-14
- Source Path: docs/legacy/17-Standards/METADATA-STANDARD.md
```

## Future Evolution

- Add metadata schema version field.
- Enforce metadata via repository pre-merge checks.
- Add signed approval metadata for critical governance documents.
