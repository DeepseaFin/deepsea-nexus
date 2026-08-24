import type { DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";

export interface DocumentsPresentationViewModel extends PresentationViewModel {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly panelModel: DocumentsPanelModel;
  };
}

function isDocumentsPanelModel(value: unknown): value is DocumentsPanelModel {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.summary) &&
    Array.isArray(candidate.statuses) &&
    Array.isArray(candidate.checklist) &&
    Array.isArray(candidate.missingDocuments) &&
    Array.isArray(candidate.timeline)
  );
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.documents.presenter",
    capability: "documents",
    projectionType: "DocumentsPanelModel",
    schemaVersion: "1.0.0",
    tags: ["documents", "customer-workspace"],
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

export const documentsPresenter: PresentationAdapter<DocumentsPanelModel, DocumentsPresentationViewModel> = {
  id: "presentation.documents.presenter",
  capability: "documents",
  projectionType: "DocumentsPanelModel",
  canAdapt: (projection: unknown): projection is DocumentsPanelModel => isDocumentsPanelModel(projection),
  adapt: (projection: DocumentsPanelModel, context: PresentationContext): PresentationResult<DocumentsPresentationViewModel> => {
    if (!isDocumentsPanelModel(projection)) {
      return {
        ok: false,
        reason: "Invalid Documents projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: "documents:customer-workspace",
        title: "Documents",
        subtitle: "Presentation layer view model derived from the canonical documents projection.",
        metadata: buildPresentationMetadata(context),
        payload: {
          panelModel: projection,
        },
      },
    };
  },
};
