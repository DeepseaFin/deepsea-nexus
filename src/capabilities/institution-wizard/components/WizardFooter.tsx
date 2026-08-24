type WizardFooterProps = {
  currentStepId: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isNextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function WizardFooter({
  currentStepId,
  totalSteps,
  isFirstStep,
  isLastStep,
  isNextDisabled,
  onPrevious,
  onNext,
}: WizardFooterProps) {
  return (
    <footer className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300">
          Step {currentStepId} of {totalSteps}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirstStep}
            className="rounded border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-medium text-slate-200 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={isLastStep || isNextDisabled}
            className="rounded border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-sm font-medium text-cyan-100 disabled:opacity-50"
          >
            {isLastStep ? "Completed" : "Next"}
          </button>
        </div>
      </div>
    </footer>
  );
}