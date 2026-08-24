"use client";

import React from "react";
import StatusChip from "@/components/ui/StatusChip";
import type { EvidenceOverviewModel } from "@/lib/application/WorkspaceIntelligence";

export interface EvidenceTimelineItemProps {
  readonly item: EvidenceOverviewModel["timeline"][number];
}

function statusVariant(status: string): "default" | "success" | "warning" | "danger" | "info" {
  const normalized = status.toLowerCase();

  if (normalized.includes("valid") || normalized.includes("verified")) {
    return "success";
  }

  if (normalized.includes("pending") || normalized.includes("processing")) {
    return "warning";
  }

  if (normalized.includes("invalid") || normalized.includes("rejected")) {
    return "danger";
  }

  return "info";
}

function formatDate(value: string): string {
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

export default function EvidenceTimelineItem({ item }: EvidenceTimelineItemProps) {
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">Source: {item.source}</p>
        <StatusChip label={item.verificationStatus} variant={statusVariant(item.verificationStatus)} />
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        <span>Received: {formatDate(item.evidenceReceivedDate)}</span>
        {item.supportingBusinessCapability ? <span>Capability: {item.supportingBusinessCapability}</span> : null}
        {item.expiryDate ? <span>Expiry: {formatDate(item.expiryDate)}</span> : null}
      </div>

      <p className="mt-2 text-sm text-slate-300">Most recent activity: {item.mostRecentActivity}</p>
    </li>
  );
}
