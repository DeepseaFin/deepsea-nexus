import type { CapabilityMetadata } from "@/src/framework/registry/CapabilityMetadata";

export interface CapabilityDescriptor {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly version: string;
  readonly metadata: CapabilityMetadata;
}