"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { ApprovalDecisionSummary, ApprovalPanelConfig } from "@/lib/customer/approval/approval-panel.types";

function toLabel(value: string): string {
  return value.replace(/_/g, " ");
}

function decisionVariant(value: ApprovalDecisionSummary["approval"]["currentDecision"]): "success" | "warning" | "danger" {
  if (value === "approve") {
    return "success";
  }

  if (value === "reject") {
    return "danger";
  }

  return "warning";
}

export interface ApprovalSummaryCardProps {
  readonly config: ApprovalPanelConfig;
  readonly summary: ApprovalDecisionSummary;
}

export default function ApprovalSummaryCard({ config, summary }: ApprovalSummaryCardProps) {
  return (
    <SectionCard title={config.summaryTitle} subtitle={config.summarySubtitle}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Status</p>
          <div className="mt-1">
            <StatusChip label={toLabel(summary.approval.status)} variant="info" />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Current Stage</p>
          <p className="mt-1 text-sm font-semibold capitalize text-slate-100">{toLabel(summary.approval.currentStage)}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Current Decision</p>
          <div className="mt-1">
            <StatusChip label={toLabel(summary.approval.currentDecision)} variant={decisionVariant(summary.approval.currentDecision)} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Requested By</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.requestedBy}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Submitted Date</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.submittedDate}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Due Date</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.dueDate}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 sm:col-span-2 xl:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Priority</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.priority}</p>
        </article>
      </div>
    </SectionCard>
  );
}
