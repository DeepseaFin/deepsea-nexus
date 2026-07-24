import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";
import type { ApprovalPanelMetadata } from "@/src/capabilities/approval/panels/ApprovalPanelMetadata";
import type { InstitutionalPanel } from "@/src/framework/panels/InstitutionalPanel";

export interface ApprovalPanel
  extends Omit<InstitutionalPanel<ApprovalProjection>, "items" | "metadata"> {
  readonly panelId: string;
  readonly title: string;
  readonly approvals: readonly ApprovalProjection[];
  readonly metadata: ApprovalPanelMetadata;
}