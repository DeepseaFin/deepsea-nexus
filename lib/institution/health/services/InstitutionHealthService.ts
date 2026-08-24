import type { HealthIndicatorType } from "@/lib/institution/health/constants/HealthIndicatorType";
import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";
import type { InstitutionHealthSummary } from "@/lib/institution/health/types/InstitutionHealthSummary";

export interface HealthDimensionInput {
  readonly type: HealthIndicatorType;
  readonly score: number;
}

export interface InstitutionHealthService {
  calculate(institutionId: string, dimensions: readonly HealthDimensionInput[], assessedAt: string): InstitutionHealth;
  summarize(health: InstitutionHealth): InstitutionHealthSummary;
}