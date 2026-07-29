export type WorkspaceId = string;
export type WorkspaceRevision = number;
export type WorkspaceTimestamp = string;
export type WorkspaceLabel = string;
export type WorkspaceTag = string;

export type WorkspaceAttributeValue = string | number | boolean | null;
export type WorkspaceAttributes = Readonly<Record<string, WorkspaceAttributeValue>>;

export interface WorkspaceValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly target?: string;
  readonly metadata?: WorkspaceAttributes;
}

export interface WorkspaceValidationResult {
  readonly valid: boolean;
  readonly issues: readonly WorkspaceValidationIssue[];
}

export interface WorkspaceOperationResult<T> {
  readonly value: T;
  readonly validation: WorkspaceValidationResult;
}
