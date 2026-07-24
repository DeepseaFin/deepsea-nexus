export interface ApprovalMetadata {
  readonly description: string;
  readonly source?: string;
  readonly tags?: readonly string[];
  readonly reference?: string;
}