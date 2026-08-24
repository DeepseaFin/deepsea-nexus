import type { BusinessContext } from "@/lib/workflows/WorkflowContext";
import { OpportunityLifecycle, type OpportunityLifecycle as OpportunityLifecycleType } from "@/lib/workflows/WorkflowTransition";

const OPPORTUNITY_VALUES: Readonly<Record<string, number>> = {
  "OPP-7712": 6200000,
  "OPP-8801": 3800000,
  "OPP-8802": 5100000,
  "OPP-8803": 4400000,
  "OPP-8804": 3600000,
  "OPP-8805": 2900000,
  "OPP-8806": 2500000,
  "OPP-8807": 2100000,
};

export const OPPORTUNITY_WORKSPACE_LIFECYCLE_ORDER: readonly OpportunityLifecycleType[] = [
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

export function formatOpportunityLifecycle(value: OpportunityLifecycleType): string {
  return value.replaceAll("_", " ");
}

export function compareOpportunityLifecycle(left: OpportunityLifecycleType, right: OpportunityLifecycleType): number {
  return OPPORTUNITY_WORKSPACE_LIFECYCLE_ORDER.indexOf(left) - OPPORTUNITY_WORKSPACE_LIFECYCLE_ORDER.indexOf(right);
}

export function getOpportunityValue(opportunityId: string): number {
  return OPPORTUNITY_VALUES[opportunityId] ?? 3000000;
}

export function dedupeLatestOpportunityContexts(contexts: readonly BusinessContext[]): readonly BusinessContext[] {
  const byOpportunity = new Map<string, BusinessContext>();

  contexts.forEach((context) => {
    const current = byOpportunity.get(context.opportunityId);
    if (!current || compareOpportunityLifecycle(current.opportunityLifecycle, context.opportunityLifecycle) < 0) {
      byOpportunity.set(context.opportunityId, context);
    }
  });

  return Array.from(byOpportunity.values()).sort((left, right) => compareOpportunityLifecycle(right.opportunityLifecycle, left.opportunityLifecycle));
}
