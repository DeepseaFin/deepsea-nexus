export interface InstitutionEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly occurredAt: string;
  readonly actorId: string;
  readonly notes: string | null;
  readonly metadata: Readonly<Record<string, string>>;
}
