import type { InstitutionHealth } from "@/lib/institutional-intelligence/health/InstitutionHealth";
import {
  InstitutionHealthDimensionType,
  InstitutionHealthStatus,
} from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";
import type { RiskSignal } from "@/lib/institutional-intelligence/risk/RiskSignal";
import { RiskSeverity } from "@/lib/institutional-intelligence/risk/RiskSeverity";
import { RiskSignalType } from "@/lib/institutional-intelligence/risk/RiskSignalType";

interface RiskDefinition {
  readonly type: RiskSignalType;
  readonly title: string;
  readonly dimension: InstitutionHealthDimensionType;
}

const RISK_DEFINITIONS: readonly RiskDefinition[] = [
  {
    type: RiskSignalType.IdentityRisk,
    title: "Identity Risk",
    dimension: InstitutionHealthDimensionType.IdentityHealth,
  },
  {
    type: RiskSignalType.DocumentationRisk,
    title: "Documentation Risk",
    dimension: InstitutionHealthDimensionType.DocumentationHealth,
  },
  {
    type: RiskSignalType.RegulatoryRisk,
    title: "Regulatory Risk",
    dimension: InstitutionHealthDimensionType.RegulatoryHealth,
  },
  {
    type: RiskSignalType.OperationalRisk,
    title: "Operational Risk",
    dimension: InstitutionHealthDimensionType.OperationalHealth,
  },
  {
    type: RiskSignalType.KnowledgeRisk,
    title: "Knowledge Risk",
    dimension: InstitutionHealthDimensionType.KnowledgeHealth,
  },
  {
    type: RiskSignalType.RelationshipRisk,
    title: "Relationship Risk",
    dimension: InstitutionHealthDimensionType.RelationshipHealth,
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

function toRiskSeverity(status: InstitutionHealthStatus): RiskSeverity {
  if (status === InstitutionHealthStatus.Excellent || status === InstitutionHealthStatus.Good) {
    return RiskSeverity.Low;
  }

  if (status === InstitutionHealthStatus.Fair) {
    return RiskSeverity.Moderate;
  }

  if (status === InstitutionHealthStatus.Weak) {
    return RiskSeverity.High;
  }

  return RiskSeverity.Critical;
}

function deriveRiskSignalId(healthId: string, type: RiskSignalType): string {
  const baseId = healthId.startsWith("institution-health:")
    ? healthId.replace("institution-health:", "")
    : healthId;

  return `risk-signal:${baseId}:${type}`;
}

function buildDescription(input: {
  readonly title: string;
  readonly healthStatus: InstitutionHealthStatus;
  readonly healthScore: number;
  readonly healthConfidence: number;
  readonly healthSummary: string;
}): string {
  return `${input.title} derived from ${input.healthStatus} health status, score ${withTwoDecimals(input.healthScore)}, confidence ${withTwoDecimals(input.healthConfidence)}. ${input.healthSummary}`;
}

export interface RiskSignalEngine {
  evaluate(health: InstitutionHealth): readonly RiskSignal[];
}

export class DefaultRiskSignalEngine implements RiskSignalEngine {
  evaluate(health: InstitutionHealth): readonly RiskSignal[] {
    const signals = RISK_DEFINITIONS.map((definition) => {
      const healthDimension = health.dimensions[definition.dimension];

      const riskConfidence = clampUnit(
        (clampUnit(1 - healthDimension.score) * 0.6)
        + (clampUnit(healthDimension.confidence) * 0.4),
      );

      return {
        id: deriveRiskSignalId(health.id, definition.type),
        type: definition.type,
        title: definition.title,
        description: buildDescription({
          title: definition.title,
          healthStatus: healthDimension.status,
          healthScore: healthDimension.score,
          healthConfidence: healthDimension.confidence,
          healthSummary: healthDimension.summary,
        }),
        severity: toRiskSeverity(healthDimension.status),
        supportingHealthDimensions: [definition.dimension],
        confidence: withTwoDecimals(riskConfidence),
      } as const;
    });

    return deepFreeze(signals);
  }
}

export const riskSignalEngine: RiskSignalEngine = new DefaultRiskSignalEngine();
