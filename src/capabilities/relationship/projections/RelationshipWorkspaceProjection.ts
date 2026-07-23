import type { InstitutionalContactProjection } from "@/src/capabilities/relationship/projections/InstitutionalContactProjection";
import type { RelationshipInteractionProjection } from "@/src/capabilities/relationship/projections/RelationshipInteractionProjection";
import type { RelationshipProjection } from "@/src/capabilities/relationship/projections/RelationshipProjection";

export interface RelationshipWorkspaceProjection {
  readonly relationship: RelationshipProjection;
  readonly contacts: readonly InstitutionalContactProjection[];
  readonly interactions: readonly RelationshipInteractionProjection[];
}
