import type { Relationship } from "@/lib/relationship/Relationship";
import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { RelationshipMetadata } from "@/lib/relationship/RelationshipMetadata";
import type { RelationshipOwner } from "@/lib/relationship/RelationshipOwner";
import type { RelationshipStage } from "@/lib/relationship/RelationshipStage";
import type { RelationshipStatus } from "@/lib/relationship/RelationshipStatus";

export interface CreateRelationshipInput {
  readonly relationshipId: RelationshipId;
  readonly institutionId: string;
  readonly relationshipName: string;
  readonly status: RelationshipStatus;
  readonly stage: RelationshipStage;
  readonly owner: RelationshipOwner;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata: RelationshipMetadata;
}

export interface RelationshipService {
  create(input: CreateRelationshipInput): Promise<Relationship>;
  get(relationshipId: RelationshipId): Promise<Relationship | null>;
  listByInstitutionId(institutionId: string): Promise<readonly Relationship[]>;
}
