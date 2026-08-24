import type { HomeQuickAction } from "@/components/product/home/QuickActions";
import type { WorkQueueItem } from "@/components/product/home/WorkQueue";
import {
  toInstitutionHomeInsightViewModel,
  type InstitutionHomeIntelligenceSurface,
  type InstitutionHomeInsightViewModel,
} from "@/lib/application/InstitutionHomeIntelligenceSurface";
import type { BusinessContext } from "@/lib/workflows/WorkflowContext";
import { dedupeLatestOpportunityContexts, formatOpportunityLifecycle } from "@/lib/workflows/OpportunityWorkspaceHelpers";
import { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";

export interface InstitutionHomeComposerInput {
  readonly contexts: readonly BusinessContext[];
}

export interface InstitutionHomeHeroModel {
  readonly currentContextLabel: string;
  readonly currentContextLifecycleLabel: string;
  readonly nextActionLabel: string;
  readonly nextActionDescription: string;
  readonly journeyHref: string;
  readonly workQueueHref: string;
  readonly opportunityHref: string;
}

export interface InstitutionHomeWelcomeModel {
  readonly greeting: string;
  readonly headline: string;
  readonly summary: string;
  readonly context: string;
  readonly chips: readonly string[];
  readonly primaryActionLabel: string;
  readonly secondaryActionLabel: string;
}

export interface InstitutionHomePageModel {
  readonly hero: InstitutionHomeHeroModel;
  readonly welcome: InstitutionHomeWelcomeModel;
  readonly insights: readonly InstitutionHomeInsightViewModel[];
  readonly workQueue: readonly WorkQueueItem[];
  readonly quickActions: readonly HomeQuickAction[];
}

function toQueueStatus(lifecycle: OpportunityLifecycle): WorkQueueItem["status"] {
  if (lifecycle === OpportunityLifecycle.UNDER_REVIEW || lifecycle === OpportunityLifecycle.FUNDING_ALLOCATED) {
    return "in_progress";
  }

  if (lifecycle === OpportunityLifecycle.SUBMITTED || lifecycle === OpportunityLifecycle.APPROVED) {
    return "pending";
  }

  return "blocked";
}

function createWorkQueue(contexts: readonly BusinessContext[]): readonly WorkQueueItem[] {
  return contexts.slice(0, 4).map((context) => ({
    id: context.workflowId,
    title: `Progress ${context.opportunityId}`,
    owner: context.currentOwner,
    due: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Today" : "This week",
    priority: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "critical" as const : "high" as const,
    status: toQueueStatus(context.opportunityLifecycle),
  }));
}

function createIntelligenceSurface(
  activeContexts: readonly BusinessContext[],
  journeyContext: BusinessContext | undefined,
  journeyHref: string,
): InstitutionHomeIntelligenceSurface {
  return {
    userContext: {
      actorId: "institution-home-user",
      experienceContext: "employee",
      roleLabel: "Relationship Manager",
      workspace: "institution-home",
    },
    intelligenceContext: {
      route: "/atlas/institution-home",
      generatedAt: new Date().toISOString(),
      activeOpportunityCount: activeContexts.length,
      opportunityId: journeyContext?.opportunityId,
      lifecycle: journeyContext?.opportunityLifecycle,
    },
    results: journeyContext
      ? [
          {
            id: "home-guidance",
            type: "guidance",
            title: "Seeded guidance: proceed with the current journey",
            explanation: `Prioritize ${journeyContext.opportunityId} and complete the next stage in Journey Workspace.`,
            priority: "high",
            source: {
              type: "workflow",
              label: "Current workflow context",
            },
            recommendedAction: {
              label: "Open Journey Workspace",
              target: journeyHref,
            },
          },
          {
            id: "home-summary",
            type: "summary",
            title: "Seeded guidance: keep operations synchronized",
            explanation: "Use Work Queue for immediate execution and Opportunity Workspace for full context.",
            priority: "medium",
            source: {
              type: "operations",
              label: "Operational queue context",
            },
            recommendedAction: {
              label: "Open Work Queue",
              target: "/atlas/work-queue",
            },
          },
        ]
      : [
          {
            id: "home-empty-guidance",
            type: "guidance",
            title: "Seeded guidance: no active opportunities are loaded",
            explanation: "Open Work Queue or Opportunity Workspace to start the next path.",
            priority: "low",
            source: {
              type: "system",
              label: "Institution home context",
            },
            recommendedAction: {
              label: "Open Work Queue",
              target: "/atlas/work-queue",
            },
          },
        ],
  };
}

export function composeInstitutionHomePageModel(
  input: InstitutionHomeComposerInput,
): InstitutionHomePageModel {
  const contexts = dedupeLatestOpportunityContexts(input.contexts);
  const activeContexts = contexts.filter((context) => context.opportunityLifecycle !== OpportunityLifecycle.CLOSED);

  const journeyContext = activeContexts.find(
    (context) =>
      context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
      || context.opportunityLifecycle === OpportunityLifecycle.SUBMITTED,
  ) ?? activeContexts[0];

  const journeyHref = journeyContext
    ? `/atlas/journey?opportunityId=${journeyContext.opportunityId}`
    : "/atlas/journey";
  const opportunityHref = journeyContext
    ? `/atlas/opportunity?opportunityId=${journeyContext.opportunityId}`
    : "/atlas/opportunity";

  const intelligenceSurface = createIntelligenceSurface(activeContexts, journeyContext, journeyHref);
  const insights = toInstitutionHomeInsightViewModel(intelligenceSurface);

  return {
    hero: {
      currentContextLabel: journeyContext?.opportunityId ?? "No active context",
      currentContextLifecycleLabel: journeyContext ? formatOpportunityLifecycle(journeyContext.opportunityLifecycle) : "Unavailable",
      nextActionLabel: journeyContext ? `Open Journey for ${journeyContext.currentOwner}` : "Start an opportunity workflow",
      nextActionDescription: "Guided execution path from context to completion.",
      journeyHref,
      workQueueHref: "/atlas/work-queue",
      opportunityHref,
    },
    welcome: {
      greeting: "Welcome",
      headline: "Institution Operating Home",
      summary: "See what matters, decide quickly, and complete the next institutional action.",
      context: "Institution Home / Employee Shell",
      chips: ["Context First", "Decision Ready", "Action Guided"],
      primaryActionLabel: "Continue Journey",
      secondaryActionLabel: "Open Work Queue",
    },
    insights,
    workQueue: createWorkQueue(activeContexts),
    quickActions: [
      { id: "home-quick-journey", label: "Open Journey Workspace", tone: "primary" },
      { id: "home-quick-work-queue", label: "Open Work Queue", tone: "secondary" },
    ],
  };
}