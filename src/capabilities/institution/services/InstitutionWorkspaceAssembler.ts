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

function toEpoch(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function createTimelineItem(input: {
  readonly id: string;
  readonly timestamp: string | undefined;
  readonly title: string;
  readonly actor: string;
  readonly detail: string;
  readonly fallbackTimestamp: string;
}): InstitutionTimelineItem {
  return {
    id: input.id,
    timestamp: input.timestamp ?? input.fallbackTimestamp,
    title: input.title,
    actor: input.actor,
    detail: input.detail,
  };
}

function buildTimeline(input: {
  readonly institutionContext: InstitutionContext;
  readonly runtime: RuntimeAuthContext;
  readonly businessContext?: BusinessContext;
  readonly summary: InstitutionContextSummary;
}): readonly InstitutionTimelineItem[] {
  const reviewedAt = input.summary.assembledAt;
  const actor = input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.identityId;
  const timeline: InstitutionTimelineItem[] = [];
  const workflowStatus = input.institutionContext.workflowStatus;
  const passport = input.institutionContext.passport;
  const journey = input.institutionContext.journey;
  const health = input.institutionContext.health;
  const intelligence = input.institutionContext.intelligence;

  timeline.push(createTimelineItem({
    id: `TL-${input.summary.contextId}-auth`,
    timestamp: reviewedAt,
    title: "Runtime authentication resolved",
    actor,
    detail: `${input.runtime.identity.identity.roles.length} roles and ${input.runtime.identity.identity.memberships.length} memberships are active.`,
    fallbackTimestamp: reviewedAt,
  }));

  timeline.push(createTimelineItem({
    id: `TL-${input.summary.contextId}-workflow-execution`,
    timestamp: workflowStatus.lastUpdatedAt,
    title: `Workflow execution ${workflowStatus.runState ?? "resolved"}`,
    actor,
    detail: `Workflow ${workflowStatus.workflowId ?? "runtime"} at step ${workflowStatus.currentStep ?? "unknown"} with ${workflowStatus.completedStepCount} completed steps.`,
    fallbackTimestamp: reviewedAt,
  }));

  if (input.businessContext) {
    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-workflow-context`,
      timestamp: workflowStatus.lastUpdatedAt,
      title: "Workflow repository context selected",
      actor: input.businessContext.currentOwner,
      detail: `Opportunity ${input.businessContext.opportunityId} is active in ${input.businessContext.currentWorkspace} at lifecycle ${input.businessContext.opportunityLifecycle}.`,
      fallbackTimestamp: reviewedAt,
    }));
  }

  intelligence?.references.events.forEach((event) => {
    timeline.push(createTimelineItem({
      id: `TL-${event.metadata.eventId}`,
      timestamp: event.metadata.timestamp,
      title: `Institution event: ${event.type}`,
      actor: event.metadata.actor ?? event.metadata.source,
      detail: event.payload.reason
        ?? `Category ${event.category} updated ${event.payload.changedFields?.join(", ") ?? "institution state"}.`,
      fallbackTimestamp: reviewedAt,
    }));
  });

  journey?.timeline.forEach((event, index) => {
    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-journey-${index}`,
      timestamp: event.timestamp,
      title: `Journey: ${event.event}`,
      actor: event.performedBy,
      detail: event.notes,
      fallbackTimestamp: reviewedAt,
    }));
  });

  if (journey) {
    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-journey-status`,
      timestamp: journey.lastUpdated,
      title: `Journey ${journey.status}`,
      actor: journey.startedBy,
      detail: `${journey.completedSteps.length} steps completed at ${journey.completionPercentage}% progress.`,
      fallbackTimestamp: reviewedAt,
    }));
  }

  if (passport) {
    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-passport-created`,
      timestamp: passport.metadata.audit.createdAt,
      title: "Business Passport created",
      actor: passport.metadata.audit.createdBy,
      detail: `Passport ${passport.passportId.toString()} initialized with lifecycle ${passport.lifecycle}.`,
      fallbackTimestamp: reviewedAt,
    }));

    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-passport-updated`,
      timestamp: passport.metadata.audit.updatedAt,
      title: "Business Passport updated",
      actor: passport.metadata.audit.updatedBy,
      detail: `Status ${passport.status}, maturity ${passport.maturity.level}, confidence ${passport.confidence.score}.`,
      fallbackTimestamp: reviewedAt,
    }));

    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-passport-lineage`,
      timestamp: passport.metadata.lineage.ingestedAt,
      title: "Business Passport lineage refreshed",
      actor: "Business Passport",
      detail: `${passport.metadata.lineage.sourceSystems.length} source systems and ${passport.metadata.lineage.sourceReferences.length} source references ingested.`,
      fallbackTimestamp: reviewedAt,
    }));

    if (passport.profiles.timelineProfile.lastMaterialEventAt) {
      timeline.push(createTimelineItem({
        id: `TL-${input.summary.contextId}-passport-material-event`,
        timestamp: passport.profiles.timelineProfile.lastMaterialEventAt,
        title: "Business Passport material event",
        actor: "Business Passport",
        detail: `Lifecycle ${passport.profiles.timelineProfile.currentLifecycleStep ?? "active"} with next step ${passport.profiles.timelineProfile.nextLifecycleStep ?? "not set"}.`,
        fallbackTimestamp: reviewedAt,
      }));
    }

    const evidenceProfile = passport.profiles.evidenceProfile;

    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-evidence-coverage`,
      timestamp: passport.metadata.audit.updatedAt,
      title: "Evidence profile assessed",
      actor: "Evidence",
      detail: `Coverage ${evidenceProfile.evidenceCoverageScore ?? 0}; missing ${evidenceProfile.missingEvidenceItems?.length ?? 0}; stale ${evidenceProfile.staleEvidenceItems?.length ?? 0}.`,
      fallbackTimestamp: reviewedAt,
    }));

    evidenceProfile.missingEvidenceItems?.slice(0, 5).forEach((item, index) => {
      timeline.push(createTimelineItem({
        id: `TL-${input.summary.contextId}-evidence-missing-${index}`,
        timestamp: passport.metadata.audit.updatedAt,
        title: "Evidence gap detected",
        actor: "Evidence",
        detail: item,
        fallbackTimestamp: reviewedAt,
      }));
    });
  }

  const knowledgeFacts = intelligence?.references.knowledge?.facts ?? [];
  if (knowledgeFacts.length > 0) {
    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-knowledge-collected`,
      timestamp: knowledgeFacts[0]?.lastVerified ?? knowledgeFacts[0]?.effectiveDate,
      title: "Knowledge collection synchronized",
      actor: "Knowledge",
      detail: `${knowledgeFacts.length} knowledge facts connected to institutional memory.`,
      fallbackTimestamp: reviewedAt,
    }));

    knowledgeFacts.slice(0, 5).forEach((fact, index) => {
      timeline.push(createTimelineItem({
        id: `TL-${input.summary.contextId}-knowledge-fact-${index}`,
        timestamp: fact.lastVerified ?? fact.metadata.updatedAt ?? fact.metadata.createdAt ?? fact.effectiveDate,
        title: `Knowledge fact: ${fact.factName}`,
        actor: fact.metadata.createdBy,
        detail: `${fact.knowledgeType} from ${fact.source} at confidence ${fact.confidence}.`,
        fallbackTimestamp: reviewedAt,
      }));
    });
  }

  if (health) {
    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-health-assessment`,
      timestamp: health.assessedAt,
      title: "Institution health assessed",
      actor: "Institution Health",
      detail: `Overall ${health.overallStatus} (${health.overallScore}) with trend ${health.overallTrend.direction}.`,
      fallbackTimestamp: reviewedAt,
    }));

    health.indicators.slice(0, 5).forEach((indicator, index) => {
      timeline.push(createTimelineItem({
        id: `TL-${input.summary.contextId}-health-indicator-${index}`,
        timestamp: indicator.trend.observedAt,
        title: `Health indicator: ${indicator.type}`,
        actor: "Institution Health",
        detail: `${indicator.status} at ${indicator.score.value}; ${indicator.explanation}`,
        fallbackTimestamp: reviewedAt,
      }));
    });
  }

  if (intelligence) {
    timeline.push(createTimelineItem({
      id: `TL-${input.summary.contextId}-intelligence-assessed`,
      timestamp: intelligence.overallScore.assessedAt,
      title: "Institution intelligence assessed",
      actor: "Institution Intelligence",
      detail: `Rating ${intelligence.overallRating}, score ${intelligence.overallScore.value}/${intelligence.overallScore.maxValue}.`,
      fallbackTimestamp: reviewedAt,
    }));

    intelligence.keyInsights.slice(0, 5).forEach((insight, index) => {
      timeline.push(createTimelineItem({
        id: `TL-${input.summary.contextId}-intelligence-insight-${index}`,
        timestamp: intelligence.overallScore.assessedAt,
        title: `Intelligence insight: ${insight.title}`,
        actor: insight.sourceDomain,
        detail: insight.summary,
        fallbackTimestamp: reviewedAt,
      }));
    });

    intelligence.alerts.slice(0, 5).forEach((alert, index) => {
      timeline.push(createTimelineItem({
        id: `TL-${input.summary.contextId}-intelligence-alert-${index}`,
        timestamp: intelligence.overallScore.assessedAt,
        title: `Intelligence alert (${alert.severity})`,
        actor: alert.sourceDomain,
        detail: alert.title,
        fallbackTimestamp: reviewedAt,
      }));
    });

    intelligence.recommendations.slice(0, 5).forEach((recommendation, index) => {
      timeline.push(createTimelineItem({
        id: `TL-${input.summary.contextId}-intelligence-recommendation-${index}`,
        timestamp: intelligence.overallScore.assessedAt,
        title: `Intelligence recommendation: ${recommendation.title}`,
        actor: recommendation.sourceDomain,
        detail: recommendation.action,
        fallbackTimestamp: reviewedAt,
      }));
    });
  }

  return timeline
    .sort((left, right) => toEpoch(right.timestamp) - toEpoch(left.timestamp))
    .slice(0, 60);
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