import type { ApprovalPanel } from "@/src/capabilities/approval/panels/ApprovalPanel";
import type { PanelFactoryResult } from "@/src/framework/panels/PanelFactoryResult";

export interface ApprovalPanelResult<TPanel extends ApprovalPanel = ApprovalPanel>
  extends PanelFactoryResult<TPanel> {}