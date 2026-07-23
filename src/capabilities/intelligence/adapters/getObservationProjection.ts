import type { Observation } from "@/lib/intelligence/observation/Observation";
import type {
  ObservationProjection,
  ObservationProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/ObservationProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(observation: Observation): ObservationProjectionSummaryMetadata {
  return {
    sourceSystem: observation.metadata.sourceSystem ?? "Unknown source",
    sourceReference: observation.metadata.sourceReference ?? "Unavailable reference",
    tags: observation.metadata.tags ?? [],
    attributeCount: Object.keys(observation.metadata.attributes ?? {}).length,
  };
}

export function getObservationProjection(observation: Observation): ObservationProjection {
  return {
    observationId: observation.observationId.toString(),
    title: observation.title,
    description: observation.description,
    type: observation.observationType,
    status: observation.status,
    source: observation.source,
    observedAt: formatTimestamp(observation.observedAt),
    relatedEntityIds: observation.relatedEntityIds,
    summaryMetadata: toSummaryMetadata(observation),
  };
}