import type { Capability } from "@/lib/platform/capability/Capability";
import type {
  CapabilityProjection,
  CapabilitySummaryMetadataProjection,
} from "@/src/capabilities/platform/projections/CapabilityProjection";

function toSummaryMetadata(capability: Capability): CapabilitySummaryMetadataProjection {
  return {
    sourceSystem: capability.metadata.sourceSystem ?? "Unknown source",
    sourceReference: capability.metadata.sourceReference ?? "Unavailable reference",
    tags: capability.metadata.tags ?? [],
    attributeCount: Object.keys(capability.metadata.attributes ?? {}).length,
  };
}

export function getCapabilityProjection(capability: Capability): CapabilityProjection {
  return {
    capabilityId: capability.capabilityId.toString(),
    name: capability.name,
    displayName: capability.displayName,
    description: capability.description,
    category: capability.category,
    status: capability.status,
    version: capability.version,
    summaryMetadata: toSummaryMetadata(capability),
  };
}
