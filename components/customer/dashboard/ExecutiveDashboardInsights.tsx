"use client";

import IntelligencePanel, { type IntelligenceItem } from "@/components/atlas/design-system/IntelligencePanel";
import SectionCard from "@/components/ui/SectionCard";
import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";

export interface ExecutiveDashboardInsightsProps {
  readonly dashboard: ExecutiveRelationshipDashboardViewModel;
}

export default function ExecutiveDashboardInsights({
  dashboard,
}: ExecutiveDashboardInsightsProps) {
  const strengthItems: IntelligenceItem[] = dashboard.keyBusinessInsights.strengths.map((item) => ({
    title: `Strength: ${item.code}`,
    detail: item.message,
    emphasis: "normal",
  }));

  const gapItems: IntelligenceItem[] = dashboard.keyBusinessInsights.informationGaps.map((item) => ({
    title: `Gap: ${item.code}`,
    detail: item.message,
    emphasis: "critical",
  }));

  const inconsistencyItems: IntelligenceItem[] = dashboard.keyBusinessInsights.inconsistencies.map((item) => ({
    title: `Inconsistency: ${item.code}`,
    detail: item.message,
    emphasis: "critical",
  }));

  const items: IntelligenceItem[] = [
    ...strengthItems,
    ...gapItems,
    ...inconsistencyItems,
  ];

  return (
    <SectionCard title="Relationship Insights" subtitle={dashboard.executiveSummary.headline}>
      <IntelligencePanel title="Insights Engine Highlights" items={items} />
    </SectionCard>
  );
}
