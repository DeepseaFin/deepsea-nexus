import type { BusinessContext } from "@/lib/workflows/WorkflowContext";
import type { RuntimeAuthContext } from "@/lib/supabase/runtimeAuth";
import type { InstitutionContext } from "@/lib/workspaces/InstitutionContext";
import type { InstitutionContextSummary } from "@/lib/workspaces/InstitutionContextSummary";
import type {
  InstitutionAiAdvisorState,
  InstitutionDecisionItem,
  InstitutionDocumentItem,
  InstitutionHealthState,
  InstitutionKnowledgeEdge,
  InstitutionKnowledgeGraphState,
  InstitutionKnowledgeNode,
  InstitutionTimelineItem,
  InstitutionWorkspaceState,
} from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

function ensureText(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function toReviewedAt(input: {
  readonly institutionContext: InstitutionContext;
  readonly runtime: RuntimeAuthContext;
}): string {
  return (
    input.institutionContext.workflowStatus.lastUpdatedAt
    ?? input.institutionContext.assembledAt
    ?? input.runtime.session.snapshot.metadata.lastRefreshedAt
    ?? input.runtime.session.snapshot.metadata.issuedAt
    ?? new Date().toISOString()
  );
}

function buildHealthState(input: {
  readonly institutionContext: InstitutionContext;
  readonly runtime: RuntimeAuthContext;
}): InstitutionHealthState {
  const workflowStatus = input.institutionContext.workflowStatus;
  const permissionsCount = input.runtime.permissions.granted.length;
  const identityCount = input.runtime.identity.identity.roles.length + input.runtime.identity.identity.memberships.length;
  const score = Math.min(100, Math.max(40, 50 + permissionsCount * 6 + identityCount * 4 + workflowStatus.completedStepCount * 5));
  const status: InstitutionHealthState["status"] = score >= 80 ? "strong" : score >= 60 ? "watch" : "critical";

  return {
    score,
    status,
    reviewedAt: toReviewedAt(input),
    metrics: [
      {
        id: "HM-live-session",
        label: "Session Status",
        value: input.runtime.session.snapshot.status,
        trend: input.runtime.session.isAuthenticated ? "Authenticated runtime session" : "Anonymous runtime session",
        status: input.runtime.session.isAuthenticated ? "strong" : "watch",
      },
      {
        id: "HM-live-identity",
        label: "Identity Coverage",
        value: `${input.runtime.identity.identity.roles.length + input.runtime.identity.identity.memberships.length}`,
        trend: "Resolved from runtime identity",
        status: input.runtime.identity.identity.status === "identified" ? "strong" : "watch",
      },
      {
        id: "HM-live-permissions",
        label: "Permissions",
        value: `${permissionsCount}`,
        trend: "Canonical permission set",
        status: permissionsCount > 0 ? "strong" : "watch",
      },
      {
        id: "HM-live-workflow",
        label: "Workflow Progress",
        value: workflowStatus.workflowId ?? "runtime",
        trend: workflowStatus.lastUpdatedAt ?? "Live workflow context",
        status: workflowStatus.completedStepCount > 0 ? "strong" : "watch",
      },
    ],
  };
}

function buildDocuments(input: {
  readonly institutionContext: InstitutionContext;
  readonly businessContext?: BusinessContext;
  readonly summary: InstitutionContextSummary;
}): readonly InstitutionDocumentItem[] {
  const reviewedAt = input.summary.assembledAt;

  return [
    {
      id: `DOC-${input.summary.contextId}-context`,
      title: "Institution Context",
      classification: "Runtime Context",
      status: "active",
      version: input.institutionContext.workflowStatus.workflowId ?? "live",
      reviewedAt,
    },
    {
      id: `DOC-${input.summary.contextId}-passport`,
      title: "Business Passport",
      classification: "Live Passport",
      status: input.institutionContext.passport ? "active" : "superseded",
      version: input.institutionContext.passport?.metadata.version.modelVersion ?? input.institutionContext.passport?.metadata.version.schemaVersion ?? "unavailable",
      reviewedAt,
    },
    {
      id: `DOC-${input.summary.contextId}-journey`,
      title: "Journey",
      classification: "Live Workflow",
      status: input.institutionContext.journey ? "active" : "draft",
      version: input.institutionContext.journey?.journeyId ?? input.summary.contextId,
      reviewedAt,
    },
    {
      id: `DOC-${input.summary.contextId}-runtime`,
      title: "Workflow Context",
      classification: "Runtime Repository",
      status: input.businessContext ? "active" : "draft",
      version: input.businessContext?.workflowId ?? "runtime",
      reviewedAt,
    },
    {
      id: `DOC-${input.summary.contextId}-auth`,
      title: "Identity & Permissions",
      classification: "Supabase Runtime",
      status: "active",
      version: input.summary.institutionId,
      reviewedAt,
    },
  ];
}

function buildDecisionFeed(input: {
  readonly institutionContext: InstitutionContext;
  readonly runtime: RuntimeAuthContext;
}): readonly InstitutionDecisionItem[] {
  const reviewedAt = toReviewedAt(input);
  const workflowStatus = input.institutionContext.workflowStatus;

  return [
    {
      id: `DEC-${input.institutionContext.contextId}-auth`,
      title: input.runtime.session.isAuthenticated ? "Runtime session authenticated" : "Anonymous runtime session",
      outcome: input.runtime.session.snapshot.status,
      owner: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.identityId,
      decidedAt: reviewedAt,
    },
    {
      id: `DEC-${input.institutionContext.contextId}-workflow`,
      title: `Workflow ${workflowStatus.runState ?? "unknown"}`,
      outcome: workflowStatus.currentStep ?? "unknown",
      owner: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.identityId,
      decidedAt: workflowStatus.lastUpdatedAt ?? reviewedAt,
    },
    {
      id: `DEC-${input.institutionContext.contextId}-permissions`,
      title: "Permissions resolved",
      outcome: `${input.runtime.permissions.granted.length} granted`,
      owner: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.identityId,
      decidedAt: reviewedAt,
    },
  ];
}

function buildKnowledgeGraph(input: {
  readonly institutionContext: InstitutionContext;
  readonly runtime: RuntimeAuthContext;
  readonly businessContext?: BusinessContext;
}): InstitutionKnowledgeGraphState {
  const nodes: InstitutionKnowledgeNode[] = [
    { id: "node-authentication", label: "Authentication", type: "Runtime Auth" },
    { id: "node-identity", label: ensureText(input.runtime.identity.identity.displayName, input.runtime.identity.identity.identityId), type: "Identity" },
    { id: "node-permissions", label: "Permissions", type: "Runtime Access" },
    { id: "node-context", label: "Institution Context", type: "Runtime Aggregate" },
    { id: "node-institution", label: input.institutionContext.institution.identity.legalName, type: "Institution" },
  ];

  if (input.institutionContext.passport) {
    nodes.push({ id: "node-passport", label: input.institutionContext.passport.passportId.toString(), type: "Business Passport" });
  }

  if (input.institutionContext.journey) {
    nodes.push({ id: "node-journey", label: input.institutionContext.journey.journeyId, type: "Journey" });
  }

  if (input.businessContext) {
    nodes.push({ id: "node-workflow", label: input.businessContext.workflowId, type: "Workflow Context" });
  }

  const edges: InstitutionKnowledgeEdge[] = [
    { sourceId: "node-authentication", targetId: "node-identity", relation: "resolves" },
    { sourceId: "node-identity", targetId: "node-permissions", relation: "grants" },
    { sourceId: "node-context", targetId: "node-institution", relation: "describes" },
  ];

  if (input.institutionContext.passport) {
    edges.push({ sourceId: "node-context", targetId: "node-passport", relation: "contains" });
  }

  if (input.institutionContext.journey) {
    edges.push({ sourceId: "node-context", targetId: "node-journey", relation: "tracks" });
  }

  if (input.businessContext) {
    edges.push({ sourceId: "node-context", targetId: "node-workflow", relation: "persists" });
  }

  return {
    nodes,
    edges,
  };
}

function buildTimeline(input: {
  readonly institutionContext: InstitutionContext;
  readonly runtime: RuntimeAuthContext;
  readonly businessContext?: BusinessContext;
  readonly summary: InstitutionContextSummary;
}): readonly InstitutionTimelineItem[] {
  const reviewedAt = input.summary.assembledAt;
  const timeline: InstitutionTimelineItem[] = [
    {
      id: `TL-${input.summary.contextId}-auth`,
      timestamp: reviewedAt,
      title: "Runtime authentication resolved",
      actor: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.identityId,
      detail: `${input.runtime.identity.identity.roles.length} roles and ${input.runtime.identity.identity.memberships.length} memberships are active.`,
    },
    {
      id: `TL-${input.summary.contextId}-context`,
      timestamp: input.institutionContext.workflowStatus.lastUpdatedAt ?? reviewedAt,
      title: "Institution context assembled",
      actor: input.institutionContext.institution.identity.legalName,
      detail: `Workflow ${input.institutionContext.workflowStatus.workflowId ?? "runtime"} is bound to the live workspace.`,
    },
  ];

  if (input.businessContext) {
    timeline.push({
      id: `TL-${input.summary.contextId}-workflow`,
      timestamp: input.institutionContext.workflowStatus.lastUpdatedAt ?? reviewedAt,
      title: "Workflow repository context selected",
      actor: input.businessContext.currentOwner,
      detail: `Opportunity ${input.businessContext.opportunityId} is active in ${input.businessContext.currentWorkspace}.`,
    });
  }

  return timeline;
}

function buildAdvisor(input: {
  readonly institutionContext: InstitutionContext;
  readonly runtime: RuntimeAuthContext;
  readonly summary: InstitutionContextSummary;
}): InstitutionAiAdvisorState {
  const workflowStatus = input.institutionContext.workflowStatus;
  const authenticationLabel = input.runtime.session.isAuthenticated ? "authenticated" : "anonymous";

  return {
    summary: `Live ${authenticationLabel} runtime view for ${input.summary.institutionName} with ${workflowStatus.completedStepCount} completed workflow steps.`,
    recommendations: [
      `Keep ${input.runtime.permissions.granted.length} resolved permissions aligned with the Institution workspace.`,
      `Maintain the live workflow context for ${workflowStatus.workflowId ?? "the current runtime"}.`,
      input.institutionContext.passport
        ? "Use the current Business Passport as the canonical institution reference."
        : "Attach a Business Passport to complete the runtime institution view.",
    ],
    alerts: [
      input.runtime.session.isExpired ? "Runtime session is expired and should be refreshed." : "Runtime session is active.",
      input.runtime.identity.identity.memberships.length === 0
        ? "No workspace memberships were resolved from the current identity."
        : `Resolved ${input.runtime.identity.identity.memberships.length} workspace memberships from identity.`,
    ],
  };
}

export function createInstitutionWorkspaceState(input: {
  readonly runtime: RuntimeAuthContext;
  readonly institutionContext: InstitutionContext;
  readonly summary: InstitutionContextSummary;
  readonly businessContext?: BusinessContext;
}): InstitutionWorkspaceState {
  const health = buildHealthState({
    institutionContext: input.institutionContext,
    runtime: input.runtime,
  });

  return {
    institutionId: input.summary.institutionId,
    institutionName: input.summary.institutionName,
    classification: ensureText(input.institutionContext.institution.profile.legalForm, input.institutionContext.institution.identity.institutionType),
    status: input.institutionContext.institution.status,
    version: input.institutionContext.passport?.metadata.version.modelVersion ?? input.summary.workflowProgress,
    reviewedAt: input.summary.assembledAt,
    navigation: [
      { key: "dashboard", label: "Dashboard" },
      { key: "timeline", label: "Timeline" },
      { key: "health", label: "Health" },
      { key: "documents", label: "Documents" },
      { key: "decisions", label: "Decision Feed" },
      { key: "knowledge", label: "Knowledge Graph" },
      { key: "advisor", label: "AI Advisor" },
    ],
    kpis: [
      {
        label: "Identity Signals",
        value: `${input.runtime.identity.identity.roles.length + input.runtime.identity.identity.memberships.length}`,
        note: "Resolved from the live auth identity",
      },
      {
        label: "Workflow Contexts",
        value: `${input.runtime.permissions.granted.length}`,
        note: "Permissions active in the current session",
      },
      {
        label: "Workflow Progress",
        value: input.summary.workflowProgress,
        note: "Live repository and runtime status",
      },
      {
        label: "Runtime Health",
        value: `${health.score}`,
        note: "Derived from the current live runtime state",
      },
    ],
    timeline: buildTimeline({
      institutionContext: input.institutionContext,
      runtime: input.runtime,
      businessContext: input.businessContext,
      summary: input.summary,
    }),
    health,
    documents: buildDocuments({
      institutionContext: input.institutionContext,
      businessContext: input.businessContext,
      summary: input.summary,
    }),
    decisionFeed: buildDecisionFeed({
      institutionContext: input.institutionContext,
      runtime: input.runtime,
    }),
    knowledgeGraph: buildKnowledgeGraph({
      institutionContext: input.institutionContext,
      runtime: input.runtime,
      businessContext: input.businessContext,
    }),
    aiAdvisor: buildAdvisor({
      institutionContext: input.institutionContext,
      runtime: input.runtime,
      summary: input.summary,
    }),
  };
}