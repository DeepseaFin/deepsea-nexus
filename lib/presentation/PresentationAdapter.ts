import type { PresentationContext, PresentationCapability } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";

export interface PresentationAdapter<
  TProjection,
  TViewModel extends PresentationViewModel = PresentationViewModel,
> {
  readonly id: string;
  readonly capability: PresentationCapability;
  readonly projectionType?: string;
  canAdapt?: (projection: unknown, context: PresentationContext) => projection is TProjection;
  adapt: (
    projection: TProjection,
    context: PresentationContext,
  ) => PresentationResult<TViewModel> | Promise<PresentationResult<TViewModel>>;
}
