import type { ApprovalActor } from "@/src/capabilities/approval/ApprovalActor";
import type { ApprovalId } from "@/src/capabilities/approval/ApprovalId";

export interface ApprovalParticipantMetadata {
  readonly notes?: string;
  readonly tags?: readonly string[];
  readonly reference?: string;
}

export interface ApprovalParticipant {
  readonly approvalId: ApprovalId;
  readonly actor: ApprovalActor;
  readonly metadata: ApprovalParticipantMetadata;
}