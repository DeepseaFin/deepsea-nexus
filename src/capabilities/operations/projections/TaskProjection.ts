export interface TaskProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface TaskProjection {
  readonly taskId: string;
  readonly operationId: string;
  readonly taskName: string;
  readonly description: string;
  readonly taskType: string;
  readonly status: string;
  readonly priority: string;
  readonly assignedTo: string;
  readonly dueDate: string;
  readonly createdDate: string;
  readonly updatedDate: string;
  readonly summaryMetadata: TaskProjectionSummaryMetadata;
}