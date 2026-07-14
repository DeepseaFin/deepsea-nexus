export type InstitutionConfidenceLevel = "high" | "medium" | "low";

export interface InstitutionConfidence {
  readonly score: number;
  readonly level: InstitutionConfidenceLevel;
  readonly rationale: readonly string[];
}