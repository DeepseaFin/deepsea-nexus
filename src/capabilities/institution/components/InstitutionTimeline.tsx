import type { InstitutionTimelineItem } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionTimelineProps = {
  readonly timeline: readonly InstitutionTimelineItem[];
};

export default function InstitutionTimeline({ timeline }: InstitutionTimelineProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Institution Timeline</h2>
      <div className="mt-3 space-y-2">
        {timeline.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
              </div>
              <p className="text-xs text-slate-500">{item.timestamp}</p>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-cyan-300">{item.actor}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
