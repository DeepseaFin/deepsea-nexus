import type { WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";

export interface WorkflowPresentationViewModel extends PresentationViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly panelModel: WorkflowPanelModel;
  };
}

function isWorkflowPanelModel(value: unknown): value is WorkflowPanelModel {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.priorityBanner === "object" &&
    candidate.priorityBanner !== null &&
    Array.isArray(candidate.health) &&
    Array.isArray(candidate.readiness) &&
    typeof candidate.workflowStatus === "object" &&
    candidate.workflowStatus !== null &&
    typeof candidate.nextBestAction === "object" &&
    candidate.nextBestAction !== null &&
    Array.isArray(candidate.recommendations)
  );
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.workflow.presenter",
    capability: "workflow",
    projectionType: "WorkflowPanelModel",
    schemaVersion: "1.0.0",
    tags: ["workflow", "customer-workspace"],
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

export const workflowPresenter: PresentationAdapter<WorkflowPanelModel, WorkflowPresentationViewModel> = {
  id: "presentation.workflow.presenter",
  capability: "workflow",
  projectionType: "WorkflowPanelModel",
  canAdapt: (projection: unknown): projection is WorkflowPanelModel => isWorkflowPanelModel(projection),
  adapt: (projection: WorkflowPanelModel, context: PresentationContext): PresentationResult<WorkflowPresentationViewModel> => {
    if (!isWorkflowPanelModel(projection)) {
      return {
        ok: false,
        reason: "Invalid Workflow projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: "workflow:customer-workspace",
        title: "Workflow Overview",
        subtitle: "Presentation layer view model derived from the canonical workflow model.",
        metadata: buildPresentationMetadata(context),
        payload: {
          panelModel: projection,
        },
      },
    };
  },
};
