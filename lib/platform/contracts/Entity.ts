// Platform contract: an entity has a stable identity within a bounded context.
export interface Entity<TId = string> {
  readonly id: TId;
}
