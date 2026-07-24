import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalStage } from "@/src/capabilities/approval/ApprovalStage";

export interface ApprovalHistoryEntry {
  readonly timestamp: string;
  readonly actorId: string;
  readonly stage: ApprovalStage;
  readonly decision: ApprovalDecision;
  readonly comment?: string;
}