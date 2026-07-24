"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { CustomerSummaryModel } from "@/lib/customer/customer-workspace.types";

export interface CustomerSummaryCardProps {
  readonly summary: CustomerSummaryModel;
}

export default function CustomerSummaryCard({ summary }: CustomerSummaryCardProps) {
  return (
    <SectionCard title="Customer Summary" subtitle="Snapshot of core relationship and risk context">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Customer Name</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{summary.customerName}</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Status</p>
          <div className="mt-1">
            <StatusChip label={summary.status.label} variant={summary.status.variant ?? "default"} />
          </div>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Relationship Manager</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{summary.relationshipManager}</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Industry</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{summary.industry}</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Country</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{summary.country}</p>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Risk</p>
          <div className="mt-1">
            <StatusChip label={summary.risk.label} variant={summary.risk.variant ?? "default"} />
          </div>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 sm:col-span-2 lg:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Funding Potential</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{summary.fundingPotential}</p>
        </article>
      </div>
    </SectionCard>
  );
}
