import type { DecisionContext } from "@/lib/intelligence/decision-context/DecisionContext";
import type {
  DecisionContextProjection,
  DecisionContextProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/DecisionContextProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(decisionContext: DecisionContext): DecisionContextProjectionSummaryMetadata {
  return {
    sourceSystem: decisionContext.metadata.sourceSystem ?? "Unknown source",
    sourceReference: decisionContext.metadata.sourceReference ?? "Unavailable reference",
    tags: decisionContext.metadata.tags ?? [],
    attributeCount: Object.keys(decisionContext.metadata.attributes ?? {}).length,
  };
}

export function getDecisionContextProjection(decisionContext: DecisionContext): DecisionContextProjection {
  return {
    decisionContextId: decisionContext.decisionContextId.toString(),
    title: decisionContext.title,
    description: decisionContext.description,
    contextType: decisionContext.contextType,
    status: decisionContext.status,
    sourceInsightIds: decisionContext.sourceInsightIds.map((insightId) => insightId.toString()),
    relatedEntityIds: decisionContext.relatedEntityIds,
    createdAt: formatTimestamp(decisionContext.createdAt),
    summaryMetadata: toSummaryMetadata(decisionContext),
  };
}