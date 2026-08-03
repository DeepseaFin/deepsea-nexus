"use client";

import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

export default function WorkspaceResume() {
  const context = useWorkspaceContext();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {context.resumeItems.map((item) => (
        <article key={item.customer} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <h3 className="text-lg font-semibold text-slate-100">{item.customer}</h3>
          <p className="mt-1 text-sm text-slate-300">{item.workstream}</p>

          <div className="mt-5 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Last opened</p>
              <p className="mt-1 text-sm text-slate-300">{item.lastOpened}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Status</p>
              <p className="mt-1 text-sm text-slate-300">{item.status}</p>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-cyan-700/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-500/60 hover:bg-cyan-500/15"
          >
            {item.actionLabel}
          </button>
        </article>
      ))}
    </div>
  );
}
