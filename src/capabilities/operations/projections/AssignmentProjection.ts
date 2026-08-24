export interface AssignmentProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface AssignmentProjection {
  readonly assignmentId: string;
  readonly operationId: string;
  readonly taskId?: string;
  readonly assigneeId: string;
  readonly assigneeName: string;
  readonly assignmentType: string;
  readonly status: string;
  readonly assignedAt: string;
  readonly completedAt?: string;
  readonly summaryMetadata: AssignmentProjectionSummaryMetadata;
}