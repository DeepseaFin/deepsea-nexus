import type { InstitutionalDecisionPackage } from "@/lib/orchestration/decision-package/InstitutionalDecisionPackage";
import { DecisionPackageStatus } from "@/lib/orchestration/decision-package/DecisionPackageStatus";
import type { ExplainabilityResult } from "@/lib/orchestration/explainability/ExplainabilityResult";
import type { JourneyResult } from "@/lib/orchestration/JourneyResult";

export interface DecisionPackageBuilderInput {
  readonly journeyResult: JourneyResult;
  readonly explainabilityResult: ExplainabilityResult;
}

export interface DecisionPackageBuilderOptions {
  readonly pipelineVersion?: string;
}

export interface DecisionPackageBuilder {
  build(input: DecisionPackageBuilderInput): InstitutionalDecisionPackage;
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

function toPackageStatus(input: DecisionPackageBuilderInput): DecisionPackageStatus {
  const recommendationExists = input.journeyResult.artifacts.recommendations.some(
    (recommendation) => recommendation.id === input.explainabilityResult.recommendation.id,
  );

  if (!recommendationExists) {
    return DecisionPackageStatus.Incomplete;
  }

  return DecisionPackageStatus.Complete;
}

function toPackageId(journeyId: string): string {
  return `decision-package:${journeyId}`;
}

export class DefaultDecisionPackageBuilder implements DecisionPackageBuilder {
  private readonly pipelineVersion: string;

  constructor(options: DecisionPackageBuilderOptions = {}) {
    this.pipelineVersion = options.pipelineVersion ?? "R2-M5";
  }

  build(input: DecisionPackageBuilderInput): InstitutionalDecisionPackage {
    const artifacts = input.journeyResult.artifacts;
    const overallConfidence = withTwoDecimals(clampUnit((
      artifacts.institutionalProfile.overallConfidence
      + artifacts.institutionHealth.overallConfidence
      + input.explainabilityResult.confidence
    ) / 3));

    return deepFreeze({
      metadata: {
        packageId: toPackageId(input.journeyResult.journeyId),
        generatedAt: new Date().toISOString(),
        pipelineVersion: this.pipelineVersion,
        overallConfidence,
        packageStatus: toPackageStatus(input),
      },
      artifacts: {
        journeyResult: input.journeyResult,
        businessPassport: artifacts.projectedBusinessPassport,
        evidence: artifacts.evidence,
        knowledge: artifacts.knowledgeFacts,
        institutionalFactGraph: artifacts.institutionalFactGraph,
        businessSignals: artifacts.businessSignals,
        institutionalProfile: artifacts.institutionalProfile,
        institutionHealth: artifacts.institutionHealth,
        riskSignals: artifacts.riskSignals,
        recommendations: artifacts.recommendations,
        explainabilityResult: input.explainabilityResult,
      },
    });
  }
}

export const decisionPackageBuilder: DecisionPackageBuilder = new DefaultDecisionPackageBuilder();
