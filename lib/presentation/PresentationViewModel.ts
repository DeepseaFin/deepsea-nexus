import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";
import type { PresentationSection } from "@/lib/presentation/types/PresentationSection";

export interface PresentationViewModel {
  readonly id: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly metadata: PresentationMetadata;
  readonly sections?: readonly PresentationSection[];
  readonly payload?: Readonly<Record<string, unknown>>;
}
