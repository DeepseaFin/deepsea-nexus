import type { InstitutionEventCategory } from "@/lib/institution/events/constants/InstitutionEventCategory";
import type { InstitutionEventType } from "@/lib/institution/events/constants/InstitutionEventType";
import type { InstitutionEventEnvelope } from "@/lib/institution/events/types/InstitutionEventEnvelope";

export interface InstitutionEventPayload {
  readonly institutionId: string;
  readonly changedFields?: readonly string[];
  readonly reason?: string;
}

export type InstitutionEvent = InstitutionEventEnvelope<
  InstitutionEventType,
  InstitutionEventPayload
> & {
  readonly category: InstitutionEventCategory;
};