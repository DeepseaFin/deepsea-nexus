export type InstitutionRiskSeverity = "low" | "medium" | "high";

export interface InstitutionRisk {
  readonly title: string;
  readonly severity: InstitutionRiskSeverity;
  readonly description: string;
}