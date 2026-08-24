import type { Recommendation } from "@/lib/institutional-intelligence/recommendations/Recommendation";
import { RecommendationPriority } from "@/lib/institutional-intelligence/recommendations/RecommendationPriority";
import { RecommendationType } from "@/lib/institutional-intelligence/recommendations/RecommendationType";
import type { RiskSignal } from "@/lib/institutional-intelligence/risk/RiskSignal";
import { RiskSeverity } from "@/lib/institutional-intelligence/risk/RiskSeverity";
import { RiskSignalType } from "@/lib/institutional-intelligence/risk/RiskSignalType";

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

function uniqueRiskIds(risks: readonly RiskSignal[]): readonly string[] {
  return [...new Set(risks.map((risk) => risk.id))];
}

function averageConfidence(risks: readonly RiskSignal[]): number {
  if (risks.length === 0) {
    return 0;
  }

  const total = risks.reduce((sum, risk) => sum + clampUnit(risk.confidence), 0);
  return total / risks.length;
}

function severityWeight(severity: RiskSeverity): number {
  if (severity === RiskSeverity.Critical) {
    return 1;
  }

  if (severity === RiskSeverity.High) {
    return 0.8;
  }

  if (severity === RiskSeverity.Moderate) {
    return 0.6;
  }

  return 0.4;
}

function recommendationConfidence(risks: readonly RiskSignal[]): number {
  if (risks.length === 0) {
    return 0;
  }

  const weightedSeverity = risks.reduce((sum, risk) => sum + severityWeight(risk.severity), 0) / risks.length;
  const blended = (weightedSeverity * 0.55) + (averageConfidence(risks) * 0.45);

  return withTwoDecimals(clampUnit(blended));
}

function recommendationPriority(risks: readonly RiskSignal[]): RecommendationPriority {
  const hasCritical = risks.some((risk) => risk.severity === RiskSeverity.Critical);
  const highCount = risks.filter((risk) => risk.severity === RiskSeverity.High).length;
  const moderateCount = risks.filter((risk) => risk.severity === RiskSeverity.Moderate).length;

  if (hasCritical || highCount >= 2) {
    return RecommendationPriority.Urgent;
  }

  if (highCount >= 1 || moderateCount >= 2) {
    return RecommendationPriority.High;
  }

  if (moderateCount >= 1) {
    return RecommendationPriority.Medium;
  }

  return RecommendationPriority.Low;
}

function createRecommendation(input: {
  readonly type: RecommendationType;
  readonly title: string;
  readonly description: string;
  readonly risks: readonly RiskSignal[];
}): Recommendation {
  return {
    id: `recommendation:${input.type}:${uniqueRiskIds(input.risks).join("|")}`,
    type: input.type,
    title: input.title,
    description: input.description,
    priority: recommendationPriority(input.risks),
    supportingRiskIds: uniqueRiskIds(input.risks),
    confidence: recommendationConfidence(input.risks),
  };
}

function byType(risks: readonly RiskSignal[], types: readonly RiskSignalType[]): readonly RiskSignal[] {
  return risks.filter((risk) => types.includes(risk.type));
}

function byMinSeverity(
  risks: readonly RiskSignal[],
  severities: readonly RiskSeverity[],
): readonly RiskSignal[] {
  return risks.filter((risk) => severities.includes(risk.severity));
}

export interface RecommendationEngine {
  evaluate(riskSignals: readonly RiskSignal[]): readonly Recommendation[];
}

export class DefaultRecommendationEngine implements RecommendationEngine {
  evaluate(riskSignals: readonly RiskSignal[]): readonly Recommendation[] {
    const output: Recommendation[] = [];

    if (riskSignals.length === 0) {
      return deepFreeze(output);
    }

    const criticalOrHigh = byMinSeverity(riskSignals, [RiskSeverity.Critical, RiskSeverity.High]);
    const moderateOrHigher = byMinSeverity(riskSignals, [RiskSeverity.Critical, RiskSeverity.High, RiskSeverity.Moderate]);

    const documentationRisks = byType(riskSignals, [RiskSignalType.DocumentationRisk, RiskSignalType.KnowledgeRisk]);
    const regulatoryRisks = byType(riskSignals, [RiskSignalType.RegulatoryRisk]);
    const relationshipRisks = byType(riskSignals, [RiskSignalType.RelationshipRisk]);
    const operationalRisks = byType(riskSignals, [RiskSignalType.OperationalRisk]);
    const identityRisks = byType(riskSignals, [RiskSignalType.IdentityRisk]);

    const criticalRegulatory = regulatoryRisks.filter(
      (risk) => risk.severity === RiskSeverity.Critical || risk.severity === RiskSeverity.High,
    );

    if (documentationRisks.some((risk) => risk.severity !== RiskSeverity.Low)) {
      output.push(createRecommendation({
        type: RecommendationType.RequestAdditionalDocumentation,
        title: "Request Additional Documentation",
        description: "Additional documentary evidence is suggested to improve institutional clarity and completeness.",
        risks: documentationRisks,
      }));
    }

    if (criticalRegulatory.length > 0) {
      output.push(createRecommendation({
        type: RecommendationType.EscalateComplianceReview,
        title: "Escalate Compliance Review",
        description: "A compliance-focused escalation is suggested due to elevated regulatory concerns.",
        risks: criticalRegulatory,
      }));
    } else if (regulatoryRisks.some((risk) => risk.severity === RiskSeverity.Moderate)) {
      output.push(createRecommendation({
        type: RecommendationType.RegulatoryClarification,
        title: "Regulatory Clarification",
        description: "Further regulatory clarification is suggested to improve jurisdictional interpretability.",
        risks: regulatoryRisks,
      }));
    }

    if (relationshipRisks.some((risk) => risk.severity !== RiskSeverity.Low)) {
      output.push(createRecommendation({
        type: RecommendationType.RelationshipManagerFollowUp,
        title: "Relationship Manager Follow-up",
        description: "A relationship follow-up is suggested to strengthen communication continuity and counterpart alignment.",
        risks: relationshipRisks,
      }));
    }

    if (operationalRisks.some((risk) => risk.severity === RiskSeverity.High || risk.severity === RiskSeverity.Critical)) {
      output.push(createRecommendation({
        type: RecommendationType.CreditAssessment,
        title: "Credit Assessment",
        description: "A focused credit assessment is suggested to improve understanding of operational and performance consistency.",
        risks: operationalRisks,
      }));
    }

    if (criticalOrHigh.length >= 2 || (criticalOrHigh.length >= 1 && identityRisks.length >= 1)) {
      output.push(createRecommendation({
        type: RecommendationType.ManualReviewRequired,
        title: "Manual Review Required",
        description: "A manual analyst review is suggested due to concentrated high-severity institutional concerns.",
        risks: criticalOrHigh,
      }));
    }

    if (output.length === 0 && moderateOrHigher.length === 0) {
      output.push(createRecommendation({
        type: RecommendationType.ProceedToOnboarding,
        title: "Proceed to Onboarding",
        description: "Current institutional risk posture suggests readiness for onboarding progression with standard monitoring.",
        risks: riskSignals,
      }));
    }

    return deepFreeze(output);
  }
}

export const recommendationEngine: RecommendationEngine = new DefaultRecommendationEngine();
