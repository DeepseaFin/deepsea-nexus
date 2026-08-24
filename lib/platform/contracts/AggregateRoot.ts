import type { Entity } from "@/lib/platform/contracts/Entity";

// Platform contract: an aggregate root is the transactional boundary for entities.
export interface AggregateRoot<TId = string> extends Entity<TId> {
  readonly version: number;
}
