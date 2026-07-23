import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { RelationshipInteraction } from "@/lib/relationship/interaction/RelationshipInteraction";
import type { RelationshipInteractionId } from "@/lib/relationship/interaction/RelationshipInteractionId";

export interface RelationshipInteractionRepository {
  findById(interactionId: RelationshipInteractionId): Promise<RelationshipInteraction | null>;
  save(interaction: RelationshipInteraction): Promise<void>;
  listByRelationshipId(relationshipId: RelationshipId): Promise<readonly RelationshipInteraction[]>;
}
