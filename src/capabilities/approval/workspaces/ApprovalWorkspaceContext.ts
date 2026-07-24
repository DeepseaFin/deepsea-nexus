import type { ApprovalPanel } from "@/src/capabilities/approval/panels/ApprovalPanel";
import type { ApprovalWorkspaceMetadata } from "@/src/capabilities/approval/workspaces/ApprovalWorkspaceMetadata";

export interface ApprovalWorkspaceLayout {
  readonly columns?: number;
  readonly primaryPanelId?: string;
  readonly secondaryPanelIds?: readonly string[];
}

export interface ApprovalWorkspaceContext {
  readonly panels: readonly ApprovalPanel[];
  readonly metadata: ApprovalWorkspaceMetadata;
  readonly layout: ApprovalWorkspaceLayout;
}