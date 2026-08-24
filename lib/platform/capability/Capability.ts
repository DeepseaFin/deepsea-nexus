import type { CapabilityCategory } from "@/lib/platform/capability/CapabilityCategory";
import type { CapabilityId } from "@/lib/platform/capability/CapabilityId";
import type { CapabilityMetadata } from "@/lib/platform/capability/CapabilityMetadata";
import type { CapabilityStatus } from "@/lib/platform/capability/CapabilityStatus";

export interface Capability {
  readonly capabilityId: CapabilityId;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: CapabilityCategory;
  readonly status: CapabilityStatus;
  readonly version: string;
  readonly metadata: CapabilityMetadata;
}
