export interface WorkspaceComposer<TPanel, TWorkspace> {
  compose(panels: readonly TPanel[]): TWorkspace;
}