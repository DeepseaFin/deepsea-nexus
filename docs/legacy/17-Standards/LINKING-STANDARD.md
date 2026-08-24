# Linking Standard

## Purpose

Define how documents, Knowledge Objects, and ontology entities link to each other so repository knowledge is navigable, explainable, and machine-actionable.

## Scope

Applies to markdown links, semantic relationship edges, and registry cross-references across docs/legacy.

## Responsibilities

- Authors
  - Add context-relevant links to upstream standards and downstream procedures.
- Reviewers
  - Verify link intent, correctness, and relationship semantics.
- Ingestion Engineers
  - Convert valid links into graph edges with provenance.

## Process

1. Link categories
- Structural links: parent-child section or document hierarchy.
- Dependency links: prerequisite standards and policies.
- Evidence links: research or decision support references.
- Lineage links: supersedes or derived-from relationships.

2. Markdown linking rules
- Use repository-relative paths.
- Link only to canonical source documents.
- Avoid duplicate links for the same target in one section.

3. Semantic edge derivation
- A markdown link plus context phrase maps to relationship type.
- Context phrase examples:
  - governed by maps to governs
  - implemented through maps to implemented_by
  - derived from maps to derived_from

4. Link integrity controls
- Broken links are blocking issues for publication.
- Orphan documents must be linked to at least one parent or governing standard.

5. Relationship type set
- references
- governs
- implemented_by
- depends_on
- derived_from
- supersedes
- contains
- related_to

## Examples

- A procedure document links to a governing policy using phrase governed by.
- A lesson record links to mistake record and decision record as derived_from.
- A new standard links supersedes to prior version.

## Future Evolution

- Add automated link intent extraction and edge scoring.
- Add bidirectional link consistency checks.
- Add dependency impact reports for standard changes.
