export interface WorkspaceBuildResult<T> {
  readonly workspace: T;
  readonly builtAt: string;
  readonly version: string;
}