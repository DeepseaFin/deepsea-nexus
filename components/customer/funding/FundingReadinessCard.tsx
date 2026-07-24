"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type {
  FundingPanelConfig,
  FundingReadinessModel,
} from "@/lib/customer/funding/funding-panel.types";

function variantForReadiness(state: FundingReadinessModel["state"]): "default" | "warning" | "success" | "info" {
  if (state === "Ready" || state === "Funded") {
    return "success";
  }

  if (state === "On Hold") {
    return "warning";
  }

  if (state === "In Progress") {
    return "info";
  }

  return "default";
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

export interface FundingReadinessCardProps {
  readonly config: FundingPanelConfig;
  readonly readiness: FundingReadinessModel;
}

export default function FundingReadinessCard({ config, readiness }: FundingReadinessCardProps) {
  return (
    <SectionCard title={config.readinessTitle} subtitle={config.readinessSubtitle}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Readiness State</p>
          <div className="mt-1">
            <StatusChip label={readiness.state} variant={variantForReadiness(readiness.state)} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Confidence</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{readiness.confidence}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Trend</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{readiness.trend}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Last Updated</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{formatDateTime(readiness.lastUpdated)}</p>
        </article>
      </div>

      {readiness.notes && readiness.notes.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-300">
          {readiness.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </SectionCard>
  );
}
