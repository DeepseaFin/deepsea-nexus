export interface KPIProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface KPIProjection {
  readonly kpiId: string;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly value: number;
  readonly unit: string;
  readonly target: number;
  readonly trend: string;
  readonly measuredAt: string;
  readonly summaryMetadata: KPIProjectionSummaryMetadata;
}