import type { WorkspaceMetadata } from "@/src/framework/workspaces/WorkspaceMetadata";

export interface InstitutionalWorkspace<TPanel> {
  readonly panels: readonly TPanel[];
  readonly totalPanels: number;
  readonly metadata: WorkspaceMetadata;
}