"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type { DocumentPortfolioSummary } from "@/lib/customer/documents/documents-panel.types";

export interface DocumentSummaryCardProps {
  readonly title: string;
  readonly subtitle: string;
  readonly metrics: DocumentPortfolioSummary;
}

export default function DocumentSummaryCard({ title, subtitle, metrics }: DocumentSummaryCardProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
