# Release 1 Scope

## Purpose

This document defines the in-scope and out-of-scope boundaries for DNOS Release 1 and the formal R1-M5 pilot-gate baseline required before Release-1 implementation proceeds toward a controlled client pilot.

This document is the governance reference for scope control across engineering, product, and operations. It is not a claim that the system is already pilot-ready or production-ready.

## Governance Basis

This scope statement is aligned with the repository's governing records:

- [docs/00-Governance/R1-M4-Engineering-Closure-Record.md](../00-Governance/R1-M4-Engineering-Closure-Record.md) states that R1-M4 is closed and that R1-M5 objective and scope must be established through a separate roadmap/design exercise before implementation begins.
- [docs/release/DNOS-Version-1.0-Release-Board.md](../release/DNOS-Version-1.0-Release-Board.md) remains the active release-control document and currently records a CONDITIONAL GO status with a NO-GO gate pending P0 closure.
- This document intentionally does not redefine or create S2-E. S2-E remains outside the approved M5 scope definition.

## R1-M5 Title

R1-M5: Release-1 Client Pilot Critical Path and Gate Closure

## Target State

TARGET: CLIENT PILOT READY

NOT TARGET: PRODUCTION READY

This milestone is intentionally defined as the minimum release-critical gate required to establish a controlled client pilot, not a production launch gate.

## Canonical Release-1 Journey

Business Passport
→ Opportunity
→ Commercial / Forfaiting / Treasury
→ Executive

This is the canonical Release-1 journey for scope control and validation. Other domain surfaces may exist but are out of scope for the immediate pilot gate unless they directly affect the defined journey path.

## Release-1 Capability Baseline

The current repository already contains implementation evidence for the following domains:

- Business Passport
- Opportunity
- Commercial
- Forfaiting
- Treasury
- Executive
- Relationship Intelligence
- Evidence
- Knowledge / ORACLE
- Workflow Context
- InstitutionRuntimeComposition
- Supabase workflow persistence foundation

This document defines the minimum pilot gate for these capabilities, not a full production operating model.

## Definition of Readiness Levels

### ENGINEERING COMPLETE

A capability is engineering complete when the architecture, route boundaries, domain contracts, and implementation path are in place and are expected to operate under controlled conditions.

### CLIENT DEMO READY

A capability is client demo ready when the user journey can be shown under controlled data and operational assumptions without assuming a production-grade operating model.

### CLIENT PILOT READY

A capability is client pilot ready when the following mandatory gates are satisfied for the canonical journey under the defined pilot boundary:

- Security
- Persistence
- Journey continuity
- Data integrity
- Navigation
- Error handling
- Operational readiness
- Performance baseline
- Support ownership
- Governance sign-off

### PRODUCTION READY

A capability is production ready only when the active release governance gates are closed and the release board conditions are met. This is outside the immediate target of R1-M5.

## Mandatory Client Pilot Gates

The following are mandatory gates for Release-1 client pilot readiness:

### Security
- authenticated access to protected surfaces
- server-side mutation protection
- route-level protection for institutional and workflow actions
- explicit behavior for unauthorized access

### Persistence
- workflow context save semantics are defined
- workflow reconstruction and restore semantics are defined
- state survives route transitions and refreshes within the pilot boundary

### Journey continuity
- Business Passport, Opportunity, Commercial / Forfaiting / Treasury, and Executive remain connected by a coherent workflow identity and context

### Data integrity
- workflow state is consistent across navigation and resume
- no silent state loss in the canonical journey
- invalid transitions are explicitly handled

### Navigation
- the canonical journey is valid and consistent across route transitions
- downstream screens reconstruct the appropriate workflow state

### Error handling
- save failures, missing state, unauthorized access, and invalid transitions are handled explicitly

### Operational readiness
- support ownership, runbook, rollback, and escalation are defined for the pilot boundary

### Performance baseline
- critical route performance is measured and documented for the pilot scope

### Support ownership
- a named accountable owner exists for the pilot environment and incident handling

### Governance sign-off
- the pilot boundary, evidence set, and risk posture are reviewed and recorded by the governing release authority

## MUST HAVE BEFORE PILOT

