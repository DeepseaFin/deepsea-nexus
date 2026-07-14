import type { InstitutionEventCategory } from "@/lib/institution/events/constants/InstitutionEventCategory";
import type { InstitutionEventMetadata } from "@/lib/institution/events/domain/InstitutionEventMetadata";
import type { InstitutionEventReference } from "@/lib/institution/events/domain/InstitutionEventReference";

export interface InstitutionEventEnvelope<TType extends string, TPayload> {
  readonly metadata: InstitutionEventMetadata;
  readonly type: TType;
  readonly category: InstitutionEventCategory;
  readonly payload: TPayload;
  readonly references?: readonly InstitutionEventReference[];
}