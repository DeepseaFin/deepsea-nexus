export interface ProjectionCompositionSummaryMetadataProjection {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface ProjectionCompositionProjection {
  readonly compositionId: string;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly version: string;
  readonly summaryMetadata: ProjectionCompositionSummaryMetadataProjection;
}
