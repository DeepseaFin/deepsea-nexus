import type { InstitutionEventType } from "@/lib/institution/events/constants/InstitutionEventType";
import type { InstitutionEvent } from "@/lib/institution/events/domain/InstitutionEvent";

export interface InstitutionEventRepository {
  findByEventId(eventId: string): Promise<InstitutionEvent | null>;
  save(event: InstitutionEvent): Promise<void>;
  listByInstitutionId(institutionId: string): Promise<readonly InstitutionEvent[]>;
  listByType(type: InstitutionEventType): Promise<readonly InstitutionEvent[]>;
}