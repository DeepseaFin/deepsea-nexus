import type { InstitutionHealth } from "@/lib/institutional-intelligence/health/InstitutionHealth";
import { InstitutionHealthCategory } from "@/lib/institutional-intelligence/health/InstitutionHealthCategory";
import type {
  InstitutionHealthDimension,
  InstitutionHealthDimensionType,
} from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";
import {
  InstitutionHealthDimensionType,
  InstitutionHealthStatus,
} from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";
import type { InstitutionalProfile } from "@/lib/institutional-intelligence/profile/InstitutionalProfile";
import { InstitutionalProfileDimensionType } from "@/lib/institutional-intelligence/profile/InstitutionalProfileDimension";

interface HealthDimensionDefinition {
  readonly type: InstitutionHealthDimensionType;
  readonly category: InstitutionHealthCategory;
  readonly profileDimension: InstitutionalProfileDimensionType;
  readonly label: string;
}

const HEALTH_DIMENSION_DEFINITIONS: readonly HealthDimensionDefinition[] = [
  {
    type: InstitutionHealthDimensionType.IdentityHealth,
    category: InstitutionHealthCategory.IdentityHealth,
    profileDimension: InstitutionalProfileDimensionType.CorporateCharacteristics,
    label: "Identity Health",
  },
  {
    type: InstitutionHealthDimensionType.DocumentationHealth,
    category: InstitutionHealthCategory.DocumentationHealth,
    profileDimension: InstitutionalProfileDimensionType.DocumentationQuality,
    label: "Documentation Health",
  },
  {
    type: InstitutionHealthDimensionType.OperationalHealth,
    category: InstitutionHealthCategory.OperationalHealth,
    profileDimension: InstitutionalProfileDimensionType.OperationalMaturity,
    label: "Operational Health",
  },
  {
    type: InstitutionHealthDimensionType.RegulatoryHealth,
    category: InstitutionHealthCategory.RegulatoryHealth,
    profileDimension: InstitutionalProfileDimensionType.RegulatoryReadiness,
    label: "Regulatory Health",
  },
  {
    type: InstitutionHealthDimensionType.KnowledgeHealth,
    category: InstitutionHealthCategory.KnowledgeHealth,
    profileDimension: InstitutionalProfileDimensionType.KnowledgeStrength,
    label: "Knowledge Health",
  },
  {
    type: InstitutionHealthDimensionType.RelationshipHealth,
    category: InstitutionHealthCategory.RelationshipHealth,
    profileDimension: InstitutionalProfileDimensionType.RelationshipReadiness,
    label: "Relationship Health",
  },
];

function clampUnit(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

function withTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

function toStatus(score: number): InstitutionHealthStatus {
  if (score >= 0.85) {
    return InstitutionHealthStatus.Excellent;
  }

  if (score >= 0.7) {
    return InstitutionHealthStatus.Good;
  }

  if (score >= 0.5) {
    return InstitutionHealthStatus.Fair;
  }

  if (score >= 0.3) {
    return InstitutionHealthStatus.Weak;
  }

  return InstitutionHealthStatus.Critical;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildSummary(label: string, status: InstitutionHealthStatus, score: number, confidence: number): string {
  return `${label} is ${status} with score ${withTwoDecimals(score)} and confidence ${withTwoDecimals(confidence)}.`;
}

function deriveHealthId(profile: InstitutionalProfile): string {
  const baseId = profile.id.startsWith("institution-profile:")
    ? profile.id.replace("institution-profile:", "")
    : profile.id;

  return `institution-health:${baseId}`;
}

function dimensionHealthScore(score: number, confidence: number): number {
  return clampUnit((clampUnit(score) * 0.8) + (clampUnit(confidence) * 0.2));
}

function buildDimension<TType extends InstitutionHealthDimensionType>(input: {
  readonly type: TType;
  readonly category: InstitutionHealthCategory;
  readonly label: string;
  readonly score: number;
  readonly confidence: number;
}): InstitutionHealthDimension<TType> {
  const normalizedScore = clampUnit(input.score);
  const normalizedConfidence = clampUnit(input.confidence);
  const status = toStatus(normalizedScore);

  return {
    type: input.type,
    category: input.category,
    score: withTwoDecimals(normalizedScore),
    confidence: withTwoDecimals(normalizedConfidence),
    status,
    summary: buildSummary(input.label, status, normalizedScore, normalizedConfidence),
  };
}

export interface InstitutionHealthEngine {
  evaluate(profile: InstitutionalProfile): InstitutionHealth;
}

export class DefaultInstitutionHealthEngine implements InstitutionHealthEngine {
  evaluate(profile: InstitutionalProfile): InstitutionHealth {
    const dimensions = HEALTH_DIMENSION_DEFINITIONS.reduce((accumulator, definition) => {
      const profileDimension = profile.dimensions[definition.profileDimension];

      const score = dimensionHealthScore(profileDimension.score, profileDimension.confidence);

      const dimension = buildDimension({
        type: definition.type,
        category: definition.category,
        label: definition.label,
        score,
        confidence: profileDimension.confidence,
      });

      return {
        ...accumulator,
        [definition.type]: dimension,
      };
    }, {} as {
      readonly [K in InstitutionHealthDimensionType]: InstitutionHealthDimension<K>;
    });

    const dimensionValues = Object.values(dimensions);
    const overallHealthScore = withTwoDecimals(average(dimensionValues.map((dimension) => dimension.score)));
    const overallConfidence = withTwoDecimals(average(dimensionValues.map((dimension) => dimension.confidence)));
    const overallStatus = toStatus(overallHealthScore);

    return deepFreeze({
      id: deriveHealthId(profile),
      generatedAt: new Date().toISOString(),
      overallHealthScore,
      overallConfidence,
      overallStatus,
      dimensions,
    });
  }
}

export const institutionHealthEngine: InstitutionHealthEngine = new DefaultInstitutionHealthEngine();
