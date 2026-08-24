export interface ProjectionFactoryResult<T> {
  readonly projection: T;
  readonly generatedAt: string;
  readonly version: string;
}