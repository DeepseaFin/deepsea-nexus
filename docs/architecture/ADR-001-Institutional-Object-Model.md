# ADR-001: Institutional Object Model

## Status
Accepted

## Date
2026-07-10

## Context
Deepsea Nexus Operating System (DNOS) is an institutional platform intended to coordinate decisioning, risk, treasury execution, and document intelligence across a shared operating model. Traditional software patterns that center around disconnected files, tables, or feature-local records create fragmentation, weak traceability, and inconsistent decision context.

DNOS requires a durable abstraction that is:

- Domain-centered rather than storage-centered.
- Capable of carrying structured and unstructured evidence.
- Explicit about lifecycle, accountability, and decision history.
- Enrichable by multiple engines without duplicating ownership.

For this reason, DNOS adopts Institutional Objects as the primary architectural unit.

## Decision
DNOS manages Institutional Objects rather than files or records.

An Institutional Object is the canonical, governable representation of a business-relevant unit in the system (for example: counterparty, facility, obligation, collateral position, covenant artifact, or workflow case). Files, rows, and events are supporting evidence or projections of that object, not the object itself.

## Institutional Object Lifecycle
Every Institutional Object follows this lifecycle:

1. Identity
2. Facts
3. Relationships
4. State
5. Actions
6. History

### 1. Identity
Identity establishes the object as a distinct institutional subject.

- Stable unique identifiers.
- Object class and ownership domain.
- Jurisdictional and governance anchors.

### 2. Facts
Facts represent the validated attributes and evidence-backed assertions attached to the object.

- Structured attributes (dates, amounts, limits, ratings, statuses).
- Unstructured evidence references (documents, extracted fields, annotations).
- Provenance metadata indicating source and confidence.

### 3. Relationships
Relationships define how an object is connected to other objects.

- Counterparty-to-facility, facility-to-collateral, policy-to-obligation links.
- Direction, role, and temporal validity of each relationship.
- Graph-level consistency required for institutional reasoning.

### 4. State
State captures the current lifecycle and operational posture of the object.

- Processing and workflow stage.
- Risk or control posture.
- Readiness for downstream actions.

### 5. Actions
Actions are permitted transitions or operations that can be executed on the object.

- Human actions (review, approve, escalate, reconcile).
- System actions (route, classify, optimize, notify).
- Policy-aware authorization and guardrails.

### 6. History
History is the immutable timeline of object changes and decisions.

- Who changed what, when, and why.
- Prior states and transition rationale.
- Audit-grade traceability across the full lifecycle.

## Engine Responsibilities
The Institutional Object Model is executed by specialized engines with clear responsibilities.

### ORACLE: Knowledge Engine
ORACLE is responsible for understanding documents and converting document evidence into object-level knowledge.

- Ingests and normalizes document evidence.
- Extracts facts and semantic signals.
- Contributes provenance-aware enrichments to Institutional Objects.

### SENTINEL: Risk Engine
SENTINEL is responsible for risk computation and policy-aware control interpretation.

- Evaluates object facts and relationships against risk rules.
- Produces risk posture, alerts, and control outcomes.
- Writes risk-relevant state and recommendations to Institutional Objects.

### HELIOS: Treasury Optimization Engine
HELIOS is responsible for treasury optimization and liquidity-aware execution strategy.

- Uses object state, obligations, and constraints to optimize treasury decisions.
- Models execution pathways under policy and market constraints.
- Publishes optimization outputs as actionable object transitions.

### ATLAS Core: Workflow and Coordination Engine
ATLAS Core is responsible for workflow orchestration and cross-engine coordination.

- Coordinates lifecycle transitions across engines and users.
- Maintains consistent process state and handoffs.
- Ensures actions and approvals are synchronized with object history.

## AI Positioning: Enrichment Over Standalone Chat
AI services in DNOS must enrich Institutional Objects rather than operate as standalone chat interfaces.

Rationale:

- Institutional continuity: object-centric enrichments persist as governed system knowledge, while chat-only outputs are ephemeral.
- Traceability: enrichments can be tied to provenance, confidence, and audit history.
- Deterministic operations: workflows and controls require structured, stateful artifacts, not free-form conversational outcomes.
- Multi-engine interoperability: ORACLE, SENTINEL, HELIOS, and ATLAS Core depend on shared object semantics.
- Compliance readiness: supervised, object-linked updates support explainability and regulatory review.

Therefore, AI is treated as an enrichment capability integrated into lifecycle stages (Facts, Relationships, State, Actions), not as an independent interaction surface for institutional decision execution.

## Consequences
Positive outcomes:

- Unified institutional context across products and teams.
- Improved explainability for decisions and transitions.
- Stronger composability of document intelligence, risk logic, and treasury optimization.
- Durable audit trail aligned to business semantics.

Trade-offs:

- Requires disciplined object ownership and schema governance.
- Demands explicit lifecycle management and versioning.
- Increases upfront architectural rigor compared to ad hoc feature data models.

## Implementation Guidance
- New capabilities should define their contributions to Institutional Objects before implementation.
- Engine outputs must be modeled as object enrichments or state transitions.
- File storage, database rows, and UI views should be treated as infrastructure projections of Institutional Objects, not competing sources of truth.

## Related Decisions
- Future ADRs should define object taxonomy, relationship ontologies, and governance controls for lifecycle transitions.
