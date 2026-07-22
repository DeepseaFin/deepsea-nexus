import type { JourneyProgress as JourneyProgressModel } from "@/lib/journey";

type JourneyProgressProps = {
  progress: JourneyProgressModel;
};

function formatStep(step: string): string {
  return step
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function JourneyProgress({ progress }: JourneyProgressProps) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))] p-5 shadow-[0_14px_28px_rgba(2,6,23,0.2)] sm:p-6" aria-label="Journey progress details">
      <header className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">Journey Progress</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-cyan-200">
          {progress.completionPercentage}%
        </span>
      </header>

      <div className="h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${progress.completionPercentage}%` }} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Completed Steps</p>
          <div className="mt-2 space-y-1">
            {progress.completedSteps.length === 0 ? (
              <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-sm text-slate-400">No completed steps yet.</p>
            ) : (
              progress.completedSteps.map((step) => (
                <p key={step} className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">
                  {formatStep(step)}
                </p>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Remaining Steps</p>
          <div className="mt-2 space-y-1">
            {progress.remainingSteps.length === 0 ? (
              <p className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">No remaining steps.</p>
            ) : (
              progress.remainingSteps.map((step) => (
                <p key={step} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-sm text-slate-300">
                  {formatStep(step)}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {progress.isComplete ? "Journey completed." : "Journey is in progress."}
      </p>
    </section>
  );
}