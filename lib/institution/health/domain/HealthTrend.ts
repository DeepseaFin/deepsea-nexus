export enum HealthTrendDirection {
  Improving = "improving",
  Stable = "stable",
  Deteriorating = "deteriorating",
}

export interface HealthTrend {
  readonly direction: HealthTrendDirection;
  readonly delta: number;
  readonly observedAt: string;
}