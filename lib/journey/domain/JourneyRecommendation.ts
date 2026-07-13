export type JourneyRecommendationPriority = "low" | "medium" | "high" | "critical";

export interface JourneyRecommendation {
  readonly title: string;
  readonly description: string;
  readonly priority: JourneyRecommendationPriority;
  readonly generatedAt: string;
}