import type { PresentationCapability } from "@/lib/presentation/PresentationContext";

export interface PresentationMetadata {
  readonly adapterId: string;
  readonly capability: PresentationCapability;
  readonly projectionType?: string;
  readonly projectionVersion?: string;
  readonly schemaVersion?: string;
  readonly tags?: readonly string[];
  readonly attributes?: Readonly<Record<string, unknown>>;
}
