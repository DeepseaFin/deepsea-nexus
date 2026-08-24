import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";
import type {
  RelationshipTimelineEventType,
  RelationshipTimelineViewModel,
} from "@/lib/customer/RelationshipTimelineViewModel";

export interface TimelineBusinessPassportUpdateInput {
  readonly id: string;
  readonly summary: string;
  readonly occurredAt: string;
}

export interface TimelineDocumentEventInput {
  readonly id: string;
  readonly title: string;
  readonly status?: string;
  readonly receivedAt?: string;
  readonly processedAt?: string;
}

export interface TimelineEvidenceEventInput {
  readonly id: string;
  readonly summary: string;
  readonly occurredAt: string;
}

export interface TimelineKnowledgeEventInput {
  readonly id: string;
  readonly summary: string;
  readonly occurredAt: string;
}

export interface RelationshipTimelineAssemblerInput {
  readonly intelligence: RelationshipWorkspaceIntelligenceViewModel;
  readonly dashboard?: ExecutiveRelationshipDashboardViewModel;
  readonly customerId?: string;
  readonly customerCreatedAt?: string;
  readonly businessPassportUpdates?: readonly TimelineBusinessPassportUpdateInput[];
  readonly documentEvents?: readonly TimelineDocumentEventInput[];
  readonly evidenceEvents?: readonly TimelineEvidenceEventInput[];
  readonly knowledgeEvents?: readonly TimelineKnowledgeEventInput[];
  readonly confidenceUpdatedAt?: string;
  readonly readinessUpdatedAt?: string;
  readonly outstandingActionsUpdatedAt?: string;
}

export interface RelationshipTimelineAssembler {
  assemble(input: RelationshipTimelineAssemblerInput): RelationshipTimelineViewModel;
}

interface MutableTimelineEvent {
  readonly id: string;
  readonly type: RelationshipTimelineEventType;
  readonly title: string;
  readonly description: string;
  readonly occurredAt: string;
  readonly order: number;
}

function normalizeTimestamp(primary: string | undefined, fallback: string): string {
  if (!primary) {
    return fallback;
  }

  const parsed = Date.parse(primary);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return new Date(parsed).toISOString();
}

function toDateValue(timestamp: string): number {
  return Date.parse(timestamp);
}

function toEvent(
  id: string,
  type: RelationshipTimelineEventType,
  title: string,
  description: string,
  occurredAt: string,
  order: number,
): MutableTimelineEvent {
  return {
    id,
    type,
    title,
    description,
    occurredAt,
    order,
  };
}

