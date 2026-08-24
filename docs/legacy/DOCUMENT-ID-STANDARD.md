# Document ID Standard

## Purpose

Create a unique and human-readable identification system for all legacy documents to support retrieval, governance, and audit traceability.

## Scope

Applies to every governed document under docs/legacy, including standards, policies, procedures, manuals, decisions, lessons, mistakes, and research notes.

## Responsibilities

- Document Owner
  - Request and apply a valid Document ID before review.
- Domain Custodian
  - Confirm correct domain code and sequence usage.
- Registry Steward
  - Maintain uniqueness in document-registry.md.

## Process

Document ID format:

DLR-[DOMAIN]-[TYPE]-[NNNN]

Where:
- DLR = Deepsea Legacy Repository
- DOMAIN = 3 to 5 letter domain code
- TYPE = document class code
- NNNN = zero-padded sequence number

Domain code examples:
- CHTR = Charter
- CONS = Constitution
- ENGG = Engineering
- OPER = Operations
- ACAD = Academy
- RSRCH = Research

Type code examples:
- STD = Standard
- POL = Policy
- SOP = Procedure
- MAN = Manual
- DEC = Decision
- LES = Lesson
- MIS = Mistake
- TMP = Template

Allocation rules:
1. Sequence is unique within DOMAIN and TYPE pair.
2. Retired IDs are never reused.
3. Superseded documents retain original ID and receive new version.

## Examples

- DLR-ENGG-STD-0001
- DLR-OPER-SOP-0012
- DLR-ACAD-MAN-0004
- DLR-RSRCH-DEC-0009

## Future Evolution

Potential future improvements:
- Checksum suffix for export integrity
- Time-sliced sequence namespaces by publication year
- Registry automation for ID issuance and collision prevention
