export interface EventMetadata {
  readonly eventId: string;
  readonly timestamp: string;
  readonly correlationId: string;
  readonly causationId: string;
  readonly source: string;
  readonly actor: string;
  readonly tenantId?: string;
  readonly policyVersion?: string;
}
