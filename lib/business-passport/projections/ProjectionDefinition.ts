export interface ProjectionDefinition {
  readonly projectionName: string;
  readonly description: string;
  readonly supportedEvents: readonly string[];
  readonly dependencies: readonly string[];
  readonly produces: readonly string[];
}
