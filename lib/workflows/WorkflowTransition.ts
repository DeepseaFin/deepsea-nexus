import {
  WorkflowEventType,
  type OpportunityLifecycleAuditEvent,
} from "@/lib/workflows/WorkflowEvent";
import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export interface WorkflowTransition {
  readonly from: WorkflowStep | null;
  readonly to: WorkflowStep;
  readonly on: WorkflowEventType;
  readonly guard: string | null;
  readonly description: string;
}

export enum OpportunityLifecycle {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  FUNDING_ALLOCATED = "FUNDING_ALLOCATED",
  RELEASED_FOR_PURCHASE = "RELEASED_FOR_PURCHASE",
  PURCHASED = "PURCHASED",
  SETTLING = "SETTLING",
  SETTLED = "SETTLED",
  CLOSED = "CLOSED",
}

const OPPORTUNITY_LIFECYCLE_ORDER: readonly OpportunityLifecycle[] = [
  OpportunityLifecycle.DRAFT,
  OpportunityLifecycle.SUBMITTED,
  OpportunityLifecycle.UNDER_REVIEW,
  OpportunityLifecycle.APPROVED,
  OpportunityLifecycle.FUNDING_ALLOCATED,
  OpportunityLifecycle.RELEASED_FOR_PURCHASE,
  OpportunityLifecycle.PURCHASED,
  OpportunityLifecycle.SETTLING,
  OpportunityLifecycle.SETTLED,
  OpportunityLifecycle.CLOSED,
];

const OPPORTUNITY_LIFECYCLE_TRANSITIONS: Readonly<Record<OpportunityLifecycle, readonly OpportunityLifecycle[]>> = {
  [OpportunityLifecycle.DRAFT]: [OpportunityLifecycle.SUBMITTED],
  [OpportunityLifecycle.SUBMITTED]: [OpportunityLifecycle.UNDER_REVIEW],
  [OpportunityLifecycle.UNDER_REVIEW]: [
    OpportunityLifecycle.SUBMITTED,
    OpportunityLifecycle.APPROVED,
  ],
  [OpportunityLifecycle.APPROVED]: [
    OpportunityLifecycle.UNDER_REVIEW,
    OpportunityLifecycle.FUNDING_ALLOCATED,
  ],
  [OpportunityLifecycle.FUNDING_ALLOCATED]: [
    OpportunityLifecycle.APPROVED,
    OpportunityLifecycle.RELEASED_FOR_PURCHASE,
  ],
  [OpportunityLifecycle.RELEASED_FOR_PURCHASE]: [
    OpportunityLifecycle.FUNDING_ALLOCATED,
    OpportunityLifecycle.PURCHASED,
  ],
  [OpportunityLifecycle.PURCHASED]: [OpportunityLifecycle.SETTLING],
  [OpportunityLifecycle.SETTLING]: [OpportunityLifecycle.SETTLED],
  [OpportunityLifecycle.SETTLED]: [OpportunityLifecycle.CLOSED],
  [OpportunityLifecycle.CLOSED]: [],
};

export function getOpportunityLifecycleTransitions(state: OpportunityLifecycle): readonly OpportunityLifecycle[] {
  return OPPORTUNITY_LIFECYCLE_TRANSITIONS[state];
}

export function canTransitionOpportunityLifecycle(
  from: OpportunityLifecycle,
  to: OpportunityLifecycle,
): boolean {
  return OPPORTUNITY_LIFECYCLE_TRANSITIONS[from].includes(to);
}

export function transitionOpportunityLifecycle(
  from: OpportunityLifecycle,
  to: OpportunityLifecycle,
): OpportunityLifecycle {
  if (!canTransitionOpportunityLifecycle(from, to)) {
    throw new Error(`Invalid opportunity lifecycle transition from ${from} to ${to}`);
  }

  return to;
}

