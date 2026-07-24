export interface CapabilityRegistryBuildResult<T> {
  readonly registry: T;
  readonly builtAt: string;
  readonly version: string;
}