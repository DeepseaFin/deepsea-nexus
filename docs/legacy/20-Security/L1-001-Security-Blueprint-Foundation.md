# L1-001 - Security Blueprint Foundation

## Metadata

- Document ID: L1-001
- Title: Security Blueprint Foundation
- Domain: Security
- Type: Design Blueprint
- Version: 1.0.0
- Status: Draft for Approval
- Owner: DNOS Architecture
- Reviewers: Security Custodian; Platform Custodian; Workflow Custodian
- Effective Date: Pending approval
- Last Reviewed: 2026-07-15
- Scope: Deepsea Nexus Version 1.0 security foundation design

## Purpose

Define the security design foundation for Deepsea Nexus Version 1.0, aligned to existing architecture and workflow infrastructure, without implementing authentication or authorization in this sprint.

## Non-Goals

- No authentication implementation
- No authorization implementation
- No login pages
- No Supabase Auth integration
- No APIs
- No UI changes
- No persistence or database changes

## Reuse Baseline

This blueprint reuses current system boundaries and artifacts:

- Workspace routes under app and capability surfaces under src/capabilities
- Workflow lifecycle and audit contracts in lib/workflows
- Business context propagation through existing BusinessContext model
- Existing in-memory repository patterns for workflow context
- Existing timeline and event models for audit visibility

## 1. Identity Model

Identity in v1.0 is modeled as a design contract (not implemented) with three layers:

1. Principal Identity
- principalId: globally unique actor key
- principalType: human_user | service_account | system_actor
- tenantId: institutional boundary key

2. Session Identity
- sessionId: ephemeral runtime key
- principalId: owner of session
- authenticationLevel: unauthenticated | authenticated | elevated
- assuranceLevel: aal1 | aal2 | aal3 (future)

3. Workspace Identity Context
- workspaceId: target workspace surface
- ownershipScope: institution | opportunity | receivable | platform
- delegatedBy: optional delegation principal

Identity relationships:

- One principal can hold multiple concurrent sessions.
- A session carries one active tenant context.
- Workspace operations are evaluated against session + workspace ownership.

## 2. User Roles

Baseline role catalog for v1.0 security design:

- role.platform_admin
- role.security_admin
- role.relationship_manager
- role.executive_reviewer
- role.treasury_operator
- role.forfaiting_operator
- role.operations_analyst
- role.read_only_auditor
- role.system_service

Role intent:

- Platform and security admins manage configuration and governance scope.
- Workspace roles operate inside business domain ownership boundaries.
- Auditor role is read-only across approved observability surfaces.
- System service role is non-human, least-privilege, non-interactive.

## 3. Permission Matrix

Permission keys follow capability and action boundaries, decoupled from UI routes.

### Matrix Legend

- A: Allowed
- C: Conditional (ownership, state, or policy checks)
- D: Denied

| Permission | platform_admin | security_admin | relationship_manager | executive_reviewer | treasury_operator | forfaiting_operator | operations_analyst | read_only_auditor | system_service |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| perm.workflow.context.read | A | A | C | C | C | C | A | A | C |
| perm.workflow.context.write | A | C | C | C | C | C | C | D | C |
| perm.workflow.lifecycle.transition.forward | A | C | C | C | C | C | C | D | C |
| perm.workflow.lifecycle.transition.reverse | A | C | C | C | C | C | C | D | C |
| perm.workflow.audit.read | A | A | C | C | C | C | A | A | C |
| perm.workflow.audit.export | A | C | D | D | D | D | C | C | D |
| perm.workspace.commercial.access | A | C | A | C | D | D | C | C | D |
| perm.workspace.executive.access | A | C | C | A | D | D | C | C | D |
| perm.workspace.treasury.access | A | C | D | C | A | D | C | C | D |
| perm.workspace.forfaiting.access | A | C | D | C | C | A | C | C | D |
| perm.policy.security.manage | C | A | D | D | D | D | D | D | D |

Conditional checks include:

- Ownership verification
- Lifecycle stage compatibility
- Assignment to current workspace owner
- Delegation constraints
- Break-glass policy approval (future)

## 4. Route Protection Strategy

Route protection is defined as a layered strategy over existing app routing.

1. Route Classification
- Public: non-sensitive informational routes
- Protected: workspace routes requiring authenticated principal
- Privileged: sensitive operations requiring role + ownership + policy checks

2. Guard Layers
- Layer 1: Authentication gate (session presence and validity)
- Layer 2: Workspace access gate (role-to-workspace permission)
- Layer 3: Ownership gate (institution/opportunity/receivable scope)
- Layer 4: Action gate (specific permission and policy decision)

3. Denial Outcomes
- Route-level deny: redirect to neutral landing or authorized default workspace
- Action-level deny: deny command, preserve page context, emit audit event

No route guard is implemented in this sprint; this section defines future guard behavior only.

## 5. Action Authorization Strategy

Authorization is action-centric and independent from UI control visibility.

Policy decision contract (design):

- Input: principal, session, role set, permission, resource scope, context attributes
- Output: allow | deny | conditional_deny with reason code

