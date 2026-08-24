import type { DecisionOption } from "@/lib/intelligence/decision-option/DecisionOption";
import type {
  DecisionOptionProjection,
  DecisionOptionProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/DecisionOptionProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(decisionOption: DecisionOption): DecisionOptionProjectionSummaryMetadata {
  return {
    sourceSystem: decisionOption.metadata.sourceSystem ?? "Unknown source",
    sourceReference: decisionOption.metadata.sourceReference ?? "Unavailable reference",
    tags: decisionOption.metadata.tags ?? [],
    attributeCount: Object.keys(decisionOption.metadata.attributes ?? {}).length,
  };
}

export function getDecisionOptionProjection(decisionOption: DecisionOption): DecisionOptionProjection {
  return {
    decisionOptionId: decisionOption.decisionOptionId.toString(),
    title: decisionOption.title,
    description: decisionOption.description,
    optionType: decisionOption.optionType,
    status: decisionOption.status,
    sourceDecisionContextIds: decisionOption.sourceDecisionContextIds.map((decisionContextId) =>
      decisionContextId.toString(),
    ),
    assumptions: decisionOption.assumptions,
    createdAt: formatTimestamp(decisionOption.createdAt),
    summaryMetadata: toSummaryMetadata(decisionOption),
  };
}