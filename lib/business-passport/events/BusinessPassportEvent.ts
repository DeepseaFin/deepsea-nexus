import { EventCategory } from "@/lib/business-passport/events/EventCategory";
import type { EventEnvelope } from "@/lib/business-passport/events/EventEnvelope";
import type { EventMetadata } from "@/lib/business-passport/events/EventMetadata";
import { BusinessPassportEventType } from "@/lib/business-passport/events/BusinessPassportEventType";
import type { EventVersion } from "@/lib/business-passport/events/EventVersion";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface BusinessPassportEventPayload {
  readonly changedFields: readonly string[];
  readonly reason: string;
  readonly actor: string;
  readonly passportId: PassportId;
}

export type BusinessPassportEvent = EventEnvelope<
  BusinessPassportEventType,
  BusinessPassportEventPayload
>;

export function createBusinessPassportEvent(
  metadata: EventMetadata,
  type: BusinessPassportEventType,
  payload: BusinessPassportEventPayload,
  version: EventVersion,
): BusinessPassportEvent {
  return {
    metadata,
    category: EventCategory.BUSINESS,
    type,
    payload,
    version,
  };
}
