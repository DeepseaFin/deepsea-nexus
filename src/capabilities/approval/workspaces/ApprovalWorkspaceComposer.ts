import type { ApprovalWorkspace } from "@/src/capabilities/approval/workspaces/ApprovalWorkspace";
import type { ApprovalWorkspaceContext } from "@/src/capabilities/approval/workspaces/ApprovalWorkspaceContext";
import type { ApprovalWorkspaceResult } from "@/src/capabilities/approval/workspaces/ApprovalWorkspaceResult";

export interface ApprovalWorkspaceComposer {
  compose(context: ApprovalWorkspaceContext): ApprovalWorkspaceResult<ApprovalWorkspace>;
}