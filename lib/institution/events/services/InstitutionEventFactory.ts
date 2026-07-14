import type { InstitutionEventCategory } from "@/lib/institution/events/constants/InstitutionEventCategory";
import type { InstitutionEventType } from "@/lib/institution/events/constants/InstitutionEventType";
import type { InstitutionEvent } from "@/lib/institution/events/domain/InstitutionEvent";
import type { InstitutionEventMetadata } from "@/lib/institution/events/domain/InstitutionEventMetadata";
import type { InstitutionEventPayload } from "@/lib/institution/events/domain/InstitutionEvent";
import type { InstitutionEventReference } from "@/lib/institution/events/domain/InstitutionEventReference";

interface CreateInstitutionEventOptions {
  readonly references?: readonly InstitutionEventReference[];
}

export interface InstitutionEventFactory {
  create(
    metadata: InstitutionEventMetadata,
    type: InstitutionEventType,
    category: InstitutionEventCategory,
    payload: InstitutionEventPayload,
    options?: CreateInstitutionEventOptions,
  ): InstitutionEvent;
}

export const institutionEventFactory: InstitutionEventFactory = {
  create(
    metadata: InstitutionEventMetadata,
    type: InstitutionEventType,
    category: InstitutionEventCategory,
    payload: InstitutionEventPayload,
    options?: CreateInstitutionEventOptions,
  ): InstitutionEvent {
    return {
      metadata,
      type,
      category,
      payload,
      references: options?.references,
    };
  },
};