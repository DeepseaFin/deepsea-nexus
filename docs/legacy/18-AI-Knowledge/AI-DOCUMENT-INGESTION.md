# AI Document Ingestion Standard

## Purpose

Define controlled ingestion rules that transform legacy documents into reliable AI knowledge assets with strong metadata quality, provenance, and governance compliance.

## Scope

Applies to ingestion of all docs/legacy content into DNOS knowledge services, including indexing, chunking, embedding, relationship extraction, and validation.

## Responsibilities

- Ingestion Engineers
  - Implement ingestion pipeline and enforce validation gates.
- Registry Steward
  - Ensure registry metadata alignment before ingestion.
- AI Platform Owner
  - Approve pipeline changes and quality thresholds.
- Domain Custodians
  - Resolve semantic extraction disputes.

## Process

1. Pre-ingestion checks
- Verify document status is Active unless explicitly testing draft mode.
- Verify required metadata fields exist and are valid.
- Verify source path exists and registry record matches.

2. Parsing and normalization
- Parse markdown headings and metadata block.
- Normalize dates, IDs, tags, and classification values.
- Generate canonical text representation for indexing.

3. Chunking policy
- Chunk by semantic sections rather than fixed token windows when possible.
- Preserve section heading path in chunk metadata.
- Maintain overlap only where section continuity requires it.

4. Enrichment
- Generate concise section summaries.
- Extract candidate entities using ontology entity types.
- Extract relationship candidates using linking standard context phrases.

5. Indexing and graph publish
- Write searchable chunks with object and section IDs.
- Publish validated nodes and edges to graph store.
- Attach provenance metadata for each edge and chunk.

6. Quality gates
- Completeness threshold: all mandatory metadata present.
- Link integrity threshold: no unresolved internal references.
- Provenance threshold: every generated relation mapped to source snippet.

7. Re-ingestion policy
- Re-ingest on version change, status change, or ontology update.
- Archive prior embeddings and graph versions for rollback.

## Examples

- Policy document ingestion output:
  - 1 document-level object
  - 6 section-level objects
  - 14 relationship edges
  - 6 vector index entries

- Validation failure example:
  - Missing document_id metadata results in ingestion rejection.

## Future Evolution

- Add incremental ingestion triggered by git diffs.
- Add confidence calibration per document class.
- Add automated exception queues for ambiguous relation extraction.
