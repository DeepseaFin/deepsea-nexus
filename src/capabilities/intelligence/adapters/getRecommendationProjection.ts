import type { Recommendation } from "@/lib/intelligence/recommendation/Recommendation";
import type {
  RecommendationProjection,
  RecommendationProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/RecommendationProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(recommendation: Recommendation): RecommendationProjectionSummaryMetadata {
  return {
    sourceSystem: recommendation.metadata.sourceSystem ?? "Unknown source",
    sourceReference: recommendation.metadata.sourceReference ?? "Unavailable reference",
    tags: recommendation.metadata.tags ?? [],
    attributeCount: Object.keys(recommendation.metadata.attributes ?? {}).length,
  };
}

export function getRecommendationProjection(recommendation: Recommendation): RecommendationProjection {
  return {
    recommendationId: recommendation.recommendationId.toString(),
    title: recommendation.title,
    description: recommendation.description,
    recommendationType: recommendation.recommendationType,
    status: recommendation.status,
    sourceDecisionContextIds: recommendation.sourceDecisionContextIds.map((decisionContextId) =>
      decisionContextId.toString(),
    ),
    sourceDecisionOptionIds: recommendation.sourceDecisionOptionIds.map((decisionOptionId) =>
      decisionOptionId.toString(),
    ),
    rationale: recommendation.rationale,
    assumptions: recommendation.assumptions,
    createdAt: formatTimestamp(recommendation.createdAt),
    summaryMetadata: toSummaryMetadata(recommendation),
  };
}