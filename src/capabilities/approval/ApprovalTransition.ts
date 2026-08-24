import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalStage } from "@/src/capabilities/approval/ApprovalStage";

export interface ApprovalTransition {
  readonly fromStage: ApprovalStage;
  readonly toStage: ApprovalStage;
  readonly decision: ApprovalDecision;
}