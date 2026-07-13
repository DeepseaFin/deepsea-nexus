export interface JourneyMetrics {
  readonly totalJourneys: number;
  readonly activeJourneys: number;
  readonly completedJourneys: number;
  readonly cancelledJourneys: number;
  readonly averageCompletionPercentage: number;
}