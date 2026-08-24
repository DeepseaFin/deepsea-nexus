'use client';

import React from 'react';
import SectionCard from './SectionCard';

interface ExecutiveVerdictProps {
  title: string;
  overallReadiness: number;
  recommendation: string;
  riskLevel: string;
  criticalBlockers: string[];
  estimatedFundingTime: string;
}

const ExecutiveVerdict: React.FC<ExecutiveVerdictProps> = ({
  title,
  overallReadiness,
  recommendation,
  riskLevel,
  criticalBlockers,
  estimatedFundingTime,
}) => {
  return (
    <SectionCard title={title} className="relative overflow-hidden border-cyan-900/40 bg-slate-950/70">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_40%)]" />

      <div className="relative space-y-6">
        <div className="rounded-xl border border-cyan-700/30 bg-slate-900/70 p-6 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            ATLAS Executive Verdict
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl lg:text-4xl">
            {recommendation}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Overall Readiness</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">{overallReadiness}%</p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Risk Level</p>
            <div className="mt-2">
              <span className="inline-flex rounded-full border border-cyan-700/40 bg-cyan-900/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                {riskLevel}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 sm:col-span-2 lg:col-span-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">Estimated Funding Time</p>
            <p className="mt-2 text-xl font-semibold text-slate-100">{estimatedFundingTime}</p>
          </div>
        </div>

        <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-300/90">Critical Blockers</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200 marker:text-rose-300">
            {criticalBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
};

export default ExecutiveVerdict;
