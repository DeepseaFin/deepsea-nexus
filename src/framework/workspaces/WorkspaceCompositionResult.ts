export interface WorkspaceCompositionResult<T> {
  readonly workspace: T;
  readonly composedAt: string;
  readonly version: string;
}