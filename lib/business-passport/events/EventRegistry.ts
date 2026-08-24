import type { EventDefinition } from "@/lib/business-passport/events/EventDefinition";

export interface EventRegistry<TType extends string = string> {
  register(definition: EventDefinition<TType>): void;
  exists(eventType: TType): boolean;
  getDefinition(eventType: TType): EventDefinition<TType> | undefined;
  list(): readonly EventDefinition<TType>[];
}
