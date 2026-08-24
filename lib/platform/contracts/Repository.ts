import type { AggregateRoot } from "@/lib/platform/contracts/AggregateRoot";

// Platform contract: repository abstracts aggregate persistence concerns.
export interface Repository<TAggregate extends AggregateRoot<TId>, TId = string> {
  findById(id: TId): Promise<TAggregate | null>;
  save(aggregate: TAggregate): Promise<void>;
}
