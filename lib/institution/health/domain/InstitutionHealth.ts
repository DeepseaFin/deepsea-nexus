import type { InstitutionHealthStatus } from "@/lib/institution/health/constants/InstitutionHealthStatus";
import type { HealthIndicator } from "@/lib/institution/health/domain/HealthIndicator";
import type { HealthTrend } from "@/lib/institution/health/domain/HealthTrend";

export interface InstitutionHealth {
  readonly institutionId: string;
  readonly overallScore: number;
  readonly overallStatus: InstitutionHealthStatus;
  readonly overallTrend: HealthTrend;
  readonly indicators: readonly HealthIndicator[];
  readonly assessedAt: string;
}