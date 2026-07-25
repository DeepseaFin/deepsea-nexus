"use client";

import StatusBadge from "@/components/atlas/design-system/StatusBadge";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";

export interface RelationshipWorkspaceHeaderProps {
  readonly viewModel: RelationshipWorkspaceViewModel;
}

function toDisplayLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function toReadinessTone(status: string): "neutral" | "success" | "warning" | "danger" | "info" {
  if (status === "ready") {
    return "success";
  }

  if (status === "needs_attention") {
    return "warning";
  }

  if (status === "not_ready") {
    return "danger";
  }

  return "neutral";
}

export default function RelationshipWorkspaceHeader({ viewModel }: RelationshipWorkspaceHeaderProps) {
  const customerName = viewModel.executiveDashboard.customerSnapshot.customerName;
  const passportStatus = viewModel.executiveDashboard.customerSnapshot.lifecycleStage ?? "unknown";
  const confidence = viewModel.executiveDashboard.relationshipConfidence;
  const readiness = viewModel.executiveDashboard.readinessStatus;

  return (
    <header className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-4 shadow-[0_14px_30px_rgba(2,6,23,0.24)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">Relationship Workspace</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">{customerName}</h1>
          <p className="mt-1 text-sm text-slate-400">Top-level operating shell for relationship management.</p>
        </div>

        <StatusBadge
          label={`Readiness: ${toDisplayLabel(readiness.status)}`}
          tone={toReadinessTone(readiness.status)}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Customer Name</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{customerName}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Business Passport Status</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{toDisplayLabel(passportStatus)}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Relationship Confidence</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">
            {confidence.overallScore} ({toDisplayLabel(confidence.overallBand)})
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Readiness</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{toDisplayLabel(readiness.status)}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Last Updated</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{new Date(viewModel.generatedAt).toLocaleString()}</p>
        </div>
      </div>
    </header>
  );
}
