import type { PanelCollectionMetadata } from "@/src/framework/panels/PanelCollectionMetadata";

export interface InstitutionalPanelCollection<T> {
  readonly items: readonly T[];
  readonly totalItems: number;
  readonly metadata: PanelCollectionMetadata;
}