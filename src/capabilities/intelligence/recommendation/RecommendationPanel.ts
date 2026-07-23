import RecommendationPanelView from "@/components/atlas/intelligence/RecommendationPanelView";
import type { RecommendationProjection } from "@/src/capabilities/intelligence/projections/RecommendationProjection";

export interface RecommendationPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface RecommendationPanel {
  readonly recommendations: readonly RecommendationProjection[];
  readonly totalRecommendations: number;
  readonly emptyState: RecommendationPanelEmptyState;
}

interface RecommendationPanelProps {
  readonly recommendations: readonly RecommendationProjection[];
}

function toRecommendationPanel(
  recommendations: readonly RecommendationProjection[],
): RecommendationPanel {
  return {
    recommendations,
    totalRecommendations: recommendations.length,
    emptyState: {
      title: "No recommendations available",
      description: "Institutional recommendations will appear here once recommendation packages are available.",
    },
  };
}

export default function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  return <RecommendationPanelView panel={toRecommendationPanel(recommendations)} />;
}