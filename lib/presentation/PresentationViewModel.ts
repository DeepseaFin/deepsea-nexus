import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";
import type { PresentationSection } from "@/lib/presentation/types/PresentationSection";

export interface PresentationViewModel<TSectionItem = unknown> {
  readonly id: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly metadata: PresentationMetadata;
  readonly sections?: readonly PresentationSection<TSectionItem>[];
  readonly payload?: Readonly<Record<string, unknown>>;
}
