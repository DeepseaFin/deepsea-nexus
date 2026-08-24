import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";
import type { ApprovalProjectionContext } from "@/src/capabilities/approval/projections/ApprovalProjectionContext";
import type { ApprovalProjectionResult } from "@/src/capabilities/approval/projections/ApprovalProjectionResult";

export interface ApprovalProjectionAssembler {
  assemble(context: ApprovalProjectionContext): ApprovalProjectionResult<ApprovalProjection>;
}