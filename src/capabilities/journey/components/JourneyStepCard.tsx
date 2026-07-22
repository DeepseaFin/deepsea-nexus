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
    <section className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.9))] p-5 shadow-[0_14px_28px_rgba(2,6,23,0.2)] sm:p-6" aria-label="Current journey step">
      <header className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">Active Step</h2>
        <span className="rounded-full border border-cyan-700/40 bg-cyan-950/25 px-2 py-0.5 text-xs text-cyan-200">
          {journeyState.status}
        </span>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Current Stage</p>
        <p className="mt-1 text-xl font-semibold text-slate-100">{formatStep(journeyState.currentStep)}</p>
        <p className="mt-2 text-sm text-slate-300">
          Last updated: <span className="text-slate-200">{journeyState.lastUpdated}</span>
        </p>
      </div>
    </section>
  );
}