import { Activity, CircleCheckBig, ShieldCheck, Timer } from "lucide-react";
import type { JourneyState } from "@/lib/journey";

type JourneyHeaderProps = {
  journeyState: JourneyState;
  completionPercentage: number;
};

export default function JourneyHeader({ journeyState, completionPercentage }: JourneyHeaderProps) {
  return (
    <header className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] px-5 py-5 shadow-[0_14px_32px_rgba(2,6,23,0.24)] sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">ATLAS / JOURNEY WORKSPACE</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Relationship Journey Workspace</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Institutional execution console for Business Passport, Evidence, Advisor guidance, and timeline visibility.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 xl:min-w-[24rem]">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Journey</p>
            <p className="mt-1 font-semibold text-slate-200">{journeyState.journeyId}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Business</p>
            <p className="mt-1 font-semibold text-slate-200">{journeyState.businessId}</p>
          </div>
          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 sm:col-span-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Completion</p>
            <p className="mt-1 font-semibold text-cyan-200">{completionPercentage}%</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2 border-t border-slate-800/80 pt-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Confidence
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-200">Placeholder: High</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <CircleCheckBig className="h-3.5 w-3.5 text-cyan-300" /> Evidence Count
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-200">Placeholder: 18 Items</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <Activity className="h-3.5 w-3.5 text-cyan-300" /> Journey Status
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-200">Placeholder: In Review</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500">
            <Timer className="h-3.5 w-3.5 text-cyan-300" /> Last Updated
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-200">Placeholder: 07/13 09:35 UTC</p>
        </article>
      </div>
    </header>
  );
}