import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import {
  PRESENTATION_CAPABILITIES,
  type PresentationCapability,
  type PresentationContext,
} from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import { aiInsightsPresenter } from "@/lib/presentation/presenters/AiInsightsPresenter";
import { fundingPresenter } from "@/lib/presentation/presenters/FundingPresenter";
import { approvalPresenter } from "@/lib/presentation/presenters/ApprovalPresenter";
import { documentsPresenter } from "@/lib/presentation/presenters/DocumentsPresenter";
import { businessPassportPresenter } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import { relationshipPresenter } from "@/lib/presentation/presenters/RelationshipPresenter";
import { institutionalTimelinePresenter } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import { workflowPresenter } from "@/lib/presentation/presenters/WorkflowPresenter";

export interface RegisteredPresentationAdapter<
  TProjection = unknown,
  TViewModel extends PresentationViewModel = PresentationViewModel,
> {
  readonly id: string;
  readonly capability: PresentationCapability;
  readonly projectionType?: string;
  canAdapt: (projection: unknown, context: PresentationContext) => projection is TProjection;
  adapt: (projection: unknown, context: PresentationContext) => PresentationResult<TViewModel> | Promise<PresentationResult<TViewModel>>;
}

function createRegisteredAdapter<TProjection, TViewModel extends PresentationViewModel>(
  adapter: PresentationAdapter<TProjection, TViewModel>,
): RegisteredPresentationAdapter<TProjection, TViewModel> {
  const canAdapt = adapter.canAdapt;

  return {
    id: adapter.id,
    capability: adapter.capability,
    projectionType: adapter.projectionType,
    canAdapt: (projection: unknown, context: PresentationContext): projection is TProjection => {
      if (!canAdapt) {
        return false;
      }

      return canAdapt(projection, context);
    },
    adapt: (projection: unknown, context: PresentationContext) => {
      if (!canAdapt) {
        return {
          ok: false,
          reason: "Presentation adapter is not configured for adaptation.",
        };
      }

      if (!canAdapt(projection, context)) {
        return {
          ok: false,
          reason: "Projection cannot be adapted.",
        };
      }

      return adapter.adapt(projection, context);
    },
  };
}

export class PresentationRegistry {
  private readonly adaptersByCapability = new Map<PresentationCapability, RegisteredPresentationAdapter[]>(
    PRESENTATION_CAPABILITIES.map((capability) => [capability, []]),
  );
  private readonly adaptersById = new Map<string, RegisteredPresentationAdapter>();

  register<TProjection, TViewModel extends PresentationViewModel>(adapter: PresentationAdapter<TProjection, TViewModel>): void {
    const registered = createRegisteredAdapter(adapter);
    this.adaptersById.set(registered.id, registered);

    const existing = this.adaptersByCapability.get(registered.capability) ?? [];
    this.adaptersByCapability.set(registered.capability, [...existing, registered]);
  }

  registerMany<TProjection, TViewModel extends PresentationViewModel>(
    adapters: readonly PresentationAdapter<TProjection, TViewModel>[],
  ): void {
    adapters.forEach((adapter) => this.register(adapter));
  }

  getById(id: string): RegisteredPresentationAdapter | undefined {
    return this.adaptersById.get(id);
  }

  getByCapability(capability: PresentationCapability): readonly RegisteredPresentationAdapter[] {
    return this.adaptersByCapability.get(capability) ?? [];
  }

  getCapabilities(): readonly PresentationCapability[] {
    return PRESENTATION_CAPABILITIES;
  }

  hasCapability(capability: PresentationCapability): boolean {
    return this.getByCapability(capability).length > 0;
  }
}

export const defaultPresentationRegistry = new PresentationRegistry();

defaultPresentationRegistry.register(businessPassportPresenter);
defaultPresentationRegistry.register(documentsPresenter);
defaultPresentationRegistry.register(relationshipPresenter);
defaultPresentationRegistry.register(approvalPresenter);
defaultPresentationRegistry.register(fundingPresenter);
defaultPresentationRegistry.register(aiInsightsPresenter);
defaultPresentationRegistry.register(institutionalTimelinePresenter);
defaultPresentationRegistry.register(workflowPresenter);