export function createRelationshipTimelineAssembler(): RelationshipTimelineAssembler {
  return {
    assemble(input: RelationshipTimelineAssemblerInput): RelationshipTimelineViewModel {
      const fallbackTimestamp = normalizeTimestamp(input.intelligence.generatedAt, new Date().toISOString());
      const events: MutableTimelineEvent[] = [];
      let order = 0;

      events.push(
        toEvent(
          "event-customer-created",
          "customer-created",
          "Customer Created",
          "Customer relationship record was created.",
          normalizeTimestamp(input.customerCreatedAt, fallbackTimestamp),
          order++,
        ),
      );

      const passportUpdates = input.businessPassportUpdates ?? [];
      if (passportUpdates.length > 0) {
        for (const update of passportUpdates) {
          events.push(
            toEvent(
              `event-passport-${update.id}`,
              "business-passport-updated",
              "Business Passport Updated",
              update.summary,
              normalizeTimestamp(update.occurredAt, fallbackTimestamp),
              order++,
            ),
          );
        }
      } else {
        events.push(
          toEvent(
            "event-passport-summary",
            "business-passport-updated",
            "Business Passport Updated",
            input.intelligence.executiveSummary.headline,
            fallbackTimestamp,
            order++,
          ),
        );
      }

      const documentEvents = input.documentEvents ?? [];
      for (const documentEvent of documentEvents) {
        if (documentEvent.receivedAt) {
          events.push(
            toEvent(
              `event-document-received-${documentEvent.id}`,
              "document-received",
              "Document Received",
              `${documentEvent.title} received.`,
              normalizeTimestamp(documentEvent.receivedAt, fallbackTimestamp),
              order++,
            ),
          );
        }

        if (documentEvent.processedAt) {
          const suffix = documentEvent.status ? ` Status: ${documentEvent.status}.` : "";
          events.push(
            toEvent(
              `event-document-processed-${documentEvent.id}`,
              "document-processed",
              "Document Processed",
              `${documentEvent.title} processed.${suffix}`,
              normalizeTimestamp(documentEvent.processedAt, fallbackTimestamp),
              order++,
            ),
          );
        }
      }

      const recentDocuments = input.dashboard?.recentDocuments ?? [];
      for (const document of recentDocuments) {
        const documentTimestamp = normalizeTimestamp(document.updatedAt, fallbackTimestamp);
        events.push(
          toEvent(
            `event-dashboard-document-received-${document.id}`,
            "document-received",
            "Document Received",
            `${document.title} received.`,
            documentTimestamp,
            order++,
          ),
        );
        events.push(
          toEvent(
            `event-dashboard-document-processed-${document.id}`,
            "document-processed",
            "Document Processed",
            `${document.title} processed. Status: ${document.status}.`,
            documentTimestamp,
            order++,
          ),
        );
      }

      if (!events.some((event) => event.type === "document-received")) {
        events.push(
          toEvent(
            "event-document-received-summary",
            "document-received",
            "Document Received",
            "Document intake recorded in workspace intelligence.",
            fallbackTimestamp,
            order++,
          ),
        );
      }

      if (!events.some((event) => event.type === "document-processed")) {
        events.push(
          toEvent(
            "event-document-processed-summary",
            "document-processed",
            "Document Processed",
            "Document processing recorded in workspace intelligence.",
            fallbackTimestamp,
            order++,
          ),
        );
      }

      const evidenceEvents = input.evidenceEvents ?? [];
      if (evidenceEvents.length > 0) {
        for (const event of evidenceEvents) {
          events.push(
            toEvent(
              `event-evidence-${event.id}`,
              "evidence-generated",
              "Evidence Generated",
              event.summary,
              normalizeTimestamp(event.occurredAt, fallbackTimestamp),
              order++,
            ),
          );
        }
      } else {
        events.push(
          toEvent(
            "event-evidence-summary",
            "evidence-generated",
            "Evidence Generated",
            input.intelligence.executiveSummary.evidenceSnapshot,
            fallbackTimestamp,
            order++,
          ),
        );
      }

      const knowledgeEvents = input.knowledgeEvents ?? [];
      if (knowledgeEvents.length > 0) {
        for (const event of knowledgeEvents) {
          events.push(
            toEvent(
              `event-knowledge-${event.id}`,
              "knowledge-generated",
              "Knowledge Generated",
              event.summary,
              normalizeTimestamp(event.occurredAt, fallbackTimestamp),
              order++,
            ),
          );
        }
      } else {
        const strongestInsight = input.intelligence.keyInsights.strengths[0]?.message ?? "Knowledge updated from current intelligence outputs.";
        events.push(
          toEvent(
            "event-knowledge-summary",
            "knowledge-generated",
            "Knowledge Generated",
            strongestInsight,
            fallbackTimestamp,
            order++,
          ),
        );
      }

      events.push(
        toEvent(
          "event-confidence-updated",
          "relationship-confidence-updated",
          "Relationship Confidence Updated",
          `Overall confidence score ${input.intelligence.relationshipConfidence.overallScore} (${input.intelligence.relationshipConfidence.overallBand}).`,
          normalizeTimestamp(input.confidenceUpdatedAt, fallbackTimestamp),
          order++,
        ),
      );

      events.push(
        toEvent(
          "event-readiness-updated",
          "readiness-updated",
          "Readiness Updated",
          `Readiness status ${input.intelligence.readinessStatus.status} with ${input.intelligence.readinessStatus.completedCount}/${input.intelligence.readinessStatus.totalRequirements} requirements complete.`,
          normalizeTimestamp(input.readinessUpdatedAt, fallbackTimestamp),
          order++,
        ),
      );

      const actionLabels = input.intelligence.recommendedNextActions.map((action) => action.label);
      const actionSummary = actionLabels.length > 0 ? actionLabels.join(" | ") : "No outstanding actions at this time.";

      events.push(
        toEvent(
          "event-outstanding-actions",
          "outstanding-actions",
          "Outstanding Actions",
          actionSummary,
          normalizeTimestamp(input.outstandingActionsUpdatedAt, fallbackTimestamp),
          order++,
        ),
      );

      const sortedEvents = [...events].sort((left, right) => {
        const leftDate = toDateValue(left.occurredAt);
        const rightDate = toDateValue(right.occurredAt);
        if (leftDate !== rightDate) {
          return leftDate - rightDate;
        }

        return left.order - right.order;
      });

      return {
        generatedAt: new Date().toISOString(),
        customerId: input.customerId,
        events: sortedEvents.map((event) => ({
          id: event.id,
          type: event.type,
          title: event.title,
          description: event.description,
          occurredAt: event.occurredAt,
        })),
      };
    },
  };
}
