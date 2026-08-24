import type { CommercialTimelineItem } from "@/src/capabilities/commercial/types/CommercialWorkspaceState";

type CommercialTimelineProps = {
  readonly timeline: readonly CommercialTimelineItem[];
};

export default function CommercialTimeline({ timeline }: CommercialTimelineProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Commercial Timeline</h2>
      <div className="mt-3 space-y-2">
        {timeline.map((entry) => (
          <article key={entry.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">{entry.event}</p>
                <p className="mt-1 text-xs text-slate-400">{entry.detail}</p>
              </div>
              <p className="text-xs text-slate-500">{entry.timestamp}</p>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-300">{entry.actor}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
