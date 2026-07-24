import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";

export interface PresentationSuccess<TViewModel extends PresentationViewModel> {
  readonly ok: true;
  readonly viewModel: TViewModel;
  readonly warnings?: readonly string[];
}

export interface PresentationFailure {
  readonly ok: false;
  readonly reason: string;
  readonly issues?: readonly string[];
}

export type PresentationResult<TViewModel extends PresentationViewModel> =
  | PresentationSuccess<TViewModel>
  | PresentationFailure;
