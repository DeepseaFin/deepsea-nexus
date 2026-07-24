"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { CustomerHealthItem, WorkflowPanelConfig } from "@/lib/customer/workflow/workflow.types";

function statusVariant(status: string): "default" | "success" | "warning" | "danger" | "info" {
  const normalized = status.toLowerCase();

  if (normalized.includes("strong") || normalized.includes("stable")) {
    return "success";
  }

  if (normalized.includes("attention") || normalized.includes("review")) {
    return "warning";
  }

  if (normalized.includes("blocked") || normalized.includes("critical")) {
    return "danger";
  }

  if (normalized.includes("progress") || normalized.includes("active")) {
    return "info";
  }

  return "default";
}

export interface CustomerHealthCardProps {
  readonly config: WorkflowPanelConfig;
  readonly health: readonly CustomerHealthItem[];
}

export default function CustomerHealthCard({ config, health }: CustomerHealthCardProps) {
  return (
    <SectionCard title={config.healthTitle} subtitle={config.healthSubtitle}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {health.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
            <div className="mt-1">
              <StatusChip label={item.status} variant={statusVariant(item.status)} />
            </div>
            <p className="mt-2 text-xs text-slate-400">Progress: {item.progress}</p>
            <p className="mt-0.5 text-xs text-slate-400">Trend: {item.trend}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
