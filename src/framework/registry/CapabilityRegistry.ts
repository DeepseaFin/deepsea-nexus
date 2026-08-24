import type { CapabilityDescriptor } from "@/src/framework/registry/CapabilityDescriptor";

export interface CapabilityRegistry {
  register(descriptor: CapabilityDescriptor): void;
  unregister(id: string): void;
  findById(id: string): CapabilityDescriptor | undefined;
  list(): readonly CapabilityDescriptor[];
}