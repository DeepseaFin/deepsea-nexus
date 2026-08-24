import type { Approval } from "@/src/capabilities/approval/Approval";
import type { ApprovalHistoryEntry } from "@/src/capabilities/approval/ApprovalHistoryEntry";
import type { ApprovalParticipant } from "@/src/capabilities/approval/ApprovalParticipant";

export interface ApprovalProjectionContext {
  readonly approval: Approval;
  readonly participants: readonly ApprovalParticipant[];
  readonly history: readonly ApprovalHistoryEntry[];
}