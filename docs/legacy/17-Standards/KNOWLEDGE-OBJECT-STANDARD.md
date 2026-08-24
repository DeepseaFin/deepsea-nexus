# Knowledge Object Standard

## Purpose

Define how every governed document is transformed into a normalized Knowledge Object for indexing, retrieval, reasoning, and lineage tracking.

## Scope

Applies to all documents under docs/legacy, including standards, policies, procedures, templates, decisions, lessons, mistakes, research, and academy material.

## Responsibilities

- Document Owner
  - Ensure document structure and metadata satisfy object conversion rules.
- Registry Steward
  - Ensure object identity aligns with registry records.
- Ingestion Engineers
  - Execute transformation and quality checks.

## Process

1. Object creation rule
- Every document corresponds to one primary Knowledge Object.
- Long documents may produce subordinate section objects linked by has_part.

2. Mandatory Knowledge Object fields
- object_id: Document ID plus optional section suffix.
- document_id: canonical ID from repository metadata.
- title
- domain
- type
- version
- status
- owner_role
- effective_date
- last_reviewed
- source_path
- checksum
- summary
- tags

3. Optional fields
- related_entities
- risk_level
- confidentiality_level
- review_cycle_days
- embedding_vector_id
- parent_object_id

4. Object lifecycle states
- Draft
- Active
- Superseded
- Retired

5. Conversion protocol
- Parse metadata block.
- Extract structured headings.
- Build semantic section summaries.
- Assign classification and tags.
- Emit relationship candidates.
- Validate schema and publish to graph pipeline.

## Examples

Knowledge Object JSON shape:

```json
{
  "object_id": "DLR-CHTR-STD-0002",
  "document_id": "DLR-CHTR-STD-0002",
  "title": "Document Standard",
  "domain": "Charter",
  "type": "Standard",
  "version": "1.0.0",
  "status": "Active",
  "owner_role": "Repository Custodian Council",
  "effective_date": "2026-07-14",
  "last_reviewed": "2026-07-14",
  "source_path": "docs/legacy/DOCUMENT-STANDARD.md",
  "summary": "Defines mandatory structure for all governed legacy documentation.",
  "tags": ["governance", "document-control", "publication"]
}
```

Section object linkage:
- DLR-CHTR-STD-0002#Process has_part DLR-CHTR-STD-0002

## Future Evolution

- Add typed section extraction by document class.
- Add confidence-scored summaries for retrieval quality.
- Add backward compatibility rules for schema version migration.
