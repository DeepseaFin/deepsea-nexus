export type RelationshipTimelineEventType =
  | "customer-created"
  | "business-passport-updated"
  | "document-received"
  | "document-processed"
  | "evidence-generated"
  | "knowledge-generated"
  | "relationship-confidence-updated"
  | "readiness-updated"
  | "outstanding-actions";

export interface RelationshipTimelineEventViewModel {
  readonly id: string;
  readonly type: RelationshipTimelineEventType;
  readonly title: string;
  readonly description: string;
  readonly occurredAt: string;
}

export interface RelationshipTimelineViewModel {
  readonly generatedAt: string;
  readonly customerId?: string;
  readonly events: readonly RelationshipTimelineEventViewModel[];
}
