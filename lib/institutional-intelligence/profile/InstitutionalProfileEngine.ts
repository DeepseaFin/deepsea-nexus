import type { InstitutionalProfile } from "@/lib/institutional-intelligence/profile/InstitutionalProfile";
import type {
  InstitutionalProfileDimension,
  InstitutionalProfileDimensionType,
} from "@/lib/institutional-intelligence/profile/InstitutionalProfileDimension";
import {
  InstitutionalProfileCategory,
} from "@/lib/institutional-intelligence/profile/InstitutionalProfileCategory";
import {
  InstitutionalProfileDimensionType,
} from "@/lib/institutional-intelligence/profile/InstitutionalProfileDimension";
import type { BusinessSignal } from "@/lib/institutional-intelligence/signals/BusinessSignal";
import { BusinessSignalSeverity } from "@/lib/institutional-intelligence/signals/BusinessSignalSeverity";
import { BusinessSignalType } from "@/lib/institutional-intelligence/signals/BusinessSignalType";

interface DimensionDefinition {
  readonly type: InstitutionalProfileDimensionType;
  readonly category: InstitutionalProfileCategory;
  readonly label: string;
  readonly signalTypes: readonly BusinessSignalType[];
}

const DIMENSION_DEFINITIONS: readonly DimensionDefinition[] = [
  {
    type: InstitutionalProfileDimensionType.CorporateCharacteristics,
    category: InstitutionalProfileCategory.CorporateCharacteristics,
    label: "Corporate Characteristics",
    signalTypes: [BusinessSignalType.CorporateProfile, BusinessSignalType.GeographicPresence],
  },
  {
    type: InstitutionalProfileDimensionType.OperationalMaturity,
    category: InstitutionalProfileCategory.OperationalMaturity,
    label: "Operational Maturity",
    signalTypes: [BusinessSignalType.OperationalMaturity],
  },
  {
    type: InstitutionalProfileDimensionType.DocumentationQuality,
    category: InstitutionalProfileCategory.DocumentationQuality,
    label: "Documentation Quality",
    signalTypes: [BusinessSignalType.DocumentationStrength],
  },
  {
    type: InstitutionalProfileDimensionType.KnowledgeStrength,
    category: InstitutionalProfileCategory.KnowledgeStrength,
    label: "Knowledge Strength",
    signalTypes: [BusinessSignalType.KnowledgeCompleteness],
  },
  {
    type: InstitutionalProfileDimensionType.RegulatoryReadiness,
    category: InstitutionalProfileCategory.RegulatoryReadiness,
    label: "Regulatory Readiness",
    signalTypes: [BusinessSignalType.LicensingProfile, BusinessSignalType.DocumentationStrength],
  },
  {
    type: InstitutionalProfileDimensionType.RelationshipReadiness,
    category: InstitutionalProfileCategory.RelationshipReadiness,
    label: "Relationship Readiness",
    signalTypes: [BusinessSignalType.BankingRelationships, BusinessSignalType.CorporateProfile],
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

function severityScore(severity: BusinessSignalSeverity): number {
  if (severity === BusinessSignalSeverity.Informational) {
    return 0.9;
  }

  if (severity === BusinessSignalSeverity.Watch) {
    return 0.7;
  }

  if (severity === BusinessSignalSeverity.Elevated) {
    return 0.5;
  }

  return 0.3;
}

function deriveInstitutionId(signals: readonly BusinessSignal[]): string {
  const firstSignal = signals[0];

  if (!firstSignal) {
    return "institution-profile:unknown";
  }

  const separatorIndex = firstSignal.id.indexOf(":");

  if (separatorIndex <= 0) {
    return `institution-profile:${firstSignal.id}`;
  }

  return `institution-profile:${firstSignal.id.slice(0, separatorIndex)}`;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function uniqueSignalIds(signals: readonly BusinessSignal[]): readonly string[] {
  const ids = new Set<string>();

  for (const signal of signals) {
    ids.add(signal.id);
  }

  return [...ids];
}

function dimensionSummary(label: string, signals: readonly BusinessSignal[]): string {
  if (signals.length === 0) {
    return `No ${label.toLowerCase()} signals are currently available.`;
  }

  const signalTitles = signals.map((signal) => signal.title).join(", ");
  return `${signals.length} signal(s) contributed: ${signalTitles}.`;
}

function buildDimension<TType extends InstitutionalProfileDimensionType>(input: {
  readonly type: TType;
  readonly category: InstitutionalProfileCategory;
  readonly label: string;
  readonly signals: readonly BusinessSignal[];
}): InstitutionalProfileDimension<TType> {
  const signalScores = input.signals.map((signal) => {
    const weightedScore = (signal.confidence * 0.7) + (severityScore(signal.severity) * 0.3);
    return clampUnit(weightedScore);
  });

  const score = average(signalScores);
  const confidence = average(input.signals.map((signal) => clampUnit(signal.confidence)));

  return {
    type: input.type,
    category: input.category,
    score: withTwoDecimals(score),
    confidence: withTwoDecimals(confidence),
    contributingSignalIds: uniqueSignalIds(input.signals),
    summary: dimensionSummary(input.label, input.signals),
  };
}

export interface InstitutionalProfileEngine {
  evaluate(signals: readonly BusinessSignal[]): InstitutionalProfile;
}

export class DefaultInstitutionalProfileEngine implements InstitutionalProfileEngine {
  evaluate(signals: readonly BusinessSignal[]): InstitutionalProfile {
    const dimensions = DIMENSION_DEFINITIONS.reduce((accumulator, definition) => {
      const dimensionSignals = signals.filter((signal) => definition.signalTypes.includes(signal.type));

      const dimension = buildDimension({
        type: definition.type,
        category: definition.category,
        label: definition.label,
        signals: dimensionSignals,
      });

      return {
        ...accumulator,
        [definition.type]: dimension,
      };
    }, {} as {
      readonly [K in InstitutionalProfileDimensionType]: InstitutionalProfileDimension<K>;
    });

    const dimensionValues = Object.values(dimensions);
    const overallScore = withTwoDecimals(average(dimensionValues.map((dimension) => dimension.score)));
    const overallConfidence = withTwoDecimals(average(dimensionValues.map((dimension) => dimension.confidence)));

    return deepFreeze({
      id: deriveInstitutionId(signals),
      generatedAt: new Date().toISOString(),
      overallScore,
      overallConfidence,
      dimensions,
    });
  }
}

export const institutionalProfileEngine: InstitutionalProfileEngine = new DefaultInstitutionalProfileEngine();
