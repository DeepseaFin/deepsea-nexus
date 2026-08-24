import type { InstitutionEventCategory } from "@/lib/institution/events/constants/InstitutionEventCategory";
import type { InstitutionEventType } from "@/lib/institution/events/constants/InstitutionEventType";

export interface InstitutionEventSummary {
  readonly eventId: string;
  readonly institutionId: string;
  readonly type: InstitutionEventType;
  readonly category: InstitutionEventCategory;
  readonly timestamp: string;
  readonly source: string;
  readonly correlationId: string;
  readonly version: string;
}