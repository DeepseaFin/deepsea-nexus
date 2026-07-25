import type { AiInsightsModel } from "@/lib/customer/insights/insights.types";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";

export interface AiInsightsPresentationViewModel extends PresentationViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly panelModel: AiInsightsModel;
  };
}

function isAiInsightsModel(value: unknown): value is AiInsightsModel {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return Array.isArray(candidate.recommendations) && Array.isArray(candidate.opportunities);
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.ai-insights.presenter",
    capability: "ai-insights",
    projectionType: "AiInsightsModel",
    schemaVersion: "1.0.0",
    tags: ["ai-insights", "customer-workspace"],
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

export const aiInsightsPresenter: PresentationAdapter<AiInsightsModel, AiInsightsPresentationViewModel> = {
  id: "presentation.ai-insights.presenter",
  capability: "ai-insights",
  projectionType: "AiInsightsModel",
  canAdapt: (projection: unknown): projection is AiInsightsModel => isAiInsightsModel(projection),
  adapt: (projection: AiInsightsModel, context: PresentationContext): PresentationResult<AiInsightsPresentationViewModel> => {
    if (!isAiInsightsModel(projection)) {
      return {
        ok: false,
        reason: "Invalid AI insights projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: "ai-insights:customer-workspace",
        title: "AI Insights",
        subtitle: "Presentation layer view model derived from the canonical AI insights model.",
        metadata: buildPresentationMetadata(context),
        payload: {
          panelModel: projection,
        },
      },
    };
  },
};
