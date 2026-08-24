"use client";

import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

const priorityClassNames: Record<string, string> = {
  HIGH: 'border-rose-700/40 bg-rose-900/30 text-rose-200',
  MEDIUM: 'border-amber-700/40 bg-amber-900/30 text-amber-200',
  LOW: 'border-slate-700/40 bg-slate-900/40 text-slate-200',
  TODAY: 'border-cyan-700/40 bg-cyan-900/30 text-cyan-200',
};

export default function WorkspaceMyWork() {
  const context = useWorkspaceContext();

  return (
    <>
      <p className="text-sm text-slate-400">{context.myWork.subtitle}</p>

      <div className="mt-5 grid gap-4 xl:grid-cols-4">
        {context.myWork.items.map((item) => (
          <article key={item.title} className="flex min-h-[172px] flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-700/45 hover:bg-slate-900/70">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${priorityClassNames[item.priority] ?? priorityClassNames.LOW}`}>
                  {item.priority}
                </span>
              </div>

              <p className="text-base font-medium text-slate-200">{item.description}</p>
              <p className="text-xs text-slate-400">{item.secondaryText}</p>
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
    </>
  );
}
