import type { CapabilityDescriptor } from "@/src/framework/registry/CapabilityDescriptor";
import type { CapabilityRegistryBuildResult } from "@/src/framework/registry/CapabilityRegistryBuildResult";

export interface CapabilityRegistryBuilder<TRegistry> {
  withDescriptor(descriptor: CapabilityDescriptor): CapabilityRegistryBuilder<TRegistry>;
  build(): CapabilityRegistryBuildResult<TRegistry>;
}