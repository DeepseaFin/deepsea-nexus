export interface WorkspaceCompositionSummaryMetadataProjection {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface WorkspaceCompositionProjection {
  readonly compositionId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly version: string;
  readonly summaryMetadata: WorkspaceCompositionSummaryMetadataProjection;
}
