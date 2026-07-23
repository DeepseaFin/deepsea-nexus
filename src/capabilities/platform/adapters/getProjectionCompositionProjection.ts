import type { ProjectionComposition } from "@/lib/platform/projection/ProjectionComposition";
import type {
  ProjectionCompositionProjection,
  ProjectionCompositionSummaryMetadataProjection,
} from "@/src/capabilities/platform/projections/ProjectionCompositionProjection";

function toSummaryMetadata(
  composition: ProjectionComposition,
): ProjectionCompositionSummaryMetadataProjection {
  return {
    sourceSystem: composition.metadata.sourceSystem ?? "Unknown source",
    sourceReference: composition.metadata.sourceReference ?? "Unavailable reference",
    tags: composition.metadata.tags ?? [],
    attributeCount: Object.keys(composition.metadata.attributes ?? {}).length,
  };
}

export function getProjectionCompositionProjection(
  composition: ProjectionComposition,
): ProjectionCompositionProjection {
  return {
    compositionId: composition.compositionId.toString(),
    name: composition.name,
    description: composition.description,
    type: composition.type,
    status: composition.status,
    version: composition.version,
    summaryMetadata: toSummaryMetadata(composition),
  };
}