The following are required before Release-1 client pilot approval:

- explicit pilot scope and boundary
- explicit canonical journey definition
- clear entry and exit criteria
- P0 security, persistence and operational requirements mapped to the pilot path
- evidence required for each critical-path stage defined
- route protection and mutation controls defined and validated
- workflow persistence/resume behavior proven for the pilot path
- critical operational runbooks and ownership defined
- governance sign-off recorded

## POST-PILOT HARDENING

The following may remain deferred after the initial pilot if they are explicitly accepted as post-pilot items:

- broader observability and telemetry expansion
- full load and soak testing
- security drill pack beyond the pilot minimum
- deeper workflow event and timeline persistence
- broader ORACLE / Knowledge / Evidence intelligence maturity
- advanced cross-domain optimization and operational SLO enforcement

## Critical Path

The approved Release-1 critical path is:

- CP-01 — Release-1 scope, pilot boundary and acceptance gate
- CP-02 — Authentication, authorization and executable route protection
- CP-03 — Durable workflow persistence and recovery/resume
- CP-04 — End-to-end journey certification
- CP-05 — Operational readiness

### CP-01 — Release-1 scope, pilot boundary and acceptance gate
Objective: define the exact pilot boundary and what must be proven before pilot approval.

### CP-02 — Authentication, authorization and executable route protection
Objective: establish the minimum protection layer for route access and institutional workflow mutation.

### CP-03 — Durable workflow persistence and recovery/resume
Objective: confirm that the workflow context survives route transitions and recoverable resume conditions within the pilot path.

### CP-04 — End-to-end journey certification
Objective: validate that the canonical journey operates end-to-end under controlled pilot conditions.

### CP-05 — Operational readiness
Objective: ensure environment, runbook, rollback, performance, and support controls are in place for a controlled pilot.

## M5 Sprint Stages

The approved five-stage implementation sequence is:

- M5-S1 — Pilot Gate Definition and Evidence Baseline
- M5-S2 — Auth + Route Protection
- M5-S3 — Workflow Persistence and Resume
- M5-S4 — Pilot Journey Certification
- M5-S5 — Operational Pilot Readiness

## CP-01 Acceptance Gate

M5-S1 is complete only when all of the following are true:

1. Pilot scope is explicit.
2. Canonical journey is explicit.
3. Pilot entry criteria are explicit.
4. Pilot exit criteria are explicit.
5. P0 security, persistence, and operational requirements are identified.
6. Out-of-scope items are explicitly listed.
7. Evidence required for each CP stage is defined.
8. Ownership and dependency structure are explicit.
9. R1-M5 is clearly distinguished from production readiness.
10. The document does not claim the system is already pilot-ready.

## Out of Scope for Immediate M5 Pilot Gate

The following are intentionally out of scope for the immediate M5 pilot-gate target unless directly required by the canonical pilot journey:

- production launch sign-off
- uncontrolled production deployment
- broad enterprise IAM expansion beyond the minimum route protection gate
- comprehensive post-launch operational hardening
- non-pilot business workflow coverage beyond the defined path
- broad ORACLE / Knowledge / Evidence maturity beyond the pilot-required state
- any design change that redefines the architecture beyond the accepted boundary

## Client Commitment Status

- Client demo: CONDITIONAL
- Controlled pilot: CONDITIONAL
- Production: NO

The client commitment status is intentionally conservative and aligned with the repository release board and the R1-M4 closure record.

## S2-E Status

No S2-E created. This governance document defines only the Release-1 pilot gate and M5 scope. S2-E remains outside the approved scope definition and is not created within this release gate.

## Governance Discipline

- This document is the authoritative Release-1 scope definition for the current M5 pilot gate.
- It does not redefine existing S2-A through S2-D milestones or create new S2 scope labels.
- It does not claim the system is already pilot-ready.
- It does not claim the system is production-ready.
- It is intentionally limited to the minimum release-critical gate required for a controlled client pilot.

## Summary

This design closes the governance gap required by R1-M4 and aligns the milestone sequence to a controlled client-pilot gate. It establishes the minimum Release-1 pilot boundary, the critical path, the required evidence, and the operational distinction between client-pilot readiness and production readiness.
