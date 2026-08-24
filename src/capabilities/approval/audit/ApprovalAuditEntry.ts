export interface ApprovalAuditEntry {
  readonly entryId: string;
  readonly timestamp: string;
  readonly actorId: string;
  readonly action: string;
  readonly comment?: string;
}