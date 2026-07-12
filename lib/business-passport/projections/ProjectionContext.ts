import type { EventEnvelope } from "@/lib/business-passport/events/EventEnvelope";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface ProjectionContext {
  readonly passportId: PassportId;
  readonly triggeringEvent: EventEnvelope<string, Record<string, unknown>>;
  readonly projectionTimestamp: string;
  readonly requestedBy: string;
  readonly projectionReason: string;
}
