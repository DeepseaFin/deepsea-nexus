type CustomerOnboardingFooterProps = {
  readonly isPaused: boolean;
  readonly isCompleted: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onCompleteStep: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
};

export default function CustomerOnboardingFooter({
  isPaused,
  isCompleted,
  onPrevious,
  onNext,
  onCompleteStep,
  onPause,
  onResume,
}: CustomerOnboardingFooterProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <button type="button" onClick={onPrevious} disabled={isCompleted} className="rounded border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-medium text-slate-200 disabled:opacity-50">Previous</button>
        <button type="button" onClick={onNext} disabled={isCompleted || isPaused} className="rounded border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-sm font-medium text-cyan-100 disabled:opacity-50">Next</button>
        <button type="button" onClick={onCompleteStep} disabled={isCompleted || isPaused} className="rounded border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-sm font-medium text-emerald-100 disabled:opacity-50">Complete Step</button>
        <button type="button" onClick={onPause} disabled={isPaused || isCompleted} className="rounded border border-amber-700/40 bg-amber-950/20 px-3 py-2 text-sm font-medium text-amber-100 disabled:opacity-50">Pause</button>
        <button type="button" onClick={onResume} disabled={!isPaused || isCompleted} className="rounded border border-violet-700/40 bg-violet-950/20 px-3 py-2 text-sm font-medium text-violet-100 disabled:opacity-50">Resume</button>
      </div>
    </section>
  );
}
