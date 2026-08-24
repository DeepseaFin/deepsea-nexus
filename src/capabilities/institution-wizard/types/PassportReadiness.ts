export type PassportReadinessLevel = "ready" | "conditional" | "not_ready";

export interface PassportReadiness {
  readonly level: PassportReadinessLevel;
  readonly score: number;
  readonly rationale: readonly string[];
}