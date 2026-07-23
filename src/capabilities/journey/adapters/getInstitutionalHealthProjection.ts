import type { InstitutionHealth } from "@/lib/institutional-intelligence/health/InstitutionHealth";
import {
  InstitutionHealthStatus,
} from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";

export interface InstitutionalHealthDimensionViewModel {
  readonly type: string;
  readonly category: string;
  readonly score: string;
  readonly confidence: string;
  readonly status: InstitutionHealthStatus;
  readonly summary: string;
}

export interface InstitutionalHealthMetadataViewModel {
  readonly healthId: string;
  readonly overallConfidence: string;
  readonly dimensionCount: number;
}

export interface InstitutionalHealthProjection {
  readonly overallHealthScore: string;
  readonly overallHealthGrade: string;
  readonly overallStatus: InstitutionHealthStatus;
  readonly healthDimensions: readonly InstitutionalHealthDimensionViewModel[];
  readonly positiveIndicators: readonly string[];
  readonly attentionRequired: readonly string[];
  readonly evaluationTimestamp: string;
  readonly healthMetadata: InstitutionalHealthMetadataViewModel;
}

function toPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function toReadableLabel(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toGrade(status: InstitutionHealthStatus): string {
  if (status === InstitutionHealthStatus.Excellent) {
    return "A";
  }

  if (status === InstitutionHealthStatus.Good) {
    return "B";
  }

  if (status === InstitutionHealthStatus.Fair) {
    return "C";
  }

  if (status === InstitutionHealthStatus.Weak) {
    return "D";
  }

  return "E";
}

export function getInstitutionalHealthProjection(health: InstitutionHealth): InstitutionalHealthProjection {
  const dimensions = Object.values(health.dimensions).map((dimension) => ({
    type: toReadableLabel(dimension.type),
    category: toReadableLabel(dimension.category),
    score: toPercent(dimension.score),
    confidence: toPercent(dimension.confidence),
    status: dimension.status,
    summary: dimension.summary,
  }));

  const positiveIndicators = dimensions
    .filter((dimension) => dimension.status === InstitutionHealthStatus.Excellent || dimension.status === InstitutionHealthStatus.Good)
    .map((dimension) => `${dimension.type}: ${dimension.summary}`);

  const attentionRequired = dimensions
    .filter((dimension) => dimension.status === InstitutionHealthStatus.Fair || dimension.status === InstitutionHealthStatus.Weak || dimension.status === InstitutionHealthStatus.Critical)
    .map((dimension) => `${dimension.type}: ${dimension.summary}`);

  return {
    overallHealthScore: toPercent(health.overallHealthScore),
    overallHealthGrade: toGrade(health.overallStatus),
    overallStatus: health.overallStatus,
    healthDimensions: dimensions,
    positiveIndicators,
    attentionRequired,
    evaluationTimestamp: health.generatedAt,
    healthMetadata: {
      healthId: health.id,
      overallConfidence: toPercent(health.overallConfidence),
      dimensionCount: dimensions.length,
    },
  };
}
