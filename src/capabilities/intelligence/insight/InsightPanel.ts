import InsightPanelView from "@/components/atlas/intelligence/InsightPanelView";
import type { InsightProjection } from "@/src/capabilities/intelligence/projections/InsightProjection";

export interface InsightPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface InsightPanel {
  readonly insights: readonly InsightProjection[];
  readonly totalInsights: number;
  readonly emptyState: InsightPanelEmptyState;
}

interface InsightPanelProps {
  readonly insights: readonly InsightProjection[];
}

function toInsightPanel(insights: readonly InsightProjection[]): InsightPanel {
  return {
    insights,
    totalInsights: insights.length,
    emptyState: {
      title: "No insights available",
      description: "Institutional insights will appear here once interpreted findings are available.",
    },
  };
}

export default function InsightPanel({ insights }: InsightPanelProps) {
  return <InsightPanelView panel={toInsightPanel(insights)} />;
}