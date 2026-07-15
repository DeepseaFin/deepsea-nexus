# Deepsea Legacy Repository Changelog

## Purpose

Maintain a transparent history of governance, standards, templates, and registry changes within docs/legacy.

## Scope

Tracks controlled repository-level documentation changes from Project Legacy Release L1.0 onward.

## Responsibilities

- Document Owners
  - Submit accurate change summaries with each governed update.
- Registry Steward
  - Ensure changelog and registry entries remain synchronized.
- Domain Custodians
  - Confirm material changes are correctly represented.

## Process

1. For each controlled change, add a dated entry.
2. Group updates by Added, Changed, and Deprecated.
3. Link each change to affected paths and version intent.
4. Ensure entry aligns with registry updates and review approvals.

## Examples

- Added: Introduced repository governance standards and templates.
- Changed: Updated review workflow service expectations.
- Deprecated: Retired a superseded template.

## Future Evolution

- Automation from pull request labels into draft changelog sections
- Cross-reference to document IDs for full audit traceability

---

## 2026-07-14 - L1.0 Legacy Publishing Framework

### Added

- Governance framework:
  - docs/legacy/GOVERNANCE.md
  - docs/legacy/DOCUMENT-STANDARD.md
  - docs/legacy/WRITING-STANDARD.md
  - docs/legacy/VERSIONING-STANDARD.md
  - docs/legacy/DOCUMENT-ID-STANDARD.md
  - docs/legacy/EDITORIAL-STANDARD.md
  - docs/legacy/REVIEW-WORKFLOW.md

- Reusable template library in docs/legacy/templates:
  - constitution-template.md
  - manual-template.md
  - sop-template.md
  - policy-template.md
  - decision-template.md
  - lesson-template.md
  - mistake-template.md
  - research-template.md
  - academy-template.md

- Registry foundation:
  - docs/legacy/registry/document-registry.md

## 2026-07-14 - L1.0 Sprint 2 Knowledge Graph Architecture

### Added

- Knowledge graph standards:
  - docs/legacy/17-Standards/KNOWLEDGE-GRAPH-STANDARD.md
  - docs/legacy/17-Standards/KNOWLEDGE-OBJECT-STANDARD.md
  - docs/legacy/17-Standards/CLASSIFICATION-STANDARD.md
  - docs/legacy/17-Standards/TAGGING-STANDARD.md
  - docs/legacy/17-Standards/METADATA-STANDARD.md
  - docs/legacy/17-Standards/LINKING-STANDARD.md

- AI knowledge architecture:
  - docs/legacy/18-AI-Knowledge/AI-KNOWLEDGE-ARCHITECTURE.md
  - docs/legacy/18-AI-Knowledge/AI-DOCUMENT-INGESTION.md

- Deepsea dictionary foundations:
  - docs/legacy/15-Deepsea-Dictionary/ONTOLOGY.md
  - docs/legacy/15-Deepsea-Dictionary/ENTITY-TYPES.md
  - docs/legacy/15-Deepsea-Dictionary/BUSINESS-GLOSSARY.md

## 2026-07-14 - L2.0 The Charter of Deepsea

### Added

- Foundational charter publication:
  - docs/legacy/00-Charter/DS-CHR-001-The-Charter-of-Deepsea.md

### Changed

- Reframed DS-CHR-001 as a publication framework for collaborative drafting:
  - Added metadata, table of contents, part and chapter scaffolding
  - Added cross-reference placeholders and approval workflow section
  - Added structured revision history for future authoring cycles
  - Removed authored charter body text for Sprint 1 framework-only publication
