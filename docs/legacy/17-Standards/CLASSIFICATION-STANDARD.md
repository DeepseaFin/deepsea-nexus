# Classification Standard

## Purpose

Define a deterministic classification model for legacy knowledge so each Knowledge Object is discoverable by domain, governance relevance, risk, and lifecycle intent.

## Scope

Applies to all Knowledge Objects derived from docs/legacy and to all retrieval filters used by DNOS knowledge services.

## Responsibilities

- Knowledge Architecture Owner
  - Maintain approved classification dimensions and controlled values.
- Domain Custodians
  - Validate domain-specific classification correctness.
- Reviewers
  - Reject documents with missing or inconsistent classification.

## Process

1. Required classification dimensions
- Domain Class
- Document Class
- Governance Criticality
- Operational Impact
- Confidentiality Level
- Lifecycle State

2. Domain Class values
- Charter
- Constitution
- Standards
- Engineering
- Operations
- Departments
- Academy
- Research
- AI Knowledge
- Institutional Memory

3. Document Class values
- Standard
- Policy
- Procedure
- Manual
- Decision Record
- Lesson
- Mistake Record
- Research Note
- Template
- Glossary Entry

4. Governance Criticality values
- Critical
- High
- Medium
- Baseline

5. Assignment policy
- Classification must be assigned at draft stage.
- Changes to criticality require custodian approval.
- Superseded documents retain historical classification.

## Examples

- DLR-CHTR-STD-0001
  - Domain Class: Charter
  - Document Class: Standard
  - Governance Criticality: Critical
  - Operational Impact: High

- DLR-RSRCH-TMP-0001
  - Domain Class: Research
  - Document Class: Template
  - Governance Criticality: Baseline
  - Operational Impact: Medium

## Future Evolution

- Add model-assisted classification with human override.
- Add conflict detection for inconsistent criticality assignments.
- Add domain-specific criticality matrices.
