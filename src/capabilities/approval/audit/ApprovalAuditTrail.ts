import type { ApprovalAuditEntry } from "@/src/capabilities/approval/audit/ApprovalAuditEntry";
import type { ApprovalAuditMetadata } from "@/src/capabilities/approval/audit/ApprovalAuditMetadata";

export interface ApprovalAuditTrail {
  readonly approvalId: string;
  readonly entries: readonly ApprovalAuditEntry[];
  readonly metadata: ApprovalAuditMetadata;
}