import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import {
  PRESENTATION_CAPABILITIES,
  type PresentationCapability,
} from "@/lib/presentation/PresentationContext";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import { documentsPresenter } from "@/lib/presentation/presenters/DocumentsPresenter";
import { businessPassportPresenter } from "@/lib/presentation/presenters/BusinessPassportPresenter";

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
