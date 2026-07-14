# Document Standard

## Purpose

Establish a uniform document architecture so every legacy artifact is readable, reviewable, and auditable with minimal interpretation variance.

## Scope

Applies to every authored document under docs/legacy except CHANGELOG.md, which follows release-log formatting.

## Responsibilities

- Document Owner
  - Use approved template and complete required metadata.
- Domain Custodian
  - Ensure structural compliance before content approval.
- Editorial Steward
  - Verify final formatting and publishing readiness.

## Process

1. Assign a Document ID using DOCUMENT-ID-STANDARD.
2. Start from a template in docs/legacy/templates.
3. Include a metadata block at the top with:
- Document ID
- Title
- Domain
- Owner
- Reviewers
- Version
- Status
- Effective Date
- Last Reviewed

4. Use mandatory section flow:
- Purpose
- Scope
- Definitions (if needed)
- Policy or Procedure Body
- Controls and Exceptions
- Review and Revision History

5. Ensure internal links point to relative repository paths.
6. Submit for review under REVIEW-WORKFLOW.

## Examples

- Policy document structure:
  - Metadata block
  - Purpose and Scope
  - Policy statements
  - Control checkpoints
  - Exception handling
  - Revision history

- Decision document structure:
  - Metadata block
  - Decision context
  - Decision statement
  - Alternatives considered
  - Consequences
  - Follow-up actions

## Future Evolution

The standard will expand to include:
- Machine-readable metadata headers for automated indexing
- Structured glossary tags for dictionary alignment
- Mandatory cross-reference maps for policy dependencies
