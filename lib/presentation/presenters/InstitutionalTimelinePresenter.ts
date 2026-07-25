import type { InstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.types";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";

export interface InstitutionalTimelinePresentationViewModel extends PresentationViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly panelModel: InstitutionalTimelineModel;
  };
}

function isInstitutionalTimelineModel(value: unknown): value is InstitutionalTimelineModel {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return Array.isArray(candidate.summary) && Array.isArray(candidate.events);
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.institutional-timeline.presenter",
    capability: "timeline",
    projectionType: "InstitutionalTimelineModel",
    schemaVersion: "1.0.0",
    tags: ["timeline", "customer-workspace"],
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

export const institutionalTimelinePresenter: PresentationAdapter<InstitutionalTimelineModel, InstitutionalTimelinePresentationViewModel> = {
  id: "presentation.institutional-timeline.presenter",
  capability: "timeline",
  projectionType: "InstitutionalTimelineModel",
  canAdapt: (projection: unknown): projection is InstitutionalTimelineModel => isInstitutionalTimelineModel(projection),
  adapt: (
    projection: InstitutionalTimelineModel,
    context: PresentationContext,
  ): PresentationResult<InstitutionalTimelinePresentationViewModel> => {
    if (!isInstitutionalTimelineModel(projection)) {
      return {
        ok: false,
        reason: "Invalid Institutional Timeline projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: "timeline:customer-workspace",
        title: "Institutional Timeline",
        subtitle: "Presentation layer view model derived from the canonical timeline model.",
        metadata: buildPresentationMetadata(context),
        payload: {
          panelModel: projection,
        },
      },
    };
  },
};
