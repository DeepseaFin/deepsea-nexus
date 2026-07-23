export interface ProjectionFactory<TSource, TProjection> {
  create(source: TSource): TProjection;
}