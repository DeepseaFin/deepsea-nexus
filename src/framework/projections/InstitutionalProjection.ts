import type { ProjectionMetadata } from "@/src/framework/projections/ProjectionMetadata";

export interface InstitutionalProjection {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly createdAt: string;
  readonly metadata: ProjectionMetadata;
}