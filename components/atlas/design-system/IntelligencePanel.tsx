'use client';

import { BrainCircuit } from 'lucide-react';

export type IntelligenceItem = {
  title: string;
  detail: string;
  emphasis?: 'normal' | 'critical';
};

export default function IntelligencePanel({
  title = 'Intelligence Panel',
  items,
}: {
  title?: string;
  items: IntelligenceItem[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
        <BrainCircuit className="h-4 w-4 text-cyan-300" />
        {title}
      </div>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.title}
            className={`rounded-lg border p-3 ${
              item.emphasis === 'critical'
                ? 'border-rose-800/50 bg-rose-950/20'
                : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
