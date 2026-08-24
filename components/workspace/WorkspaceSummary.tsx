"use client";

import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

export default function WorkspaceSummary() {
  const context = useWorkspaceContext();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {context.todaySummary.map((item) => (
        <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
          <p className="text-2xl font-semibold leading-none text-slate-100">{item.value}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{item.title}</p>
          <p className="mt-1 text-xs text-slate-500">{item.note}</p>
        </article>
      ))}
    </div>
  );
}
