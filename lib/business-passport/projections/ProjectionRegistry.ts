import type { ProjectionDefinition } from "@/lib/business-passport/projections/ProjectionDefinition";

export interface ProjectionRegistry {
  register(definition: ProjectionDefinition): void;
  list(): readonly ProjectionDefinition[];
  get(projectionName: string): ProjectionDefinition | undefined;
  exists(projectionName: string): boolean;
}
