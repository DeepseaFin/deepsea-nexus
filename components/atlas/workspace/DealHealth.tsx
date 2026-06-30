"use client";

import { sampleHealth } from "../../../atlas-core/health/sampleHealth";

const scoreColor = sampleHealth.status === "ready" ? "from-emerald-500 to-cyan-500" : sampleHealth.status === "review" ? "from-amber-500 to-orange-500" : "from-rose-500 to-red-500";

export default function DealHealth() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Deal Health</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Deal Health</h2>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
          READY TO FUND
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">Overall Score</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-5xl font-semibold text-white">{sampleHealth.score}</span>
              <span className="pb-1 text-sm text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="w-full max-w-[260px]">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">Health Index</span>
              <span className="font-semibold text-slate-200">{sampleHealth.score}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div className={`h-full rounded-full bg-gradient-to-r ${scoreColor}`} style={{ width: `${sampleHealth.score}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Strengths</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {sampleHealth.strengths.map((strength) => (
              <li key={strength} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Risks</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {sampleHealth.risks.map((risk) => (
              <li key={risk} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Recommendation</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{sampleHealth.recommendation}</p>
      </div>
    </div>
  );
}
