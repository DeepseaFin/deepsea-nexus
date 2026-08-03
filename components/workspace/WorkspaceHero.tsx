"use client";

import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

export default function WorkspaceHero() {
  const context = useWorkspaceContext();

  return (
    <div className="rounded-3xl border border-cyan-600/35 bg-[linear-gradient(180deg,rgba(8,47,73,0.92),rgba(2,6,23,0.98))] p-8 shadow-[0_26px_60px_rgba(8,47,73,0.42)] sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">Recommended Next Action</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{context.hero.title}</h2>
      <p className="mt-2 text-lg text-slate-200">{context.hero.subtitle}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {context.hero.badges.map((badge) => (
          <div key={badge.label} className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{badge.label}</p>
            <p className={`mt-2 text-lg font-semibold ${badge.valueClassName ?? 'text-slate-100'}`}>{badge.value}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-8 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-7 py-3 text-sm font-semibold text-cyan-50"
      >
        {context.hero.primaryAction.label}
      </button>
      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-slate-400">{context.hero.lastActivity}</p>
    </div>
  );
}
