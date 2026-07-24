"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type {
  RelationshipHealthModel,
  RelationshipPanelConfig,
} from "@/lib/customer/relationship/relationship-panel.types";

function statusVariant(status: string): "success" | "warning" | "danger" | "info" | "default" {
  const normalized = status.toLowerCase();

  if (normalized.includes("stable") || normalized.includes("strong") || normalized.includes("healthy")) {
    return "success";
  }

  if (normalized.includes("risk") || normalized.includes("weak") || normalized.includes("critical")) {
    return "danger";
  }

  if (normalized.includes("watch") || normalized.includes("moderate")) {
    return "warning";
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

export interface RelationshipHealthCardProps {
  readonly config: RelationshipPanelConfig;
  readonly health: RelationshipHealthModel;
}

export default function RelationshipHealthCard({ config, health }: RelationshipHealthCardProps) {
  return (
    <SectionCard title={config.healthTitle} subtitle={config.healthSubtitle}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Score</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">{health.score}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Status</p>
          <div className="mt-1">
            <StatusChip label={health.status} variant={statusVariant(health.status)} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Confidence</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{health.confidence}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Trend</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{health.trend}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Last Updated</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{formatDate(health.lastUpdated)}</p>
        </article>
      </div>
    </SectionCard>
  );
}
