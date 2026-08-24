export interface WorkspaceFactory<TPanel, TWorkspace> {
  create(panels: readonly TPanel[]): TWorkspace;
}