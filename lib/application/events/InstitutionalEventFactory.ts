import type { InstitutionalEvent } from "@/lib/application/events/InstitutionalEvent";
import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";
import { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { MissingDocumentItem } from "@/lib/customer/documents/documents-panel.types";
import type { WorkflowEvent } from "@/lib/workflows/WorkflowEvent";
import type { RelationshipWorkspaceProjection } from "@/src/capabilities/relationship/projections/RelationshipWorkspaceProjection";
import type { AiRecommendation } from "@/lib/customer/insights/insights.types";
import type { InstitutionalTimelineEvent } from "@/lib/customer/timeline/timeline.types";
import type { NextBestActionModel } from "@/lib/customer/workflow/workflow.types";

export interface InstitutionalEventFactoryInput {
  readonly approvalProjection?: ApprovalProjection;
  readonly missingDocuments: readonly MissingDocumentItem[];
  readonly fundingMilestones: readonly WorkflowEvent[];
  readonly relationshipWorkspaceProjection?: RelationshipWorkspaceProjection;
  readonly aiRecommendations: readonly AiRecommendation[];
  readonly timelineMilestones: readonly InstitutionalTimelineEvent[];
  readonly workflowNextAction?: NextBestActionModel | null;
}

function toTitleCase(input: string): string {
  return input
    .split(/[_\-\s]+/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ");
}

function normalizeTimestamp(timestamp: string | undefined): string {
  if (!timestamp) {
    return new Date().toISOString();
  }

  const parsed = Date.parse(timestamp);
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
}

function mapDecisionEvent(projection: ApprovalProjection | undefined): InstitutionalEvent[] {
  if (!projection) {
    return [];
  }

  if (projection.currentDecision === ApprovalDecision.Approve) {
    return [
      {
        id: `approval-completed:${projection.approvalId}`,
        type: "approval-completed",
        occurredAt: normalizeTimestamp(projection.metadata.generatedAt),
        priority: "medium",
        title: projection.title,
        description: "Approval has been completed.",
        sourceId: projection.approvalId,
        actionLabel: "Review Approval",
      },
    ];
  }

  if (projection.currentDecision === ApprovalDecision.Reject) {
    return [
      {
        id: `approval-rejected:${projection.approvalId}`,
        type: "approval-rejected",
        occurredAt: normalizeTimestamp(projection.metadata.generatedAt),
        priority: "critical",
        title: projection.title,
        description: "Approval was rejected and requires follow-up.",
        sourceId: projection.approvalId,
        actionLabel: "Review Rejection",
      },
    ];
  }

  return [];
}

function mapMissingDocumentEvents(missingDocuments: readonly MissingDocumentItem[]): InstitutionalEvent[] {
  return missingDocuments.map((item) => ({
    id: `document-missing:${item.id}`,
    type: "document-missing",
    occurredAt: new Date().toISOString(),
    priority: "high",
    title: item.documentName,
    description: item.reason,
    sourceId: item.id,
    actionLabel: "Resolve Document",
  }));
}

function mapFundingEvents(fundingMilestones: readonly WorkflowEvent[]): InstitutionalEvent[] {
  return fundingMilestones.flatMap((event) => {
    const message = (event.message ?? event.metadata.eventLabel ?? event.type).toLowerCase();

    if (message.includes("expir")) {
      return [
        {
          id: `facility-expiring:${event.eventId}`,
          type: "facility-expiring",
          occurredAt: normalizeTimestamp(event.occurredAt),
          priority: "high",
          title: event.metadata.eventLabel ?? "Facility Expiring",
          description: event.message ?? "Facility expiration milestone detected.",
          sourceId: event.eventId,
          actionLabel: "Review Facility",
        } satisfies InstitutionalEvent,
      ];
    }

    if (message.includes("approv")) {
      return [
        {
          id: `facility-approved:${event.eventId}`,
          type: "facility-approved",
          occurredAt: normalizeTimestamp(event.occurredAt),
          priority: "medium",
          title: event.metadata.eventLabel ?? "Facility Approved",
          description: event.message ?? "Facility approval milestone detected.",
          sourceId: event.eventId,
          actionLabel: "View Facility",
        } satisfies InstitutionalEvent,
      ];
    }

    return [];
  });
}

function mapRelationshipEvents(
  relationshipWorkspaceProjection: RelationshipWorkspaceProjection | undefined,
): InstitutionalEvent[] {
  if (!relationshipWorkspaceProjection) {
    return [];
  }

  return relationshipWorkspaceProjection.interactions
    .filter((interaction) => {
      const status = interaction.status.toLowerCase();
      return status.includes("pending") || status.includes("follow") || status.includes("due");
    })
    .map((interaction) => ({
      id: `relationship-follow-up-due:${interaction.interactionId}`,
      type: "relationship-follow-up-due",
      occurredAt: normalizeTimestamp(interaction.occurredAt),
      priority: "medium",
      title: interaction.subject,
      description: `Relationship interaction is ${toTitleCase(interaction.status)}.`,
      sourceId: interaction.interactionId,
      actionLabel: "Follow Up",
    }));
}

function mapAiRecommendationEvents(recommendations: readonly AiRecommendation[]): InstitutionalEvent[] {
  return recommendations.map((recommendation) => ({
    id: `ai-recommendation:${recommendation.id}`,
    type: "ai-recommendation",
    occurredAt: new Date().toISOString(),
    priority: recommendation.priority,
    title: recommendation.title,
    description: recommendation.summary,
    sourceId: recommendation.id,
    actionLabel: recommendation.recommendedAction,
  }));
}

function mapTimelineMilestoneEvents(milestones: readonly InstitutionalTimelineEvent[]): InstitutionalEvent[] {
  return milestones.map((milestone) => ({
    id: `timeline-milestone:${milestone.id}`,
    type: "timeline-milestone",
    occurredAt: normalizeTimestamp(milestone.occurredAt),
    priority: "low",
    title: milestone.title,
    description: milestone.description,
    sourceId: milestone.id,
    actionLabel: "Open Timeline",
  }));
}

function mapWorkflowNextActionEvent(action: NextBestActionModel | null | undefined): InstitutionalEvent[] {
  if (!action) {
    return [];
  }

  return [
    {
      id: `workflow-next-action:${action.title}`,
      type: "workflow-next-action",
      occurredAt: new Date().toISOString(),
      priority: action.priority,
      title: action.title,
      description: action.description,
      owner: action.owner,
      actionLabel: action.actionLabel,
      sourceId: action.title,
    },
  ];
}

export function createInstitutionalEvents(input: InstitutionalEventFactoryInput): readonly InstitutionalEvent[] {
  return [
    ...mapDecisionEvent(input.approvalProjection),
    ...mapMissingDocumentEvents(input.missingDocuments),
    ...mapFundingEvents(input.fundingMilestones),
    ...mapRelationshipEvents(input.relationshipWorkspaceProjection),
    ...mapAiRecommendationEvents(input.aiRecommendations),
    ...mapTimelineMilestoneEvents(input.timelineMilestones),
    ...mapWorkflowNextActionEvent(input.workflowNextAction),
  ];
}
