import type { ProjectionCollectionMetadata } from "@/src/framework/projections/ProjectionCollectionMetadata";

export interface InstitutionalProjectionCollection<T> {
  readonly items: readonly T[];
  readonly totalItems: number;
  readonly metadata: ProjectionCollectionMetadata;
}