"use client";

import React from "react";
import type { InstitutionalTimelineEvent } from "@/lib/customer/timeline/timeline.types";

function tone(type: InstitutionalTimelineEvent["eventType"]): string {
  if (type.includes("Document")) {
    return "border-sky-700/50 bg-sky-900/25 text-sky-100";
  }

  if (type.includes("Relationship")) {
    return "border-indigo-700/50 bg-indigo-900/25 text-indigo-100";
  }

  if (type.includes("Approval")) {
    return "border-amber-700/50 bg-amber-900/25 text-amber-100";
  }

  if (type.includes("Funding")) {
    return "border-emerald-700/50 bg-emerald-900/25 text-emerald-100";
  }

  return "border-cyan-700/50 bg-cyan-900/25 text-cyan-100";
}

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

export interface TimelineEventProps {
  readonly event: InstitutionalTimelineEvent;
}

export default function TimelineEvent({ event }: TimelineEventProps) {
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">{event.title}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${tone(event.eventType)}`}>
          {event.eventType}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-300">{event.description}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        <span>{formatDateTime(event.occurredAt)}</span>
        {event.actor ? <span>Actor: {event.actor}</span> : null}
      </div>
    </li>
  );
}
