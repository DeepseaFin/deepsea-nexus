export type WorkflowId = string;
export type WorkflowRevision = number;
export type WorkflowTimestamp = string;
export type WorkflowName = string;
export type WorkflowDescription = string;
export type WorkflowLabel = string;
export type WorkflowActorId = string;
export type WorkflowTag = string;

export type WorkflowAttributeValue = string | number | boolean | null;
export type WorkflowAttributes = Readonly<Record<string, WorkflowAttributeValue>>;

export interface WorkflowMetadata {
  readonly name: WorkflowName;
  readonly description?: WorkflowDescription;
  readonly owner?: WorkflowLabel;
  readonly tags: readonly WorkflowTag[];
  readonly attributes?: WorkflowAttributes;
}

export interface WorkflowValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly target?: string;
  readonly metadata?: WorkflowAttributes;
}

export interface WorkflowValidationResult {
  readonly valid: boolean;
  readonly issues: readonly WorkflowValidationIssue[];
}

export interface WorkflowOperationResult<T> {
  readonly value: T;
  readonly validation: WorkflowValidationResult;
}
