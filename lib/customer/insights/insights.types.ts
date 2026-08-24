export const INSIGHT_RISK_LEVELS = ["Low", "Medium", "High", "Critical"] as const;

export type InsightRiskLevel = (typeof INSIGHT_RISK_LEVELS)[number];

export type InsightPriority = "low" | "medium" | "high";

export interface AiRecommendation {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly confidence: string;
  readonly priority: InsightPriority;
  readonly category: string;
  readonly recommendedAction: string;
  readonly riskLevel: InsightRiskLevel;
}

export interface InsightOpportunity {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly category: string;
  readonly priority: InsightPriority;
  readonly recommendedAction: string;
}

export interface AiInsightsConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly recommendationsTitle: string;
  readonly recommendationsSubtitle: string;
  readonly opportunitiesTitle: string;
  readonly opportunitiesSubtitle: string;
}

export interface AiInsightsModel {
  readonly recommendations: readonly AiRecommendation[];
  readonly opportunities: readonly InsightOpportunity[];
}
