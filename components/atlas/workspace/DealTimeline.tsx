"use client";

import { useDeal } from '@/components/atlas/common/DealContext';

export default function DealTimeline() {
  const { deal } = useDeal();

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Deal Timeline</h2>
        <p className="mt-1 text-sm text-slate-400">
          Initialized case activity for the current workspace
        </p>
      </div>

      <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
        {deal.timeline.map((event, index) => {
          const isCompleted = event.status === 'completed';
          const isCurrent = event.status === 'current';

          return (
            <div key={`${event.time}-${event.title}`} className="relative pl-6">
              {index < deal.timeline.length - 1 ? (
                <div
                  className={`absolute left-[7px] top-6 h-full w-px ${
                    isCompleted ? 'bg-emerald-500/60' : isCurrent ? 'bg-amber-500/60' : 'bg-slate-700'
                  }`}
                />
              ) : null}

              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500'
                      : isCurrent
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-slate-600 bg-slate-700'
                  }`}
                />

                <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">{event.time}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : isCurrent
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-slate-700/80 text-slate-400'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{event.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
