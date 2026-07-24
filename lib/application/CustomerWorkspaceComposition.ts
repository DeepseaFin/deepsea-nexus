import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationRegistry } from "@/lib/presentation/PresentationRegistry";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import { defaultPresentationRegistry } from "@/lib/presentation/PresentationRegistry";

export interface CustomerWorkspaceCompositionContext {
  readonly presentationRegistry?: PresentationRegistry;
  readonly presentationContext?: PresentationContext;
}

export interface CustomerWorkspaceComposition {
  resolveBusinessPassportViewModel: (
    projection: unknown,
  ) => PresentationResult<BusinessPassportPresentationViewModel>;
  resolveDocumentsViewModel: (
    projection: unknown,
  ) => PresentationResult<DocumentsPresentationViewModel>;
}

export function createCustomerWorkspaceComposition(
  context: CustomerWorkspaceCompositionContext = {},
): CustomerWorkspaceComposition {
  const presentationRegistry = context.presentationRegistry ?? defaultPresentationRegistry;
  const presentationContext: PresentationContext = context.presentationContext ?? {
    capability: "business-passport",
  };

  return {
    resolveBusinessPassportViewModel(
      projection: unknown,
    ): PresentationResult<BusinessPassportPresentationViewModel> {
      const presenter = presentationRegistry.getByCapability("business-passport").find((adapter) => adapter.id === "presentation.business-passport.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Business Passport presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Business Passport projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<BusinessPassportPresentationViewModel>;
    },
    resolveDocumentsViewModel(
      projection: unknown,
    ): PresentationResult<DocumentsPresentationViewModel> {
      const presenter = presentationRegistry.getByCapability("documents").find((adapter) => adapter.id === "presentation.documents.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Documents presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Documents projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<DocumentsPresentationViewModel>;
    },
  };
}
