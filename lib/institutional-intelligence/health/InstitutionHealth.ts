import type {
  InstitutionHealthDimension,
  InstitutionHealthDimensionType,
  InstitutionHealthStatus,
} from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";

export type InstitutionHealthDimensions = {
  readonly [K in InstitutionHealthDimensionType]: InstitutionHealthDimension<K>;
};

export interface InstitutionHealth {
  readonly id: string;
  readonly generatedAt: string;
  readonly overallHealthScore: number;
  readonly overallConfidence: number;
  readonly overallStatus: InstitutionHealthStatus;
  readonly dimensions: InstitutionHealthDimensions;
}
