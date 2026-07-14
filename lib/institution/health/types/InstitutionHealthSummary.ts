import type { InstitutionHealthStatus } from "@/lib/institution/health/constants/InstitutionHealthStatus";
import type { HealthIndicatorType } from "@/lib/institution/health/constants/HealthIndicatorType";

export interface InstitutionHealthDimensionSummary {
  readonly type: HealthIndicatorType;
  readonly score: number;
  readonly status: InstitutionHealthStatus;
}

export interface InstitutionHealthSummary {
  readonly institutionId: string;
  readonly overallScore: number;
  readonly overallStatus: InstitutionHealthStatus;
  readonly dimensions: readonly InstitutionHealthDimensionSummary[];
  readonly assessedAt: string;
}