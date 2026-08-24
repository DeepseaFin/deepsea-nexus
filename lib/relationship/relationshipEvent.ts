export interface RelationshipEvent {
  id: string;
  occurredAt: string;
  category: string;
  title: string;
  description: string;
  confidence?: number;
  source?: string;
}
