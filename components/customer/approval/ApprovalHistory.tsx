"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type {
  ApprovalHistoryEvent,
  ApprovalPanelConfig,
  ApprovalSerializedHistoryEvent,
} from "@/lib/customer/approval/approval-panel.types";

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

function toLabel(value: string): string {
  return value.replace(/_/g, " ");
}

export interface ApprovalHistoryProps {
  readonly config: ApprovalPanelConfig;
  readonly events: readonly (ApprovalHistoryEvent | ApprovalSerializedHistoryEvent)[];
}

export default function ApprovalHistory({ config, events }: ApprovalHistoryProps) {
  return (
    <SectionCard title={config.historyTitle} subtitle={config.historySubtitle}>
      <ol className="space-y-2.5" aria-label="Approval decision history">
        {events.map((event) => (
          <li key={`${event.entry.actorId}-${event.entry.timestamp}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{formatDateTime(event.entry.timestamp)}</p>
            <h4 className="mt-1 text-sm font-semibold text-slate-100">{event.title}</h4>
            <p className="mt-1 text-sm text-slate-300">{event.description}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              <span>Actor: {event.actorName}</span>
              <span>Stage: {event.entry.stage.toString()}</span>
              <span>Decision: {toLabel(event.entry.decision)}</span>
            </div>
            {event.entry.comment ? <p className="mt-2 text-xs text-slate-400">{event.entry.comment}</p> : null}
          </li>
        ))}

        {events.length === 0 ? <PanelEmptyState asListItem message="No history events provided." /> : null}
      </ol>
    </SectionCard>
  );
}
