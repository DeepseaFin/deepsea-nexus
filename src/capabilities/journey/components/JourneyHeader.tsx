import type { JourneyState } from "@/lib/journey";

type JourneyHeaderProps = {
  journeyState: JourneyState;
  completionPercentage: number;
};

export default function JourneyHeader({ journeyState, completionPercentage }: JourneyHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / JOURNEY</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">Relationship Journey Workspace</h1>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Journey</p>
            <p className="mt-1 font-semibold text-slate-200">{journeyState.journeyId}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Business</p>
            <p className="mt-1 font-semibold text-slate-200">{journeyState.businessId}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 col-span-2 sm:col-span-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Completion</p>
            <p className="mt-1 font-semibold text-cyan-200">{completionPercentage}%</p>
          </div>
        </div>
      </div>
    </header>
  );
}