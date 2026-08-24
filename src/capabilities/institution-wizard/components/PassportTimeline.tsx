import PassportTimelineItem from "@/src/capabilities/institution-wizard/components/PassportTimelineItem";
import type { PassportTimeline as PassportTimelineModel } from "@/src/capabilities/institution-wizard/types/PassportTimeline";

type PassportTimelineProps = {
  timeline: PassportTimelineModel;
};

export default function PassportTimeline({ timeline }: PassportTimelineProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Business Passport Timeline</h3>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
          {timeline.items.length} Events
        </span>
      </header>

      <div className="space-y-2">
        {timeline.items.map((item) => (
          <PassportTimelineItem key={`${item.timestamp}-${item.event}`} item={item} />
        ))}
      </div>
    </section>
  );
}