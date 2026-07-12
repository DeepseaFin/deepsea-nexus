import type { RelationshipEvent } from "@/lib/relationship/relationshipEvent";

export interface RelationshipTimeline {
  businessId: string;
  events: RelationshipEvent[];
}
