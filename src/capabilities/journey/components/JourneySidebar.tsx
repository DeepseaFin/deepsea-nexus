import { JourneyStatus, JourneyStep } from "@/lib/journey";

type JourneySidebarProps = {
  steps: readonly JourneyStep[];
  currentStep: JourneyStep;
  completedSteps: readonly JourneyStep[];
  status: JourneyStatus;
};

function formatStep(step: JourneyStep): string {
  return step
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function JourneySidebar({ steps, currentStep, completedSteps, status }: JourneySidebarProps) {
  const completedSet = new Set(completedSteps);

  return (
    <aside className="space-y-2">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">Journey Steps</h2>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-slate-300">
            {status}
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {steps.map((step, index) => {
            const isCurrent = step === currentStep;
            const isCompleted = completedSet.has(step);

            return (
              <article
                key={step}
                className={`rounded border px-3 py-2 text-sm ${
                  isCurrent
                    ? "border-cyan-700/70 bg-cyan-950/25 text-cyan-100"
                    : isCompleted
                      ? "border-emerald-700/40 bg-emerald-950/20 text-emerald-200"
                      : "border-slate-800 bg-slate-950/70 text-slate-300"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.14em] opacity-80">Step {index + 1}</p>
                <p className="mt-1 font-medium">{formatStep(step)}</p>
              </article>
            );
          })}
        </div>
      </section>
    </aside>
  );
}