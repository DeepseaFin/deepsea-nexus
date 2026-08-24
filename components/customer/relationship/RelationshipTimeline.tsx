"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipPanelConfig,
  RelationshipPanelModel,
} from "@/lib/customer/relationship/relationship-panel.types";

function formatDateTime(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface RelationshipTimelineProps {
  readonly config: RelationshipPanelConfig;
  readonly timeline: RelationshipPanelModel["timeline"];
}

export default function RelationshipTimeline({ config, timeline }: RelationshipTimelineProps) {
  return (
    <SectionCard title={config.timelineTitle} subtitle={config.timelineSubtitle}>
      <ol className="space-y-2.5" aria-label="Relationship interaction timeline">
        {timeline.map((event) => (
          <li key={event.interactionId} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{formatDateTime(event.occurredAt)}</p>
            <h4 className="mt-1 text-sm font-semibold text-slate-100">{event.subject}</h4>
            <p className="mt-1 text-sm capitalize text-slate-300">Type: {event.interactionType.replace(/_/g, " ")}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              <span>Status: {event.status.replace(/_/g, " ")}</span>
              <span>Participants: {event.participants.length}</span>
            </div>
          </li>
        ))}

        {timeline.length === 0 ? <PanelEmptyState asListItem message="No relationship events provided." /> : null}
      </ol>
    </SectionCard>
  );
}
