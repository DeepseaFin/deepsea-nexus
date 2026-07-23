export interface CapabilitySummaryMetadataProjection {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface CapabilityProjection {
  readonly capabilityId: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: string;
  readonly status: string;
  readonly version: string;
  readonly summaryMetadata: CapabilitySummaryMetadataProjection;
}
