export type InstitutionalPulseScore = number;

export enum InstitutionalPulseState {
  Stable = "stable",
  Improving = "improving",
  ElevatedRisk = "elevated_risk",
  Deteriorating = "deteriorating",
}

export interface InstitutionalPulseDriver {
  readonly driver: string;
  readonly influence: number;
}

export interface InstitutionalPulse {
  readonly score: InstitutionalPulseScore;
  readonly state: InstitutionalPulseState;
  readonly measuredAt: string;
  readonly momentum: number;
  readonly drivers: readonly InstitutionalPulseDriver[];
}
