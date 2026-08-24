import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { RelationshipInteractionId } from "@/lib/relationship/interaction/RelationshipInteractionId";
import type { RelationshipInteractionMetadata } from "@/lib/relationship/interaction/RelationshipInteractionMetadata";
import type { RelationshipInteractionStatus } from "@/lib/relationship/interaction/RelationshipInteractionStatus";
import type { RelationshipInteractionType } from "@/lib/relationship/interaction/RelationshipInteractionType";

export interface RelationshipInteraction {
  readonly interactionId: RelationshipInteractionId;
  readonly relationshipId: RelationshipId;
  readonly interactionType: RelationshipInteractionType;
  readonly subject: string;
  readonly occurredAt: string;
  readonly participants: readonly string[];
  readonly status: RelationshipInteractionStatus;
  readonly metadata: RelationshipInteractionMetadata;
}
