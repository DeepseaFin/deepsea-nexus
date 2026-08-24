import type { WorkspaceBuildResult } from "@/src/framework/workspaces/WorkspaceBuildResult";

export interface WorkspaceBuilder<TPanel, TWorkspace> {
  withPanels(panels: readonly TPanel[]): WorkspaceBuilder<TPanel, TWorkspace>;
  build(): WorkspaceBuildResult<TWorkspace>;
}