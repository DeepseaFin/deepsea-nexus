import type { Insight } from "@/lib/intelligence/insight/Insight";
import type {
  InsightProjection,
  InsightProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/InsightProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(insight: Insight): InsightProjectionSummaryMetadata {
  return {
    sourceSystem: insight.metadata.sourceSystem ?? "Unknown source",
    sourceReference: insight.metadata.sourceReference ?? "Unavailable reference",
    tags: insight.metadata.tags ?? [],
    attributeCount: Object.keys(insight.metadata.attributes ?? {}).length,
  };
}

export function getInsightProjection(insight: Insight): InsightProjection {
  return {
    insightId: insight.insightId.toString(),
    title: insight.title,
    description: insight.description,
    type: insight.insightType,
    status: insight.status,
    confidence: insight.confidence,
    sourceObservationIds: insight.sourceObservationIds.map((observationId) => observationId.toString()),
    generatedAt: formatTimestamp(insight.generatedAt),
    summaryMetadata: toSummaryMetadata(insight),
  };
}