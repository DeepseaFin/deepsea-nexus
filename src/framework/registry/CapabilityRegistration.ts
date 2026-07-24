import type { CapabilityDescriptor } from "@/src/framework/registry/CapabilityDescriptor";

export interface CapabilityRegistration {
  readonly descriptor: CapabilityDescriptor;
  readonly registeredAt: string;
  readonly version: string;
}