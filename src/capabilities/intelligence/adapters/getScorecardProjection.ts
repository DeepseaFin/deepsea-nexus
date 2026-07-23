import type { Scorecard } from "@/lib/intelligence/scorecard/Scorecard";
import type {
  ScorecardProjection,
  ScorecardProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/ScorecardProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(scorecard: Scorecard): ScorecardProjectionSummaryMetadata {
  return {
    sourceSystem: scorecard.metadata.sourceSystem ?? "Unknown source",
    sourceReference: scorecard.metadata.sourceReference ?? "Unavailable reference",
    tags: scorecard.metadata.tags ?? [],
    attributeCount: Object.keys(scorecard.metadata.attributes ?? {}).length,
  };
}

export function getScorecardProjection(scorecard: Scorecard): ScorecardProjection {
  return {
    scorecardId: scorecard.scorecardId.toString(),
    name: scorecard.name,
    description: scorecard.description,
    type: scorecard.type,
    status: scorecard.status,
    kpiIds: scorecard.kpiIds.map((kpiId) => kpiId.toString()),
    measuredAt: formatTimestamp(scorecard.measuredAt),
    summaryMetadata: toSummaryMetadata(scorecard),
  };
}