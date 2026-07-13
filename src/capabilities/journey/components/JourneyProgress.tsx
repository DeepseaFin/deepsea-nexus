import { JourneyStep } from "@/lib/journey";

type JourneyProgressProps = {
  steps: readonly JourneyStep[];
  completedSteps: readonly JourneyStep[];
  completionPercentage: number;
};

function formatStep(step: JourneyStep): string {
  return step
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function JourneyProgress({ steps, completedSteps, completionPercentage }: JourneyProgressProps) {
  const remainingSteps = steps.filter((step) => !completedSteps.includes(step));

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Journey Progress</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-cyan-200">
          {completionPercentage}%
        </span>
      </header>

      <div className="h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${completionPercentage}%` }} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Completed Steps</p>
          <div className="mt-2 space-y-1">
            {completedSteps.map((step) => (
              <p key={step} className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">
                {formatStep(step)}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Remaining Steps</p>
          <div className="mt-2 space-y-1">
            {remainingSteps.map((step) => (
              <p key={step} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-sm text-slate-300">
                {formatStep(step)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}