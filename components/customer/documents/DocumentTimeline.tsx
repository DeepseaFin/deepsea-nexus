"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { DocumentTimelineEvent } from "@/lib/customer/documents/documents-panel.types";

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

export interface DocumentTimelineProps {
  readonly title: string;
  readonly subtitle: string;
  readonly events: readonly DocumentTimelineEvent[];
}

export default function DocumentTimeline({ title, subtitle, events }: DocumentTimelineProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <ol className="space-y-2.5" aria-label="Document activity timeline">
        {events.map((event) => (
          <li key={event.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{formatDateTime(event.timestamp)}</p>
            <h4 className="mt-1 text-sm font-semibold text-slate-100">{event.title}</h4>
            <p className="mt-1 text-sm text-slate-300">{event.description}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              {event.actor ? <span>Actor: {event.actor}</span> : null}
              {event.relatedDocumentName ? <span>Document: {event.relatedDocumentName}</span> : null}
            </div>
          </li>
        ))}

        {events.length === 0 ? <PanelEmptyState asListItem message="No timeline events available." /> : null}
      </ol>
    </SectionCard>
  );
}
