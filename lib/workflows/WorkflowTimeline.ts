import type { WorkflowCheckpoint } from "@/lib/workflows/WorkflowCheckpoint";
import { WorkflowEventType, type WorkflowEvent } from "@/lib/workflows/WorkflowEvent";
import { WorkflowStep } from "@/lib/workflows/WorkflowStep";
import {
  OpportunityLifecycle,
  transitionOpportunityLifecycleWithAudit,
} from "@/lib/workflows/WorkflowTransition";

export interface WorkflowTimeline {
  readonly events: readonly WorkflowEvent[];
  readonly checkpoints: readonly WorkflowCheckpoint[];
}

export interface BuildMockWorkflowTimelineInput {
  readonly workflowId?: string;
  readonly executionId?: string;
  readonly institutionName?: string;
  readonly opportunityReference?: string;
  readonly fundingAmount?: string;
  readonly submittedBy?: string;
  readonly baseDate?: string;
}

const DEFAULT_BASE_DATE = "2026-07-15T08:00:00Z";

type MockEventDefinition = {
  readonly label: string;
  readonly step: WorkflowStep | null;
  readonly type: WorkflowEventType;
  readonly actorId: string;
};

const MOCK_WORKFLOW_EVENT_DEFINITIONS: readonly MockEventDefinition[] = [
  {
    label: "Institution Created",
    step: WorkflowStep.InstitutionWizard,
    type: WorkflowEventType.ExecutionStarted,
    actorId: "institution-wizard",
  },
  {
    label: "Document Uploaded",
    step: WorkflowStep.Oracle,
    type: WorkflowEventType.StepStarted,
    actorId: "oracle-upload",
  },
  {
    label: "ORACLE Completed",
    step: WorkflowStep.Oracle,
    type: WorkflowEventType.StepCompleted,
    actorId: "oracle-engine",
  },
  {
    label: "Passport Generated",
    step: WorkflowStep.BusinessPassport,
    type: WorkflowEventType.StepCompleted,
    actorId: "passport-builder",
  },
  {
    label: "Journey Generated",
    step: WorkflowStep.Journey,
    type: WorkflowEventType.StepCompleted,
    actorId: "journey-engine",
  },
  {
    label: "Commercial Opportunity Created",
    step: null,
    type: WorkflowEventType.Transitioned,
    actorId: "commercial-workspace",
  },
];

type LifecycleTransitionDefinition = {
  readonly to: OpportunityLifecycle;
  readonly actor: string;
  readonly eventLabel: string;
};

const LIFECYCLE_TRANSITION_DEFINITIONS: readonly LifecycleTransitionDefinition[] = [
  {
    to: OpportunityLifecycle.SUBMITTED,
    actor: "relationship-manager",
    eventLabel: "Submitted",
  },
  {
    to: OpportunityLifecycle.UNDER_REVIEW,
    actor: "executive-desk",
    eventLabel: "Under Review",
  },
  {
    to: OpportunityLifecycle.SUBMITTED,
    actor: "executive-desk",
    eventLabel: "Returned to Submitted",
  },
  {
    to: OpportunityLifecycle.UNDER_REVIEW,
    actor: "executive-desk",
    eventLabel: "Re-entered Under Review",
  },
  {
    to: OpportunityLifecycle.APPROVED,
    actor: "executive-desk",
    eventLabel: "Executive Approved",
  },
  {
    to: OpportunityLifecycle.UNDER_REVIEW,
    actor: "executive-desk",
    eventLabel: "Returned to Under Review",
  },
  {
    to: OpportunityLifecycle.APPROVED,
    actor: "executive-desk",
    eventLabel: "Re-approved",
  },
  {
    to: OpportunityLifecycle.FUNDING_ALLOCATED,
    actor: "treasury-desk",
    eventLabel: "Funding Allocated",
  },
  {
    to: OpportunityLifecycle.APPROVED,
    actor: "treasury-desk",
    eventLabel: "Returned to Approved",
  },
  {
    to: OpportunityLifecycle.FUNDING_ALLOCATED,
    actor: "treasury-desk",
    eventLabel: "Re-allocated Funding",
  },
  {
    to: OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    actor: "treasury-desk",
    eventLabel: "Treasury Released",
  },
  {
    to: OpportunityLifecycle.FUNDING_ALLOCATED,
    actor: "treasury-desk",
    eventLabel: "Returned to Funding Allocated",
  },
  {
    to: OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    actor: "treasury-desk",
    eventLabel: "Re-released for Purchase",
  },
  {
    to: OpportunityLifecycle.PURCHASED,
    actor: "forfaiting-desk",
    eventLabel: "Receivable Purchased",
  },
  {
    to: OpportunityLifecycle.SETTLING,
    actor: "settlement-control",
    eventLabel: "Settling",
  },
  {
    to: OpportunityLifecycle.SETTLED,
    actor: "settlement-control",
    eventLabel: "Settlement Completed",
  },
  {
    to: OpportunityLifecycle.CLOSED,
    actor: "compliance-control",
    eventLabel: "Closed",
  },
];

