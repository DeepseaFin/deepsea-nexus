# Entity Types

## Purpose

Define the canonical entity types used by Deepsea knowledge systems so extraction, tagging, linking, and retrieval remain semantically consistent.

## Scope

Applies to all entity extraction and mapping from docs/legacy documents into the Deepsea Knowledge Graph.

## Responsibilities

- Ontology Steward
  - Maintain approved entity type list and attributes.
- Ingestion Engineers
  - Map extracted terms to approved entity types.
- Domain Custodians
  - Validate entity mapping quality in domain reviews.

## Process

1. Governance entities
- Standard
- Policy
- Procedure
- Manual
- Control
- Exception

2. Institutional entities
- Department
- Role
- Custodian
- Committee
- Function

3. Operational entities
- Workflow
- Step
- Trigger
- Escalation Path
- Service Level Objective

4. Knowledge entities
- Knowledge Object
- Tag
- Classification
- Ontology Class
- Relationship Type

5. Outcome entities
- Decision
- Lesson
- Mistake
- Recommendation
- Risk

6. Evidence entities
- Evidence Reference
- Source Document
- Review Record
- Changelog Entry

Entity attribute baseline:
- entity_id
- entity_type
- display_name
- definition
- source_document_id
- confidence
- status

## Examples

- Review Workflow document contains entities:
  - Procedure
  - Role
  - Escalation Path
  - Service Level Objective

- Metadata Standard document contains entities:
  - Standard
  - Knowledge Object
  - Classification
  - Tag

## Future Evolution

- Add product and jurisdiction entity families.
- Add synonym and alias resolution policies.
- Add confidence weighting by entity type complexity.
