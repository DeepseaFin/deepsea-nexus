import type { Capability } from "@/lib/platform/capability/Capability";
import type { CapabilityCategory } from "@/lib/platform/capability/CapabilityCategory";
import type { CapabilityId } from "@/lib/platform/capability/CapabilityId";
import type { CapabilityMetadata } from "@/lib/platform/capability/CapabilityMetadata";
import type { CapabilityStatus } from "@/lib/platform/capability/CapabilityStatus";

export interface CreateCapabilityInput {
  readonly capabilityId: CapabilityId;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: CapabilityCategory;
  readonly status: CapabilityStatus;
  readonly version: string;
  readonly metadata: CapabilityMetadata;
}

export interface CapabilityService {
  create(input: CreateCapabilityInput): Promise<Capability>;
  get(capabilityId: CapabilityId): Promise<Capability | null>;
  listByCategory(category: CapabilityCategory): Promise<readonly Capability[]>;
  listByStatus(status: CapabilityStatus): Promise<readonly Capability[]>;
}
