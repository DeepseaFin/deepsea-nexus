import type { ApprovalPanel } from "@/src/capabilities/approval/panels/ApprovalPanel";
import type { ApprovalPanelContext } from "@/src/capabilities/approval/panels/ApprovalPanelContext";
import type { ApprovalPanelResult } from "@/src/capabilities/approval/panels/ApprovalPanelResult";

export interface ApprovalPanelAssembler {
  assemble(context: ApprovalPanelContext): ApprovalPanelResult<ApprovalPanel>;
}