import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";
import type { ApprovalPanelMetadata } from "@/src/capabilities/approval/panels/ApprovalPanelMetadata";

export interface ApprovalPanelFilters {
  readonly approvalId?: string;
  readonly status?: string;
  readonly stage?: string;
  readonly decision?: string;
  readonly actorId?: string;
  readonly search?: string;
}

export interface ApprovalPanelContext {
  readonly projections: readonly ApprovalProjection[];
  readonly metadata: ApprovalPanelMetadata;
  readonly filters: ApprovalPanelFilters;
}