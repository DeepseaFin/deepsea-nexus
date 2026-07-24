import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalParticipant } from "@/src/capabilities/approval/ApprovalParticipant";
import type { ApprovalProjectionMetadata } from "@/src/capabilities/approval/projections/ApprovalProjectionMetadata";
import type { InstitutionalProjection } from "@/src/framework/projections/InstitutionalProjection";

export interface ApprovalProjection
  extends Omit<InstitutionalProjection, "id" | "metadata"> {
  readonly approvalId: string;
  readonly currentStage: string;
  readonly currentDecision: ApprovalDecision;
  readonly participants: readonly ApprovalParticipant[];
  readonly metadata: ApprovalProjectionMetadata;
}