import type { ApprovalPanel } from "@/src/capabilities/approval/panels/ApprovalPanel";
import type { ApprovalPanelContext } from "@/src/capabilities/approval/panels/ApprovalPanelContext";
import type { PanelFactory } from "@/src/framework/panels/PanelFactory";

export interface ApprovalPanelFactory
  extends PanelFactory<ApprovalPanelContext, ApprovalPanel> {}