export interface InstitutionEventMetadata {
  readonly eventId: string;
  readonly institutionId: string;
  readonly timestamp: string;
  readonly source: string;
  readonly correlationId: string;
  readonly version: string;
  readonly actor?: string;
}