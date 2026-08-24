export interface NavigationNodeSummaryMetadataProjection {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface NavigationNodeProjection {
  readonly navigationNodeId: string;
  readonly capabilityId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly summaryMetadata: NavigationNodeSummaryMetadataProjection;
}
