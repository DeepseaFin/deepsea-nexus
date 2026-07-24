import type { FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";

export interface FundingPresentationViewModel extends PresentationViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly panelModel: FundingPanelModel;
  };
}

function isFundingPanelModel(value: unknown): value is FundingPanelModel {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.summary === "object" &&
    candidate.summary !== null &&
    typeof candidate.readiness === "object" &&
    candidate.readiness !== null &&
    Array.isArray(candidate.facilities) &&
    Array.isArray(candidate.timeline) &&
    Array.isArray(candidate.actions)
  );
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.funding.presenter",
    capability: "funding",
    projectionType: "FundingPanelModel",
    schemaVersion: "1.0.0",
    tags: ["funding", "customer-workspace"],
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

export const fundingPresenter: PresentationAdapter<FundingPanelModel, FundingPresentationViewModel> = {
  id: "presentation.funding.presenter",
  capability: "funding",
  projectionType: "FundingPanelModel",
  canAdapt: (projection: unknown): projection is FundingPanelModel => isFundingPanelModel(projection),
  adapt: (projection: FundingPanelModel, context: PresentationContext): PresentationResult<FundingPresentationViewModel> => {
    if (!isFundingPanelModel(projection)) {
      return {
        ok: false,
        reason: "Invalid Funding projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: "funding:customer-workspace",
        title: "Funding Workspace",
        subtitle: "Presentation layer view model derived from the canonical funding panel model.",
        metadata: buildPresentationMetadata(context),
        payload: {
          panelModel: projection,
        },
      },
    };
  },
};
