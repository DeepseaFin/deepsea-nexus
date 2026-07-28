export type ActivityId = string;
export type ActivityTimestamp = string;
export type ActivityRevision = number;
export type ActivityLabel = string;
export type ActivityActorId = string;
export type ActivityTag = string;

export type ActivityAttributeValue = string | number | boolean | null;
export type ActivityAttributes = Readonly<Record<string, ActivityAttributeValue>>;

export interface ActivityValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly target?: string;
  readonly metadata?: ActivityAttributes;
}

export interface ActivityValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ActivityValidationIssue[];
}

export interface ActivityOperationResult<T> {
  readonly value: T;
  readonly validation: ActivityValidationResult;
}
