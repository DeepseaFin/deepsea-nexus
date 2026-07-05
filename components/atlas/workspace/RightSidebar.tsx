"use client";

import { useDeal } from '@/components/atlas/common/DealContext';
import DealHealth from "./DealHealth";

const placeholders = [
  { label: 'Intelligence', value: 'Placeholder', note: 'No automated intelligence logic yet' },
  { label: 'Credit', value: 'Pending', note: 'Awaiting case review' },
  { label: 'Legal', value: 'Pending', note: 'Awaiting evidence closure' },
  { label: 'Fraud', value: 'Pending', note: 'No detection logic implemented' },
];

export default function RightSidebar() {
  const { deal } = useDeal();

  return (
    <div className="space-y-4">
      <DealHealth />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Intelligence Placeholders</h3>
          <p className="mt-1 text-sm text-slate-400">Case-level intelligence context for the current workflow</p>
        </div>

        <div className="space-y-3">
          {placeholders.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                  {item.value}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.note}</p>
            </div>
          ))}

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-sm text-slate-300">
            Current Case: <span className="font-semibold text-white">{deal.deal.dealName}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <p className="mt-1 text-sm text-slate-400">Accelerate the next decision step</p>
        </div>

        <div className="grid gap-3">
          {['Generate Term Sheet', 'Funding Memo', 'Credit Memo', 'AI Summary'].map((action) => (
            <button
              key={action}
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-800"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
