import type { HealthIndicatorType } from "@/lib/institution/health/constants/HealthIndicatorType";
import type { InstitutionHealthStatus } from "@/lib/institution/health/constants/InstitutionHealthStatus";
import type { HealthTrend } from "@/lib/institution/health/domain/HealthTrend";
import type { HealthScore } from "@/lib/institution/health/types/HealthScore";

export interface HealthIndicator {
  readonly type: HealthIndicatorType;
  readonly score: HealthScore;
  readonly status: InstitutionHealthStatus;
  readonly trend: HealthTrend;
  readonly explanation: string;
  readonly recommendation: string;
}