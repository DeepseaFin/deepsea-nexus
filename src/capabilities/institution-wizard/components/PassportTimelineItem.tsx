import type { PassportTimelineItem as PassportTimelineItemModel } from "@/src/capabilities/institution-wizard/types/PassportTimelineItem";

type PassportTimelineItemProps = {
  item: PassportTimelineItemModel;
};

export default function PassportTimelineItem({ item }: PassportTimelineItemProps) {
  return (
    <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-100">{item.event}</p>
          <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
        </div>
        <p className="text-xs text-slate-500 sm:text-right">{item.timestamp}</p>
      </div>
    </article>
  );
}