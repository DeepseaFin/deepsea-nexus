"use client";

import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

export default function WorkspaceCommandCenter() {
  const context = useWorkspaceContext();

  return (
    <>
      <p className="text-sm text-slate-400">{context.commandCenter.subtitle}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {context.commandCenter.items.map((item) => (
          <article
            key={item.title}
            className="flex min-h-[188px] flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-6 transition hover:-translate-y-0.5 hover:border-cyan-600/50 hover:shadow-[0_10px_26px_rgba(8,47,73,0.32)]"
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="text-4xl font-semibold leading-none text-slate-50">{item.count}</p>
              <p className="text-sm text-slate-400">{item.status}</p>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center justify-center self-start rounded-full border border-cyan-700/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-500/60 hover:bg-cyan-500/15"
            >
              {item.ctaLabel}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-700/30 bg-[linear-gradient(180deg,rgba(8,47,73,0.74),rgba(2,6,23,0.96))] p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Priority Focus</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50">{context.commandCenter.priorityFocus.customer}</h3>
        <p className="mt-2 text-sm text-slate-300">Stage</p>
        <p className="text-base font-medium text-slate-100">{context.commandCenter.priorityFocus.stage}</p>
        <p className="mt-3 text-sm text-slate-300">Next Task</p>
        <p className="text-base font-medium text-slate-100">{context.commandCenter.priorityFocus.nextTask}</p>

        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
        >
          {context.commandCenter.priorityFocus.actionLabel}
        </button>
      </div>
    </>
  );
}