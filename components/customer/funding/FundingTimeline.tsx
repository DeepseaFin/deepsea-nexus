"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { FundingPanelConfig, FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";

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

export interface FundingTimelineProps {
  readonly config: FundingPanelConfig;
  readonly events: FundingPanelModel["timeline"];
}

export default function FundingTimeline({ config, events }: FundingTimelineProps) {
  return (
    <SectionCard title={config.timelineTitle} subtitle={config.timelineSubtitle}>
      <ol className="space-y-2.5" aria-label="Funding timeline events">
        {events.map((event) => (
          <li key={event.eventId} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{formatDateTime(event.occurredAt)}</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{event.metadata.eventLabel ?? event.type}</p>
            <p className="mt-1 text-sm text-slate-300">{event.message}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              <span>Actor: {event.actorId}</span>
              <span>Type: {event.type}</span>
            </div>
          </li>
        ))}

        {events.length === 0 ? <PanelEmptyState asListItem message="No timeline events provided." /> : null}
      </ol>
    </SectionCard>
  );
}
