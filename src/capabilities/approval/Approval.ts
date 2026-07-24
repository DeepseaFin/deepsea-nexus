import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalId } from "@/src/capabilities/approval/ApprovalId";
import type { ApprovalMetadata } from "@/src/capabilities/approval/ApprovalMetadata";
import type { ApprovalStatus } from "@/src/capabilities/approval/ApprovalStatus";

export interface Approval {
  readonly id: ApprovalId;
  readonly status: ApprovalStatus;
  readonly decision: ApprovalDecision;
  readonly metadata: ApprovalMetadata;
}