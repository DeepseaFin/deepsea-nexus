import type { JourneyTimelineEvent } from "@/lib/journey";

type JourneyTimelineProps = {
  timeline: readonly JourneyTimelineEvent[];
};

export default function JourneyTimeline({ timeline }: JourneyTimelineProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Journey Timeline</h2>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
          {timeline.length} Events
        </span>
      </header>

      <div className="space-y-2">
        {timeline.map((item) => (
          <article key={`${item.timestamp}-${item.event}`} className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-100">{item.event}</p>
                <p className="text-xs text-slate-400">{item.notes}</p>
              </div>
              <div className="text-xs text-slate-400 sm:text-right">
                <p>{item.timestamp}</p>
                <p>{item.performedBy}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}