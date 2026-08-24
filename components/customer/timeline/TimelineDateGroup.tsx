"use client";

import { memo } from "react";
import TimelineEventCard from "@/components/customer/timeline/TimelineEventCard";
import type { RelationshipTimelineEventViewModel } from "@/lib/customer/RelationshipTimelineViewModel";

export interface TimelineDateGroupItem {
  readonly event: RelationshipTimelineEventViewModel;
  readonly businessDomain: "corporate" | "financial" | "trade" | "compliance" | "operations";
  readonly relatedDocument?: string;
  readonly relatedEvidence?: string;
}

export interface TimelineDateGroupProps {
  readonly dateLabel: string;
  readonly items: readonly TimelineDateGroupItem[];
}

function TimelineDateGroup({ dateLabel, items }: TimelineDateGroupProps) {
  return (
    <section className="space-y-2" aria-label={`Timeline events for ${dateLabel}`}>
      <div className="sticky top-0 z-10 rounded-lg border border-slate-800 bg-slate-900/85 px-3 py-2 backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">{dateLabel}</p>
      </div>
      <ol className="space-y-2.5">
        {items.map((item) => (
          <TimelineEventCard
            key={item.event.id}
            event={item.event}
            businessDomain={item.businessDomain}
            relatedDocument={item.relatedDocument}
            relatedEvidence={item.relatedEvidence}
          />
        ))}
      </ol>
    </section>
  );
}

const MemoizedTimelineDateGroup = memo(TimelineDateGroup);
MemoizedTimelineDateGroup.displayName = "TimelineDateGroup";

export default MemoizedTimelineDateGroup;
