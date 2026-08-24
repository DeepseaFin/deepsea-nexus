"use client";

import { useDeal } from '@/components/atlas/common/DealContext';

export default function TaskPanel() {
  const { deal } = useDeal();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white">Task List</h2>
      <p className="mt-2 text-sm text-slate-400">Initialized with the current case.</p>

      <div className="mt-4 space-y-3">
        {deal.tasks.map((task) => (
          <div key={`${task.title}-${task.owner}`} className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">{task.title}</p>
              <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                {task.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{task.description}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Owner: {task.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
