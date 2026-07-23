export interface ScorecardProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface ScorecardProjection {
  readonly scorecardId: string;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly kpiIds: readonly string[];
  readonly measuredAt: string;
  readonly summaryMetadata: ScorecardProjectionSummaryMetadata;
}