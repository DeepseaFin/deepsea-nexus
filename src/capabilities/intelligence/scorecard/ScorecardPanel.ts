import ScorecardPanelView from "@/components/atlas/intelligence/ScorecardPanelView";
import type { ScorecardProjection } from "@/src/capabilities/intelligence/projections/ScorecardProjection";

export interface ScorecardPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface ScorecardPanel {
  readonly scorecards: readonly ScorecardProjection[];
  readonly emptyState: ScorecardPanelEmptyState;
  readonly totalScorecards: number;
}

interface ScorecardPanelProps {
  readonly scorecards: readonly ScorecardProjection[];
}

function toScorecardPanel(scorecards: readonly ScorecardProjection[]): ScorecardPanel {
  return {
    scorecards,
    emptyState: {
      title: "No scorecards available",
      description: "Institutional scorecards will appear here once groupings are available.",
    },
    totalScorecards: scorecards.length,
  };
}

export default function ScorecardPanel({ scorecards }: ScorecardPanelProps) {
  return <ScorecardPanelView panel={toScorecardPanel(scorecards)} />;
}