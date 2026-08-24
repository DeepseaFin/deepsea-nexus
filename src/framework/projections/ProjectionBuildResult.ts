export interface ProjectionBuildResult<T> {
  readonly projection: T;
  readonly builtAt: string;
  readonly version: string;
}