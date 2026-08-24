"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type {
  FacilitySummaryModel,
  FundingPanelConfig,
} from "@/lib/customer/funding/funding-panel.types";

export interface FundingSummaryCardProps {
  readonly config: FundingPanelConfig;
  readonly summary: FacilitySummaryModel;
}

export default function FundingSummaryCard({ config, summary }: FundingSummaryCardProps) {
  return (
    <SectionCard title={config.summaryTitle} subtitle={config.summarySubtitle}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Requested Amount</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {summary.currency} {summary.requestedAmount}
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Approved Amount</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {summary.currency} {summary.approvedAmount}
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Available Limit</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {summary.currency} {summary.availableLimit}
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Utilized Amount</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {summary.currency} {summary.utilizedAmount}
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Currency</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.currency}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Facility Status</p>
          <div className="mt-1">
            <StatusChip label={summary.facilityStatus} variant="info" />
          </div>
        </article>
      </div>
    </SectionCard>
  );
}
