import type { WorkspaceMetadata } from "@/src/framework/workspaces/WorkspaceMetadata";

export interface ApprovalWorkspaceMetadata extends WorkspaceMetadata {
  readonly workspaceId: string;
  readonly title: string;
  readonly panelCount: number;
}