function toEventMessage(
  definition: MockEventDefinition,
  institutionName: string,
  opportunityReference: string,
  fundingAmount: string,
  submittedBy: string,
): string {
  const byline = ` for ${institutionName}`;

  switch (definition.label) {
    case "Commercial Opportunity Created":
      return `${definition.label}${byline} (${opportunityReference}).`;
    case "Submitted":
      return `${definition.label}${byline} by ${submittedBy}.`;
    case "Treasury Released":
      return `${definition.label}${byline} at ${fundingAmount}.`;
    default:
      return `${definition.label}${byline}.`;
  }
}

function toLifecycleMessage(
  eventLabel: string,
  institutionName: string,
  opportunityReference: string,
  fundingAmount: string,
): string {
  if (eventLabel === "Treasury Released") {
    return `${eventLabel} for ${institutionName} (${opportunityReference}) at ${fundingAmount}.`;
  }

  return `${eventLabel} for ${institutionName} (${opportunityReference}).`;
}

function buildOccurredAt(baseDate: string, index: number): string {
  const startedAtMs = Date.parse(baseDate);
  if (!Number.isFinite(startedAtMs)) {
    return new Date(DEFAULT_BASE_DATE).toISOString();
  }

  return new Date(startedAtMs + index * 45 * 60 * 1000).toISOString();
}

export function buildMockWorkflowEvents(input: BuildMockWorkflowTimelineInput = {}): readonly WorkflowEvent[] {
  const workflowId = input.workflowId ?? "ATLAS-END-TO-END";
  const executionId = input.executionId ?? "EXEC-2026-PS01";
  const institutionName = input.institutionName ?? "Al Noor Trading LLC";
  const opportunityReference = input.opportunityReference ?? "OPP-7712";
  const fundingAmount = input.fundingAmount ?? "USD 6,200,000";
  const submittedBy = input.submittedBy ?? "Relationship Manager";
  const baseDate = input.baseDate ?? DEFAULT_BASE_DATE;

  const baseEvents = MOCK_WORKFLOW_EVENT_DEFINITIONS.map((definition, index) => ({
    eventId: `${executionId}-EVT-${String(index + 1).padStart(2, "0")}`,
    workflowId,
    executionId,
    type: definition.type,
    step: definition.step,
    occurredAt: buildOccurredAt(baseDate, index),
    actorId: definition.actorId,
    message: toEventMessage(
      definition,
      institutionName,
      opportunityReference,
      fundingAmount,
      submittedBy,
    ),
    metadata: {
      eventLabel: definition.label,
      institutionName,
      opportunityReference,
      fundingAmount,
    },
  }));

  let lifecycle = OpportunityLifecycle.DRAFT;

  const lifecycleEvents = LIFECYCLE_TRANSITION_DEFINITIONS.map((definition, index) => {
    const occurredAt = buildOccurredAt(baseDate, baseEvents.length + index);
    const transition = transitionOpportunityLifecycleWithAudit({
      workflowId,
      executionId,
      opportunityId: opportunityReference,
      institutionId: institutionName,
      from: lifecycle,
      to: definition.to,
      actor: definition.actor,
      occurredAt,
      remarks: toLifecycleMessage(
        definition.eventLabel,
        institutionName,
        opportunityReference,
        fundingAmount,
      ),
    });

    lifecycle = transition.lifecycle;

    return {
      ...transition.auditEvent,
      metadata: {
        ...transition.auditEvent.metadata,
        eventLabel: definition.eventLabel,
        institutionName,
        fundingAmount,
      },
    };
  });

  return [...baseEvents, ...lifecycleEvents];
}

export function buildMockWorkflowTimeline(input: BuildMockWorkflowTimelineInput = {}): WorkflowTimeline {
  return {
    events: buildMockWorkflowEvents(input),
    checkpoints: [],
  };
}
