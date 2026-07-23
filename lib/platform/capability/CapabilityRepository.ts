import type { Capability } from "@/lib/platform/capability/Capability";
import type { CapabilityCategory } from "@/lib/platform/capability/CapabilityCategory";
import type { CapabilityId } from "@/lib/platform/capability/CapabilityId";
import type { CapabilityStatus } from "@/lib/platform/capability/CapabilityStatus";

export interface CapabilityRepository {
  findById(capabilityId: CapabilityId): Promise<Capability | null>;
  save(capability: Capability): Promise<void>;
  listByCategory(category: CapabilityCategory): Promise<readonly Capability[]>;
  listByStatus(status: CapabilityStatus): Promise<readonly Capability[]>;
}
