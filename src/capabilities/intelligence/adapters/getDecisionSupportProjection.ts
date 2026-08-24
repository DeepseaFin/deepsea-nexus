import type { DecisionSupport } from "@/lib/intelligence/decision-support/DecisionSupport";
import type {
  DecisionSupportProjection,
  DecisionSupportProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/DecisionSupportProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(decisionSupport: DecisionSupport): DecisionSupportProjectionSummaryMetadata {
  return {
    sourceSystem: decisionSupport.metadata.sourceSystem ?? "Unknown source",
    sourceReference: decisionSupport.metadata.sourceReference ?? "Unavailable reference",
    tags: decisionSupport.metadata.tags ?? [],
    attributeCount: Object.keys(decisionSupport.metadata.attributes ?? {}).length,
  };
}

export function getDecisionSupportProjection(decisionSupport: DecisionSupport): DecisionSupportProjection {
  return {
    decisionSupportId: decisionSupport.decisionSupportId.toString(),
    title: decisionSupport.title,
    description: decisionSupport.description,
    supportType: decisionSupport.supportType,
    status: decisionSupport.status,
    recommendationIds: decisionSupport.recommendationIds.map((recommendationId) => recommendationId.toString()),
    summary: decisionSupport.summary,
    assumptions: decisionSupport.assumptions,
    considerations: decisionSupport.considerations,
    createdAt: formatTimestamp(decisionSupport.createdAt),
    summaryMetadata: toSummaryMetadata(decisionSupport),
  };
}