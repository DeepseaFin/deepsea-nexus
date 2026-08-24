import type { RecommendationPriority } from "@/lib/institutional-intelligence/recommendations/RecommendationPriority";
import type { RecommendationType } from "@/lib/institutional-intelligence/recommendations/RecommendationType";

export interface Recommendation {
  readonly id: string;
  readonly type: RecommendationType;
  readonly title: string;
  readonly description: string;
  readonly priority: RecommendationPriority;
  readonly supportingRiskIds: readonly string[];
  readonly confidence: number;
}
