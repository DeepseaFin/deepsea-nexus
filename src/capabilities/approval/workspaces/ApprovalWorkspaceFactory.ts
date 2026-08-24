import type { ApprovalWorkspace } from "@/src/capabilities/approval/workspaces/ApprovalWorkspace";
import type { ApprovalPanel } from "@/src/capabilities/approval/panels/ApprovalPanel";
import type { WorkspaceComposer } from "@/src/framework/workspaces/WorkspaceComposer";

export interface ApprovalWorkspaceFactory
  extends WorkspaceComposer<ApprovalPanel, ApprovalWorkspace> {}