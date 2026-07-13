import type { EventCategory } from "@/lib/business-passport/events/EventCategory";
import type { EventMetadata } from "@/lib/business-passport/events/EventMetadata";
import type { EventVersion } from "@/lib/business-passport/events/EventVersion";
import type { Confidence } from "@/lib/business-passport/types/Confidence";
import type { EvidenceReference } from "@/lib/business-passport/types/EvidenceReference";

export interface EventEnvelope<TType extends string, TPayload> {
  readonly metadata: EventMetadata;
  readonly category: EventCategory;
  readonly type: TType;
  readonly payload: TPayload;
  readonly version: EventVersion;
  readonly confidence?: Confidence;
  readonly evidenceReferences?: readonly EvidenceReference[];
}
