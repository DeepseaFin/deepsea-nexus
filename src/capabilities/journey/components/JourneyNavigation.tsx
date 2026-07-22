type JourneyNavigationProps = {
  isPaused: boolean;
  isCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPause: () => void;
  onResume: () => void;
  onCompleteStep: () => void;
};

export default function JourneyNavigation({
  isPaused,
  isCompleted,
  onPrevious,
  onNext,
  onPause,
  onResume,
  onCompleteStep,
}: JourneyNavigationProps) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))] p-5 shadow-[0_14px_28px_rgba(2,6,23,0.2)] sm:p-6" aria-label="Journey navigation controls">
      <header className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">Journey Navigation</h2>
      </header>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isCompleted}
          aria-label="Go to previous journey step"
          className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isCompleted || isPaused}
          aria-label="Go to next journey step"
          className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 disabled:opacity-50"
        >
          Next
        </button>

        <button
          type="button"
          onClick={onCompleteStep}
          disabled={isCompleted || isPaused}
          aria-label="Mark current step as complete"
          className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 px-3 py-2 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 disabled:opacity-50"
        >
          Complete Step
        </button>

        <button
          type="button"
          onClick={onPause}
          disabled={isPaused || isCompleted}
          aria-label="Pause journey progression"
          className="rounded-xl border border-amber-700/40 bg-amber-950/20 px-3 py-2 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 disabled:opacity-50"
        >
          Pause
        </button>

        <button
          type="button"
          onClick={onResume}
          disabled={!isPaused || isCompleted}
          aria-label="Resume journey progression"
          className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 disabled:opacity-50"
        >
          Resume
        </button>
      </div>
    </section>
  );
}