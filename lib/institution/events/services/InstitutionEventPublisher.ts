import type { InstitutionEvent } from "@/lib/institution/events/domain/InstitutionEvent";

export interface InstitutionEventPublisher {
  publish(event: InstitutionEvent): Promise<void>;
  publishMany(events: readonly InstitutionEvent[]): Promise<void>;
}