import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";

export interface ProjectionAdapter<
  TProjection,
  TViewModel extends PresentationViewModel = PresentationViewModel,
> extends PresentationAdapter<TProjection, TViewModel> {
  readonly kind: "projection";
  readonly projectionType: string;
}
