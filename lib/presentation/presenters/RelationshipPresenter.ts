import type { RelationshipWorkspaceProjection } from "@/src/capabilities/relationship/projections/RelationshipWorkspaceProjection";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";

export interface RelationshipPresentationViewModel extends PresentationViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly workspaceProjection: RelationshipWorkspaceProjection;
  };
}

function isRelationshipWorkspaceProjection(value: unknown): value is RelationshipWorkspaceProjection {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const relationship = candidate.relationship as Record<string, unknown> | undefined;

  return (
    typeof relationship === "object" &&
    relationship !== null &&
    typeof relationship.relationshipId === "string" &&
    typeof relationship.institutionId === "string" &&
    typeof relationship.relationshipName === "string" &&
    typeof relationship.status === "string" &&
    typeof relationship.stage === "string" &&
    typeof relationship.ownerDisplayName === "string" &&
    typeof relationship.createdDate === "string" &&
    typeof relationship.updatedDate === "string" &&
    Array.isArray(candidate.contacts) &&
    Array.isArray(candidate.interactions)
  );
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.relationship.presenter",
    capability: "relationship",
    projectionType: "RelationshipWorkspaceProjection",
    schemaVersion: "1.0.0",
    tags: ["relationship", "customer-workspace"],
    attributes: {
      ...context.metadata,
      locale: context.locale,
      timezone: context.timezone,
      correlationId: context.correlationId,
      traceId: context.traceId,
      requestedAt: context.requestedAt,
    },
  };
}

export const relationshipPresenter: PresentationAdapter<
  RelationshipWorkspaceProjection,
  RelationshipPresentationViewModel
> = {
  id: "presentation.relationship.presenter",
  capability: "relationship",
  projectionType: "RelationshipWorkspaceProjection",
  canAdapt: (projection: unknown): projection is RelationshipWorkspaceProjection =>
    isRelationshipWorkspaceProjection(projection),
  adapt: (
    projection: RelationshipWorkspaceProjection,
    context: PresentationContext,
  ): PresentationResult<RelationshipPresentationViewModel> => {
    if (!isRelationshipWorkspaceProjection(projection)) {
      return {
        ok: false,
        reason: "Invalid Relationship projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: `relationship:${projection.relationship.relationshipId}`,
        title: "Relationship Journey",
        subtitle: "Presentation layer view model derived from the canonical relationship projection.",
        metadata: buildPresentationMetadata(context),
        payload: {
          workspaceProjection: projection,
        },
      },
    };
  },
};
