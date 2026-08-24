"use client";

import MetricCard from "@/components/customer/shared/MetricCard";
import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";

export interface ExecutiveDashboardKPIsProps {
  readonly dashboard: ExecutiveRelationshipDashboardViewModel;
  readonly workspace?: RelationshipWorkspaceViewModel;
}

export default function ExecutiveDashboardKPIs({
  dashboard,
  workspace,
}: ExecutiveDashboardKPIsProps) {
  const items = [
    {
      label: "Relationship Confidence",
      value: `${dashboard.relationshipConfidence.overallScore}`,
      note: dashboard.relationshipConfidence.overallBand,
    },
    {
      label: "Readiness",
      value: `${dashboard.readinessStatus.completedCount}/${dashboard.readinessStatus.totalRequirements}`,
      note: dashboard.readinessStatus.status,
    },
    {
      label: "Evidence Count",
      value: `${workspace?.evidenceExplorer.totalEvidenceItems ?? 0}`,
      note: "Explorer items",
    },
    {
      label: "Knowledge Count",
      value: `${workspace?.knowledgeExplorer.totalKnowledgeItems ?? 0}`,
      note: "Explorer items",
    },
    {
      label: "Document Count",
      value: `${workspace?.documentExplorer.totalDocuments ?? dashboard.recentDocuments.length}`,
      note: "Available documents",
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <MetricCard key={item.label} label={item.label} value={item.value} note={item.note} />
      ))}
    </div>
  );
}