Decision principles:

- Default deny
- Explicit allow through permission grants
- Ownership-aware checks for business resources
- Lifecycle-aware checks for transition actions
- Full decision traceability through audit events

## 6. Session Lifecycle

Session design states:

- issued
- active
- idle
- refreshed
- expired
- revoked

Lifecycle rules:

- Session issuance requires successful authentication outcome.
- Idle timeout transitions active to expired after inactivity threshold.
- Absolute timeout expires sessions regardless of activity.
- Refresh rotates session tokens and invalidates superseded credentials.
- Security events (credential risk, admin revocation) force revoke.

Session attributes (design contract):

- sessionId
- principalId
- tenantId
- issuedAt
- lastActivityAt
- expiresAt
- revokedAt
- revokeReason

## 7. Authentication Flow

Design-only flow, no implementation in v1.0 sprint:

1. Principal submits credentials to identity provider boundary.
2. Provider validates identity factors.
3. Provider returns authentication result with assurance metadata.
4. Session service issues session identity context.
5. Route protection consumes session context for protected navigation.
6. Audit event records authentication outcome.

Authentication outcome types:

- auth.success
- auth.failure.invalid_credentials
- auth.failure.account_locked
- auth.failure.provider_unavailable
- auth.challenge.required (future)

## 8. Authorization Flow

Design-only authorization sequence:

1. Caller requests action on resource.
2. Authorization middleware resolves principal and session context.
3. Permission resolver maps requested action to permission key.
4. Policy evaluator checks grants, ownership, and contextual constraints.
5. Decision returned: allow or deny.
6. Denied decisions carry machine-readable reason code.
7. Security audit event emitted for decision traceability.

Reason code examples:

- authz.deny.permission_missing
- authz.deny.ownership_mismatch
- authz.deny.lifecycle_invalid
- authz.deny.policy_restricted

## 9. Security Audit Events

Security blueprint mandates immutable, append-only security events (design requirement).

Required event categories:

- Authentication events
- Authorization decision events
- Session lifecycle events
- Privilege or role change events
- Sensitive action events

Minimum event schema:

- eventId
- occurredAt
- actorId
- actorType
- sessionId
- tenantId
- action
- resourceType
- resourceId
- decision
- reasonCode
- correlationId
- metadata (immutable map)

Event naming convention:

- sec.auth.success
- sec.auth.failure
- sec.session.issued
- sec.session.expired
- sec.session.revoked
- sec.authz.allow
- sec.authz.deny
- sec.role.assigned
- sec.role.revoked

## 10. Future Integration with Supabase Auth

Supabase Auth integration is explicitly deferred, but this blueprint prepares for it.

Future adapter strategy:

- Keep internal identity and authorization contracts stable.
- Implement provider adapters behind identity boundary.
- Map Supabase user and session artifacts into DNOS session model.
- Preserve permission and policy evaluation inside DNOS domain.
- Use Supabase for authentication mechanics, not authorization business logic.

Planned mapping examples:

- Supabase user id -> principalId
- Supabase session id -> sessionId
- Supabase claims -> role hint inputs (not final policy decision)

Migration principles:

- Zero change to permission key namespace
- Zero change to workflow lifecycle authorization contracts
- Backward-compatible audit schema

## Permission Naming Conventions

Permissions follow a stable, namespaced convention:

- Format: perm.<domain>.<resource>.<action>
- Domain examples: workflow, workspace, policy, security
- Action verbs: read, write, transition, approve, manage, export

Examples:

- perm.workflow.lifecycle.transition.forward
- perm.workflow.lifecycle.transition.reverse
- perm.workspace.executive.access
- perm.security.audit.export

Naming rules:

- Lowercase only
- Dot-delimited tokens
- No UI-specific terms
- No provider-specific terms
- Action-focused, resource-scoped

## Workspace Ownership Model

Ownership is required for conditional permissions in business workspaces.

Ownership scopes:

- Institution scope: institution owner or assigned delegates
- Opportunity scope: current opportunity owner and assigned desk
- Receivable scope: assigned treasury/forfaiting operator
- Platform scope: platform or security admins

Ownership resolution priority:

1. Explicit resource owner
2. Active workflow owner
3. Workspace delegated owner
4. Platform override role (policy constrained)

Ownership constraints:

- Cross-workspace actions require compatible ownership mapping.
- Reverse lifecycle transitions require valid ownership on current state.
- Ownership changes must emit security audit events.

## Approval Criteria for This Blueprint

This blueprint is considered approved when:

- Security custodian signs off on identity, role, and permission model.
- Platform custodian confirms compatibility with existing architecture.
- Workflow custodian confirms lifecycle and ownership alignment.
- Future Supabase integration strategy is accepted as non-breaking.

## Revision History

| Version | Date | Change Type | Summary | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| 1.0.0 | 2026-07-15 | Initial | Design sprint blueprint for Deepsea Nexus v1.0 security foundation. | DNOS Architecture | Draft for Approval |
