import type { PanelMetadata } from "@/src/framework/panels/PanelMetadata";

export interface ApprovalPanelMetadata extends PanelMetadata {
  readonly panelId: string;
  readonly approvalCount: number;
}