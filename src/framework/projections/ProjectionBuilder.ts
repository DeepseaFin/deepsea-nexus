import type { ProjectionBuildResult } from "@/src/framework/projections/ProjectionBuildResult";

export interface ProjectionBuilder<TSource, TProjection> {
  withSource(source: TSource): ProjectionBuilder<TSource, TProjection>;
  build(): ProjectionBuildResult<TProjection>;
}