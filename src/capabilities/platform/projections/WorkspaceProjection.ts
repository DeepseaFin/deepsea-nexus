export interface WorkspaceSummaryMetadataProjection {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface WorkspaceProjection {
  readonly workspaceId: string;
  readonly capabilityId: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly version: string;
  readonly summaryMetadata: WorkspaceSummaryMetadataProjection;
}
