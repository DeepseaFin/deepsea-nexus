export interface WorkspaceFactoryResult<T> {
  readonly workspace: T;
  readonly generatedAt: string;
  readonly version: string;
}