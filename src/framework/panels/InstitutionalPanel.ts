import type { PanelMetadata } from "@/src/framework/panels/PanelMetadata";

export interface InstitutionalPanel<T> {
  readonly items: readonly T[];
  readonly totalItems: number;
  readonly metadata: PanelMetadata;
}