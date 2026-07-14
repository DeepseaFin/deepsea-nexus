# Versioning Standard

## Purpose

Define deterministic versioning rules for legacy documents so change impact and document maturity can be understood instantly.

## Scope

Applies to all governed documents in docs/legacy and their corresponding registry entries.

## Responsibilities

- Document Owner
  - Propose version increment based on change magnitude.
- Domain Custodian
  - Validate version selection aligns with impact.
- Repository Custodian Council
  - Resolve disputes on major version transitions.

## Process

Use semantic versioning for documents: MAJOR.MINOR.PATCH.

1. MAJOR increment
- Breaking policy change
- Governance model shift
- Redefined accountability or authority

2. MINOR increment
- New section with operational effect
- New control, process step, or required evidence

3. PATCH increment
- Clarifications, wording precision, typo correction
- Non-behavioral formatting changes

4. Update sequence
- Increment version in document metadata
- Record change summary in CHANGELOG.md
- Update document-registry.md

## Examples

- 1.4.2 to 1.4.3
  - Corrected terminology and clarified reviewer role language.

- 1.4.3 to 1.5.0
  - Added quarterly audit checklist requirement.

- 1.5.0 to 2.0.0
  - Replaced single-custodian model with council-based approval authority.

## Future Evolution

Planned enhancements:
- Mandatory machine-validated impact category for version bumps
- Cross-document impact tracing for major releases
- Automated release notes generation from registry deltas
