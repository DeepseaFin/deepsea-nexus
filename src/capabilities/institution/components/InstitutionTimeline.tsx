import type { InstitutionTimelineItem } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionTimelineProps = {
  readonly timeline: readonly InstitutionTimelineItem[];
};

export default function InstitutionTimeline({ timeline }: InstitutionTimelineProps) {
  if (timeline.length === 0) {
    return (
      <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Institution Timeline</h2>
        <p className="mt-3 rounded border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-400">
          No institutional memory events are available for the current context.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-100">Institution Timeline</h2>
        <span className="rounded-full border border-cyan-900/40 bg-cyan-950/20 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.12em] text-cyan-200">
          {timeline.length} Events
        </span>
      </header>

      <div className="relative mt-2 space-y-2">
        {timeline.map((item) => (
          <article key={item.id} className="relative rounded border border-slate-800 bg-slate-950/60 p-3 pl-5">
            <span className="absolute left-2 top-3 h-2 w-2 rounded-full bg-cyan-400" aria-hidden="true" />
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">{item.actor}</p>
                <p className="text-xs text-slate-400">{item.detail}</p>
              </div>
              <p className="shrink-0 text-xs text-slate-500">{item.timestamp}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
