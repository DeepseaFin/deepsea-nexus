import type { DecisionPackageStatus } from "@/lib/orchestration/decision-package/DecisionPackageStatus";
import type { InstitutionalDecisionPackage } from "@/lib/orchestration/decision-package/InstitutionalDecisionPackage";

export interface ExecutiveDecisionProjection {
  readonly institutionSummary: string;
  readonly overallConfidence: string;
  readonly decisionStatus: DecisionPackageStatus;
  readonly recommendation: string;
  readonly recommendationPriority: string;
  readonly topRiskSummary: string;
  readonly institutionHealthSummary: string;
  readonly pipelineVersion: string;
  readonly decisionPackageVersion: string;
  readonly generatedTimestamp: string;
  readonly nextRecommendedAction: string;
}

function formatConfidence(input: number): string {
  return `${Math.round(input * 100)}%`;
}

function summarizeInstitution(decisionPackage: InstitutionalDecisionPackage): string {
  const passport = decisionPackage.artifacts.businessPassport;
  const legalName = passport.profiles.identityProfile.legalName ?? "Institution";
  const jurisdiction = passport.profiles.identityProfile.jurisdiction ?? "Unknown Jurisdiction";
  const entityType = passport.profiles.identityProfile.entityType ?? "Unspecified Entity";

  return `${legalName} (${entityType}) operating in ${jurisdiction}.`;
}

function summarizeTopRisk(decisionPackage: InstitutionalDecisionPackage): string {
  const topRisk = decisionPackage.artifacts.riskSignals[0];

  if (!topRisk) {
    return "No risk signals available in the current decision package.";
  }

  return `${topRisk.title}: ${topRisk.description}`;
}

function summarizeHealth(decisionPackage: InstitutionalDecisionPackage): string {
  const health = decisionPackage.artifacts.institutionHealth;

  return `${health.overallStatus} health with score ${Math.round(health.overallHealthScore * 100)}% at confidence ${Math.round(health.overallConfidence * 100)}%.`;
}

export function getExecutiveDecisionProjection(
  decisionPackage: InstitutionalDecisionPackage,
): ExecutiveDecisionProjection {
  const recommendation = decisionPackage.artifacts.explainabilityResult.recommendation;

  return {
    institutionSummary: summarizeInstitution(decisionPackage),
    overallConfidence: formatConfidence(decisionPackage.metadata.overallConfidence),
    decisionStatus: decisionPackage.metadata.packageStatus,
    recommendation: recommendation.title,
    recommendationPriority: recommendation.priority,
    topRiskSummary: summarizeTopRisk(decisionPackage),
    institutionHealthSummary: summarizeHealth(decisionPackage),
    pipelineVersion: decisionPackage.metadata.pipelineVersion,
    decisionPackageVersion: decisionPackage.metadata.pipelineVersion,
    generatedTimestamp: decisionPackage.metadata.generatedAt,
    nextRecommendedAction: recommendation.description,
  };
}
