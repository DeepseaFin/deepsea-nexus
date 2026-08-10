import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { RelationshipMetadata } from "@/lib/relationship/RelationshipMetadata";
import type { RelationshipOwner } from "@/lib/relationship/RelationshipOwner";
import type { RelationshipStage } from "@/lib/relationship/RelationshipStage";
import type { RelationshipStatus } from "@/lib/relationship/RelationshipStatus";

// Relationship is an independent domain object with its own identity and lifecycle.
// It belongs to an institution through institutionId and is resolved by orchestration or workspace assembly rather than absorbed into InstitutionContext.
export interface Relationship {
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
