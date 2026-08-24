import type { CustomerLifecycleOrchestrationModel } from "@/lib/application/CustomerLifecycleOrchestrator";
import type { InstitutionalEvent } from "@/lib/application/events/InstitutionalEvent";
import type { InstitutionalEventType } from "@/lib/application/events/InstitutionalEventType";
import type { AiRecommendation } from "@/lib/customer/insights/insights.types";
import type { NextBestActionModel, WorkflowPriority } from "@/lib/customer/workflow/workflow.types";

export type WorkQueueDueStatus = "overdue" | "due-soon" | "ready" | "queued";

export interface WorkQueueCustomer {
  readonly id?: string;
  readonly name: string;
}

export interface RelationshipManagerWorkItem {
  readonly id: string;
  readonly priority: WorkflowPriority;
  readonly dueStatus: WorkQueueDueStatus;
  readonly customer: WorkQueueCustomer;
  readonly action: NextBestActionModel;
  readonly context: string;
  readonly sourceType: InstitutionalEventType | "lifecycle" | "ai-insights";
}

export interface RelationshipManagerWorkbenchSource {
  readonly customer: WorkQueueCustomer;
  readonly lifecycle: CustomerLifecycleOrchestrationModel;
  readonly institutionalEvents: readonly InstitutionalEvent[];
  readonly aiRecommendations: readonly AiRecommendation[];
}

export interface RelationshipManagerWorkbenchModel {
  readonly items: readonly RelationshipManagerWorkItem[];
  readonly topItems: readonly RelationshipManagerWorkItem[];
  readonly recommendedWorkItem: RelationshipManagerWorkItem | null;
}

const priorityWeight: Readonly<Record<WorkflowPriority, number>> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const dueWeight: Readonly<Record<WorkQueueDueStatus, number>> = {
  overdue: 4,
  "due-soon": 3,
  ready: 2,
  queued: 1,
};

function toWorkItemFromEvent(
  event: InstitutionalEvent,
  customer: WorkQueueCustomer,
): RelationshipManagerWorkItem {
  return {
    id: event.id,
    priority: event.priority,
    dueStatus:
      event.type === "approval-rejected" || event.type === "document-missing"
        ? "overdue"
        : event.type === "facility-expiring" || event.type === "relationship-follow-up-due"
          ? "due-soon"
          : "queued",
    customer,
    action: {
      title: event.title,
      description: event.description,
      owner: event.owner ?? "Relationship Manager",
      priority: event.priority,
      actionLabel: event.actionLabel ?? "Open Workspace",
    },
    context: event.description,
    sourceType: event.type,
  };
}

function lifecycleItems(
  lifecycle: CustomerLifecycleOrchestrationModel,
  customer: WorkQueueCustomer,
): readonly RelationshipManagerWorkItem[] {
  const items: RelationshipManagerWorkItem[] = [];

  if (lifecycle.documents.state === "missing-mandatory") {
    items.push({
      id: "lifecycle:missing-kyc",
      priority: "critical",
      dueStatus: "overdue",
      customer,
      action: {
        title: "Customer missing KYC documents",
        description: "Mandatory documents are missing and blocking onboarding progression.",
        owner: "Relationship Manager",
        priority: "critical",
        actionLabel: "Open Documents",
      },
      context: "Missing mandatory KYC evidence",
      sourceType: "lifecycle",
    });
  }

  if (lifecycle.approvals.state === "pending") {
    items.push({
      id: "lifecycle:pending-approval",
      priority: "high",
      dueStatus: "due-soon",
      customer,
      action: {
        title: "Pending customer approval",
        description: "Approval is pending and requires relationship manager follow-through.",
        owner: "Relationship Manager",
        priority: "high",
        actionLabel: "Open Approvals",
      },
      context: `Approval stage: ${lifecycle.approvals.currentStage ?? "Not specified"}`,
      sourceType: "lifecycle",
    });
  }

  if (lifecycle.funding.state === "readiness-ready") {
    items.push({
      id: "lifecycle:funding-ready",
      priority: "medium",
      dueStatus: "ready",
      customer,
      action: {
        title: "Funding is ready for release",
        description: "Funding readiness state is ready and can be progressed.",
        owner: "Relationship Manager",
        priority: "medium",
        actionLabel: "Open Funding",
      },
      context: `Funding readiness: ${lifecycle.funding.readiness ?? "Ready"}`,
      sourceType: "lifecycle",
    });
  }

  if (lifecycle.relationship.state === "follow-up-due") {
    items.push({
      id: "lifecycle:relationship-follow-up",
      priority: "medium",
      dueStatus: "due-soon",
      customer,
      action: {
        title: "Relationship follow-up overdue",
        description: "Follow-up is due and should be addressed to maintain customer momentum.",
        owner: "Relationship Manager",
        priority: "medium",
        actionLabel: "Open Relationship",
      },
      context: "Relationship follow-up due",
      sourceType: "lifecycle",
    });
  }

  return items;
}

function aiRecommendationItems(
  recommendations: readonly AiRecommendation[],
  customer: WorkQueueCustomer,
): readonly RelationshipManagerWorkItem[] {
  return recommendations.map((recommendation) => ({
    id: `ai-recommendation:${recommendation.id}`,
    priority: recommendation.priority,
    dueStatus: "queued",
    customer,
    action: {
      title: recommendation.title,
      description: recommendation.summary,
      owner: "Relationship Manager",
      priority: recommendation.priority,
      actionLabel: recommendation.recommendedAction,
    },
    context: recommendation.category,
    sourceType: "ai-insights",
  }));
}

function sortWorkItems(
  items: readonly RelationshipManagerWorkItem[],
): readonly RelationshipManagerWorkItem[] {
  return [...items].sort((left, right) => {
    const priorityDelta = priorityWeight[right.priority] - priorityWeight[left.priority];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    const dueDelta = dueWeight[right.dueStatus] - dueWeight[left.dueStatus];
    if (dueDelta !== 0) {
      return dueDelta;
    }

    return left.id.localeCompare(right.id);
  });
}

export function composeRelationshipManagerWorkbench(
  source: RelationshipManagerWorkbenchSource,
): RelationshipManagerWorkbenchModel {
  const eventItems = source.institutionalEvents.map((event) => toWorkItemFromEvent(event, source.customer));
  const lifecycleDerivedItems = lifecycleItems(source.lifecycle, source.customer);
  const aiDerivedItems = aiRecommendationItems(source.aiRecommendations, source.customer);

  const items = sortWorkItems([...eventItems, ...lifecycleDerivedItems, ...aiDerivedItems]);

  return {
    items,
    topItems: items.slice(0, 5),
    recommendedWorkItem: items[0] ?? null,
  };
}
