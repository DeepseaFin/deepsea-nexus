export type ConfidenceScore = number;

export enum ConfidenceBand {
  VeryLow = "very_low",
  Low = "low",
  Moderate = "moderate",
  High = "high",
  VeryHigh = "very_high",
}

export interface ConfidenceBreakdown {
  readonly dimension: string;
  readonly score: ConfidenceScore;
  readonly weight: number;
}

export interface Confidence {
  readonly score: ConfidenceScore;
  readonly band: ConfidenceBand;
  readonly assessedAt: string;
  readonly breakdown: readonly ConfidenceBreakdown[];
}
