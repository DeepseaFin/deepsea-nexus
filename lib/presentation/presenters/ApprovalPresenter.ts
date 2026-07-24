import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";

export interface ApprovalPresentationViewModel extends PresentationViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly approvalProjection: ApprovalProjection;
  };
}

function isApprovalProjection(value: unknown): value is ApprovalProjection {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const participants = candidate.participants as readonly unknown[] | undefined;

  return (
    typeof candidate.approvalId === "string" &&
    typeof candidate.currentStage === "string" &&
    typeof candidate.currentDecision === "string" &&
    Array.isArray(participants) &&
    typeof candidate.metadata === "object" &&
    candidate.metadata !== null
  );
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.approval.presenter",
    capability: "approval",
    projectionType: "ApprovalProjection",
    schemaVersion: "1.0.0",
    tags: ["approval", "customer-workspace"],
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

export const approvalPresenter: PresentationAdapter<ApprovalProjection, ApprovalPresentationViewModel> = {
  id: "presentation.approval.presenter",
  capability: "approval",
  projectionType: "ApprovalProjection",
  canAdapt: (projection: unknown): projection is ApprovalProjection => isApprovalProjection(projection),
  adapt: (projection: ApprovalProjection, context: PresentationContext): PresentationResult<ApprovalPresentationViewModel> => {
    if (!isApprovalProjection(projection)) {
      return {
        ok: false,
        reason: "Invalid Approval projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: `approval:${projection.approvalId}`,
        title: "Approval Workspace",
        subtitle: "Presentation layer view model derived from the canonical approval projection.",
        metadata: buildPresentationMetadata(context),
        payload: {
          approvalProjection: projection,
        },
      },
    };
  },
};
