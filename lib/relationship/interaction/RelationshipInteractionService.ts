import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { RelationshipInteraction } from "@/lib/relationship/interaction/RelationshipInteraction";
import type { RelationshipInteractionId } from "@/lib/relationship/interaction/RelationshipInteractionId";
import type { RelationshipInteractionMetadata } from "@/lib/relationship/interaction/RelationshipInteractionMetadata";
import type { RelationshipInteractionStatus } from "@/lib/relationship/interaction/RelationshipInteractionStatus";
import type { RelationshipInteractionType } from "@/lib/relationship/interaction/RelationshipInteractionType";

export interface CreateRelationshipInteractionInput {
  readonly interactionId: RelationshipInteractionId;
  readonly relationshipId: RelationshipId;
  readonly interactionType: RelationshipInteractionType;
  readonly subject: string;
  readonly occurredAt: string;
  readonly participants: readonly string[];
  readonly status: RelationshipInteractionStatus;
  readonly metadata: RelationshipInteractionMetadata;
}

export interface RelationshipInteractionService {
  create(input: CreateRelationshipInteractionInput): Promise<RelationshipInteraction>;
  get(interactionId: RelationshipInteractionId): Promise<RelationshipInteraction | null>;
  listByRelationshipId(relationshipId: RelationshipId): Promise<readonly RelationshipInteraction[]>;
}
