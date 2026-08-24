import type {
  InstitutionalProfileDimension,
  InstitutionalProfileDimensionType,
} from "@/lib/institutional-intelligence/profile/InstitutionalProfileDimension";

export type InstitutionalProfileDimensions = {
  readonly [K in InstitutionalProfileDimensionType]: InstitutionalProfileDimension<K>;
};

export interface InstitutionalProfile {
  readonly id: string;
  readonly generatedAt: string;
  readonly overallScore: number;
  readonly overallConfidence: number;
  readonly dimensions: InstitutionalProfileDimensions;
}
