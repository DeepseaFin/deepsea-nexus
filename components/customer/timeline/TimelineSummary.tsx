"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type { TimelineSummaryMetric } from "@/lib/customer/timeline/timeline.types";

export interface TimelineSummaryProps {
  readonly title: string;
  readonly subtitle: string;
  readonly metrics: readonly TimelineSummaryMetric[];
}

export default function TimelineSummary({ title, subtitle, metrics }: TimelineSummaryProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{metric.value}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
