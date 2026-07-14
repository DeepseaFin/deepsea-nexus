# Tagging Standard

## Purpose

Define consistent tagging conventions so Knowledge Objects can be retrieved through stable semantic labels across domains and over time.

## Scope

Applies to document-level and section-level tags across all docs/legacy artifacts and ingestion outputs.

## Responsibilities

- Document Owner
  - Apply meaningful tags from approved vocabularies.
- Domain Custodian
  - Ensure domain tags remain coherent and non-duplicative.
- Registry Steward
  - Maintain approved tag vocabularies and alias mappings.

## Process

1. Tag classes
- Domain tags: charter, operations, research, ai-knowledge
- Function tags: governance, review, policy, control, escalation
- Topic tags: knowledge-graph, ontology, metadata, taxonomy
- Lifecycle tags: draft, active, superseded, retired

2. Naming conventions
- Lowercase only
- Hyphen-separated words
- No punctuation except hyphen
- Maximum length: 40 characters

3. Cardinality rules
- Minimum tags per object: 3
- Maximum tags per object: 12
- At least one domain tag and one function tag required

4. Alias and synonym handling
- Maintain canonical tag and aliases in registry governance notes.
- Ingestion must normalize aliases to canonical tags.

5. Prohibited patterns
- Duplicate semantic tags with different spellings
- Unscoped generic tags such as important or misc
- Context-free abbreviations

## Examples

Recommended tag set:
- governance
- document-control
- knowledge-graph
- ontology
- standards

Not recommended:
- misc
- random-note
- urgent

## Future Evolution

- Introduce controlled tag ontology with hierarchical inheritance.
- Add automated drift reports for low-quality tags.
- Add tag usage analytics to optimize retrieval performance.
