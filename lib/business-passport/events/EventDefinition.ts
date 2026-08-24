import type { EventCategory } from "@/lib/business-passport/events/EventCategory";
import type { EventVersion } from "@/lib/business-passport/events/EventVersion";

export interface EventDefinition<TType extends string = string> {
  readonly eventType: TType;
  readonly category: EventCategory;
  readonly description: string;
  readonly version: EventVersion;
  readonly payloadType: string;
  readonly deprecated: boolean;
}
