# Business Glossary

## Purpose

Provide authoritative definitions for recurring Deepsea terms so governance, operations, and AI systems interpret language consistently.

## Scope

Applies to all docs/legacy content and future DNOS interfaces that expose institutional terminology.

## Responsibilities

- Glossary Steward
  - Maintain term definitions and resolve ambiguity.
- Domain Custodians
  - Propose additions and validate domain-specific usage.
- Editorial Steward
  - Enforce glossary-aligned language in published documents.

## Process

1. Term admission criteria
- Frequently used across multiple documents or domains.
- Material governance or operational significance.
- Risk of ambiguity without standard definition.

2. Definition format
- Term
- Definition
- Context of use
- Related terms
- Disallowed ambiguous usage

3. Update governance
- Additions require domain review and glossary steward approval.
- Changes to critical terms require changelog entry and dependency review.

## Examples

### Knowledge Object
Definition: The normalized machine-readable representation of a governed document or document section used for indexing, retrieval, and graph reasoning.
Context of use: Knowledge graph ingestion, AI retrieval pipelines.
Related terms: Metadata, Classification, Tagging.
Disallowed ambiguous usage: Generic use of object without repository context.

### Domain Custodian
Definition: The role accountable for quality, consistency, and governance conformance of documentation within a designated domain.
Context of use: Review approvals, classification validation.
Related terms: Document Owner, Editorial Steward.
Disallowed ambiguous usage: Any informal team reviewer.

### Provenance
Definition: The traceable origin of a statement, relationship, or recommendation, including source document, section, and version context.
Context of use: AI explainability, governance audit.
Related terms: Evidence Reference, Lineage, Changelog.
Disallowed ambiguous usage: Unattributed claim source.

### Governance Criticality
Definition: Classification level expressing the institutional impact of a document on authority, control, and risk posture.
Context of use: Classification Standard, review prioritization.
Related terms: Operational Impact, Lifecycle State.
Disallowed ambiguous usage: Generic importance ranking without criteria.

### Superseded
Definition: Lifecycle state indicating a document has been replaced by a newer approved version while retained for historical traceability.
Context of use: Versioning, linking, registry status.
Related terms: Supersedes, Retired.
Disallowed ambiguous usage: Deleted or obsolete without lineage.

## Future Evolution

- Add bilingual glossary support for institutional operations across regions.
- Add controlled term identifiers for machine-level referencing.
- Add glossary dependency maps to detect definition drift.
