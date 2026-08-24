import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalStatus } from "@/src/capabilities/approval/ApprovalStatus";

export interface ApprovalResponse {
  readonly approvalId: string;
  readonly status: ApprovalStatus;
  readonly decision: ApprovalDecision;
  readonly completedAt?: string;
}