export interface CreateOpportunityLifecycleAuditEventInput {
  readonly workflowId: string;
  readonly executionId: string;
  readonly opportunityId: string;
  readonly institutionId: string;
  readonly previousLifecycle: OpportunityLifecycle;
  readonly currentLifecycle: OpportunityLifecycle;
  readonly actor: string;
  readonly occurredAt?: string;
  readonly remarks?: string;
}

function buildAuditEventId(
  executionId: string,
  opportunityId: string,
  currentLifecycle: OpportunityLifecycle,
  occurredAt: string,
): string {
  const compactTimestamp = occurredAt.replaceAll(/[-:.TZ]/g, "");
  return `${executionId}-${opportunityId}-${currentLifecycle}-${compactTimestamp}`;
}

function getTransitionDirection(
  previousLifecycle: OpportunityLifecycle,
  currentLifecycle: OpportunityLifecycle,
): "forward" | "reverse" | "none" | "unknown" {
  if (previousLifecycle === currentLifecycle) {
    return "none";
  }

  const previousIndex = OPPORTUNITY_LIFECYCLE_ORDER.indexOf(previousLifecycle);
  const currentIndex = OPPORTUNITY_LIFECYCLE_ORDER.indexOf(currentLifecycle);
  if (previousIndex < 0 || currentIndex < 0) {
    return "unknown";
  }

  return currentIndex > previousIndex ? "forward" : "reverse";
}

export function createOpportunityLifecycleAuditEvent(
  input: CreateOpportunityLifecycleAuditEventInput,
): OpportunityLifecycleAuditEvent {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const remarks = input.remarks
    ?? `Opportunity lifecycle transitioned from ${input.previousLifecycle} to ${input.currentLifecycle}.`;

  return Object.freeze({
    eventId: buildAuditEventId(
      input.executionId,
      input.opportunityId,
      input.currentLifecycle,
      occurredAt,
    ),
    workflowId: input.workflowId,
    executionId: input.executionId,
    type: WorkflowEventType.OpportunityLifecycleTransitioned,
    step: null,
    occurredAt,
    actorId: input.actor,
    message: remarks,
    metadata: Object.freeze({
      opportunityId: input.opportunityId,
      institutionId: input.institutionId,
      previousLifecycle: input.previousLifecycle,
      currentLifecycle: input.currentLifecycle,
      transitionDirection: getTransitionDirection(
        input.previousLifecycle,
        input.currentLifecycle,
      ),
    }),
    opportunityId: input.opportunityId,
    institutionId: input.institutionId,
    previousLifecycle: input.previousLifecycle,
    currentLifecycle: input.currentLifecycle,
    actor: input.actor,
    remarks,
  });
}

export interface OpportunityLifecycleTransitionWithAuditInput {
  readonly workflowId: string;
  readonly executionId: string;
  readonly opportunityId: string;
  readonly institutionId: string;
  readonly from: OpportunityLifecycle;
  readonly to: OpportunityLifecycle;
  readonly actor: string;
  readonly occurredAt?: string;
  readonly remarks?: string;
}

export interface OpportunityLifecycleTransitionWithAuditResult {
  readonly lifecycle: OpportunityLifecycle;
  readonly auditEvent: OpportunityLifecycleAuditEvent;
}

export function transitionOpportunityLifecycleWithAudit(
  input: OpportunityLifecycleTransitionWithAuditInput,
): OpportunityLifecycleTransitionWithAuditResult {
  const lifecycle = transitionOpportunityLifecycle(input.from, input.to);
  const auditEvent = createOpportunityLifecycleAuditEvent({
    workflowId: input.workflowId,
    executionId: input.executionId,
    opportunityId: input.opportunityId,
    institutionId: input.institutionId,
    previousLifecycle: input.from,
    currentLifecycle: lifecycle,
    actor: input.actor,
    occurredAt: input.occurredAt,
    remarks: input.remarks,
  });

  return {
    lifecycle,
    auditEvent,
  };
}
