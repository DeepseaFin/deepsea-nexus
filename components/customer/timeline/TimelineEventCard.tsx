"use client";

import { memo } from "react";
import StatusBadge from "@/components/customer/shared/StatusBadge";
import type { RelationshipTimelineEventType, RelationshipTimelineEventViewModel } from "@/lib/customer/RelationshipTimelineViewModel";

export interface TimelineEventCardProps {
  readonly event: RelationshipTimelineEventViewModel;
  readonly businessDomain: "corporate" | "financial" | "trade" | "compliance" | "operations";
  readonly relatedDocument?: string;
  readonly relatedEvidence?: string;
}

function toLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
}

function toTone(type: RelationshipTimelineEventType): "neutral" | "success" | "warning" | "danger" | "info" {
  if (type === "readiness-updated") {
    return "warning";
  }

  if (type === "relationship-confidence-updated") {
    return "info";
  }

  if (type === "document-received" || type === "document-processed") {
    return "success";
  }

  if (type === "outstanding-actions") {
    return "danger";
  }

  return "neutral";
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

function TimelineEventCard({
  event,
  businessDomain,
  relatedDocument,
  relatedEvidence,
}: TimelineEventCardProps) {
  return (
    <li className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-400/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">{event.title}</p>
        <div className="flex items-start gap-2">
          <StatusBadge label={toLabel(event.type)} tone={toTone(event.type)} />
          <StatusBadge label={toLabel(businessDomain)} tone="neutral" />
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-300">{event.description}</p>

      <div className="mt-3 grid gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500 sm:grid-cols-3">
        <span>{formatDateTime(event.occurredAt)}</span>
        <span>{relatedDocument ? `Document: ${relatedDocument}` : "Document: N/A"}</span>
        <span>{relatedEvidence ? `Evidence: ${relatedEvidence}` : "Evidence: N/A"}</span>
      </div>
    </li>
  );
}

const MemoizedTimelineEventCard = memo(TimelineEventCard);
MemoizedTimelineEventCard.displayName = "TimelineEventCard";

export default MemoizedTimelineEventCard;
