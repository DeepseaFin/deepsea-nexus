import type { ApprovalWorkspace } from "@/src/capabilities/approval/workspaces/ApprovalWorkspace";
import type { WorkspaceFactoryResult } from "@/src/framework/workspaces/WorkspaceFactoryResult";

export interface ApprovalWorkspaceResult<
  TWorkspace extends ApprovalWorkspace = ApprovalWorkspace,
> extends WorkspaceFactoryResult<TWorkspace> {}