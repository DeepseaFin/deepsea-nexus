import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import {
  PRESENTATION_CAPABILITIES,
  type PresentationCapability,
} from "@/lib/presentation/PresentationContext";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import { aiInsightsPresenter } from "@/lib/presentation/presenters/AiInsightsPresenter";
import { fundingPresenter } from "@/lib/presentation/presenters/FundingPresenter";
import { approvalPresenter } from "@/lib/presentation/presenters/ApprovalPresenter";
import { documentsPresenter } from "@/lib/presentation/presenters/DocumentsPresenter";
import { businessPassportPresenter } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import { relationshipPresenter } from "@/lib/presentation/presenters/RelationshipPresenter";
import { institutionalTimelinePresenter } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import { workflowPresenter } from "@/lib/presentation/presenters/WorkflowPresenter";

export type RegisteredPresentationAdapter = PresentationAdapter<unknown, PresentationViewModel>;

export class PresentationRegistry {
  private readonly adaptersByCapability = new Map<PresentationCapability, RegisteredPresentationAdapter[]>(
    PRESENTATION_CAPABILITIES.map((capability) => [capability, []]),
  );
  private readonly adaptersById = new Map<string, RegisteredPresentationAdapter>();

  register(adapter: RegisteredPresentationAdapter): void {
    this.adaptersById.set(adapter.id, adapter);

    const existing = this.adaptersByCapability.get(adapter.capability) ?? [];
    this.adaptersByCapability.set(adapter.capability, [...existing, adapter]);
  }

  registerMany(adapters: readonly RegisteredPresentationAdapter[]): void {
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
