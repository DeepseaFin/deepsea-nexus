export interface CapabilityMetadata {
  readonly description: string;
  readonly owner: string;
  readonly dependencies: readonly string[];
  readonly introducedIn: string;
}