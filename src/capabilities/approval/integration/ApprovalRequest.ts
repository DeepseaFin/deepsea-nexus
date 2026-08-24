export interface ApprovalRequestMetadata {
  readonly sourceSystem?: string;
  readonly sourceReference?: string;
  readonly requestedBy?: string;
  readonly tags?: readonly string[];
  readonly attributes?: Readonly<Record<string, string | number | boolean>>;
}

export interface ApprovalRequest {
  readonly requestId: string;
  readonly subjectId: string;
  readonly approvalType: string;
  readonly metadata: ApprovalRequestMetadata;
}