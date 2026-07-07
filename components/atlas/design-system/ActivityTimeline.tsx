'use client';

import { Clock4 } from 'lucide-react';

export type TimelineEvent = {
  time: string;
  title: string;
  detail?: string;
};

export default function ActivityTimeline({
  title = 'Activity Feed',
  events,
}: {
  title?: string;
  events: TimelineEvent[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <div className="mt-3 space-y-2">
        {events.map((item, idx) => (
          <div key={`${item.time}-${idx + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock4 className="h-3.5 w-3.5 text-cyan-300" />
              {item.time}
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-100">{item.title}</p>
            {item.detail ? <p className="mt-1 text-xs text-slate-400">{item.detail}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
