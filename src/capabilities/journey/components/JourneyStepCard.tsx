import type { JourneyState } from "@/lib/journey";

type JourneyStepCardProps = {
  journeyState: JourneyState;
};

function formatStep(step: string): string {
  return step
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function JourneyStepCard({ journeyState }: JourneyStepCardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Active Step</h2>
        <span className="rounded-full border border-cyan-700/40 bg-cyan-950/25 px-2 py-0.5 text-xs text-cyan-200">
          {journeyState.status}
        </span>
      </header>

      <div className="rounded border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Current Stage</p>
        <p className="mt-1 text-xl font-semibold text-slate-100">{formatStep(journeyState.currentStep)}</p>
        <p className="mt-2 text-sm text-slate-300">
          Last updated: <span className="text-slate-200">{journeyState.lastUpdated}</span>
        </p>
      </div>
    </section>
  );
}