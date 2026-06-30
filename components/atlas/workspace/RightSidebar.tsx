"use client";

import DealHealth from "./DealHealth";

const actions = [
  "Generate Term Sheet",
  "Funding Memo",
  "Credit Memo",
  "AI Summary",
];

export default function RightSidebar() {
  return (
    <div className="space-y-4">
      <DealHealth />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <p className="mt-1 text-sm text-slate-400">Accelerate the next decision step</p>
        </div>

        <div className="grid gap-3">
          {actions.map((action) => (
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
