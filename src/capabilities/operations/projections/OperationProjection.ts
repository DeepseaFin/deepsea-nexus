export interface OperationProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface OperationProjection {
  readonly operationId: string;
  readonly relationshipId: string;
  readonly operationName: string;
  readonly description: string;
  readonly operationType: string;
  readonly status: string;
  readonly priority: string;
  readonly createdDate: string;
  readonly updatedDate: string;
  readonly summaryMetadata: OperationProjectionSummaryMetadata;
}
