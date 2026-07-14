export type InstitutionAlertSeverity = "low" | "medium" | "high" | "critical";

export interface InstitutionAlert {
  readonly title: string;
  readonly severity: InstitutionAlertSeverity;
  readonly description: string;
  readonly sourceDomain: string;
}