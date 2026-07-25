"use client";

import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/atlas/design-system/StatusBadge";
import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";

export interface ExecutiveDashboardStatusCardProps {
  readonly dashboard: ExecutiveRelationshipDashboardViewModel;
  readonly workspace?: RelationshipWorkspaceViewModel;
}

function toLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
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

export default function ExecutiveDashboardStatusCard({
  dashboard,
  workspace,
}: ExecutiveDashboardStatusCardProps) {
  const passportStatus = dashboard.customerSnapshot.lifecycleStage ?? "unknown";
  const relationshipStatus = `${toLabel(dashboard.readinessStatus.status)} / ${toLabel(dashboard.relationshipConfidence.overallBand)}`;

  return (
    <SectionCard
      title="Status Summary"
      subtitle="Current relationship and passport posture"
      actions={<StatusBadge label={toLabel(dashboard.readinessStatus.status)} tone={toReadinessTone(dashboard.readinessStatus.status)} />}
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">Business Passport Status</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-100">{toLabel(passportStatus)}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">Overall Relationship Status</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-100">{relationshipStatus}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">Last Review</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-100">{new Date(dashboard.generatedAt).toLocaleString()}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">Last Update</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-100">
            {new Date(workspace?.generatedAt ?? dashboard.generatedAt).toLocaleString()}
          </dd>
        </div>
      </dl>
    </SectionCard>
  );
}
