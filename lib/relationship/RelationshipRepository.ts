import type { Relationship } from "@/lib/relationship/Relationship";
import type { RelationshipId } from "@/lib/relationship/RelationshipId";

export interface RelationshipRepository {
  findById(relationshipId: RelationshipId): Promise<Relationship | null>;
  save(relationship: Relationship): Promise<void>;
  listByInstitutionId(institutionId: string): Promise<readonly Relationship[]>;
}
