import type { EvidenceCorrelationEngine } from "@/lib/intelligence/EvidenceCorrelationEngine";
import type { RelationshipConfidenceEngine } from "@/lib/intelligence/RelationshipConfidenceEngine";
import type { RelationshipInsightsEngine } from "@/lib/intelligence/RelationshipInsightsEngine";
import type { RelationshipIntelligenceEngine } from "@/lib/intelligence/RelationshipIntelligenceEngine";
import type {
  ReadinessRequirementResult,
  RelationshipReadinessInput,
  RelationshipReadinessReport,
  RelationshipReadinessStatus,
} from "@/lib/intelligence/RelationshipReadinessTypes";

const DEFAULT_MIN_CONFIDENCE = 65;
const DEFAULT_MIN_EVIDENCE_VALIDITY_RATIO = 0.65;

function toRatio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function percentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function evaluateRequirements(params: {
  readonly identityComplete: boolean;
  readonly financialComplete: boolean;
  readonly tradeDocumentsComplete: boolean;
  readonly complianceDocsComplete: boolean;
  readonly evidenceQualityOk: boolean;
  readonly confidenceOk: boolean;
  readonly noOutstandingInfoGaps: boolean;
  readonly identityCompletenessDetail: string;
  readonly financialCompletenessDetail: string;
  readonly tradeCoverageDetail: string;
  readonly complianceDetail: string;
  readonly evidenceQualityDetail: string;
  readonly confidenceDetail: string;
  readonly outstandingInfoDetail: string;
}): readonly ReadinessRequirementResult[] {
  return [
    {
      requirement: "Corporate identity completeness",
      isCompleted: params.identityComplete,
      details: params.identityCompletenessDetail,
    },
    {
      requirement: "Financial profile completeness",
      isCompleted: params.financialComplete,
      details: params.financialCompletenessDetail,
    },
    {
      requirement: "Trade documentation completeness",
      isCompleted: params.tradeDocumentsComplete,
      details: params.tradeCoverageDetail,
    },
    {
      requirement: "Compliance documentation completeness",
      isCompleted: params.complianceDocsComplete,
      details: params.complianceDetail,
    },
    {
      requirement: "Evidence quality threshold",
      isCompleted: params.evidenceQualityOk,
      details: params.evidenceQualityDetail,
    },
    {
      requirement: "Relationship confidence threshold",
      isCompleted: params.confidenceOk,
      details: params.confidenceDetail,
    },
    {
      requirement: "Outstanding information requirements",
      isCompleted: params.noOutstandingInfoGaps,
      details: params.outstandingInfoDetail,
    },
  ];
}

function deriveOverallStatus(params: {
  readonly completedCount: number;
  readonly totalCount: number;
  readonly blockingIssues: readonly string[];
}): RelationshipReadinessStatus {
  if (params.blockingIssues.length > 0) {
    return "not_ready";
  }

  if (params.completedCount === params.totalCount) {
    return "ready";
  }

  return "needs_attention";
}

function buildRecommendedNextSteps(params: {
  readonly outstandingRequirements: readonly ReadinessRequirementResult[];
  readonly missingDocuments: readonly string[];
  readonly blockingIssues: readonly string[];
  readonly existingSuggestions: readonly string[];
}): readonly string[] {
  const steps: string[] = [];

  if (params.missingDocuments.length > 0) {
    steps.push(`Collect missing required documents: ${params.missingDocuments.join(", ")}.`);
  }

  for (const requirement of params.outstandingRequirements) {
    steps.push(`Resolve requirement: ${requirement.requirement}. ${requirement.details}`);
  }

  for (const issue of params.blockingIssues) {
    steps.push(`Address blocking issue: ${issue}`);
  }

  for (const suggestion of params.existingSuggestions) {
    if (!steps.includes(suggestion)) {
      steps.push(suggestion);
    }
  }

  if (steps.length === 0) {
    steps.push("Maintain readiness posture and monitor incoming evidence updates.");
  }

  return steps;
}

export interface RelationshipReadinessEngineDependencies {
  readonly relationshipIntelligenceEngine: RelationshipIntelligenceEngine;
  readonly evidenceCorrelationEngine: EvidenceCorrelationEngine;
  readonly relationshipConfidenceEngine: RelationshipConfidenceEngine;
  readonly relationshipInsightsEngine: RelationshipInsightsEngine;
}

export interface RelationshipReadinessEngine {
  evaluateReadiness(input: RelationshipReadinessInput): Promise<RelationshipReadinessReport>;
}

export function createRelationshipReadinessEngine(
  dependencies: RelationshipReadinessEngineDependencies,
): RelationshipReadinessEngine {
  return {
    async evaluateReadiness(input: RelationshipReadinessInput): Promise<RelationshipReadinessReport> {
      const generatedAt = new Date().toISOString();

      const [relationshipReport, correlationReport, confidenceReport, insightsReport] = await Promise.all([
        dependencies.relationshipIntelligenceEngine.generateReport({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
          requiredDocuments: input.requiredDocuments,
        }),
        dependencies.evidenceCorrelationEngine.correlateEvidence({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
        }),
        dependencies.relationshipConfidenceEngine.generateConfidenceReport({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
          requiredDocuments: input.requiredDocuments,
        }),
        dependencies.relationshipInsightsEngine.generateInsights({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
          requiredDocuments: input.requiredDocuments,
        }),
      ]);

      const minimumOverallConfidence = input.minimumOverallConfidence ?? DEFAULT_MIN_CONFIDENCE;
      const minimumEvidenceValidityRatio = input.minimumEvidenceValidityRatio ?? DEFAULT_MIN_EVIDENCE_VALIDITY_RATIO;

      const identitySignals = [
        relationshipReport.corporateIdentitySummary.legalName,
        relationshipReport.corporateIdentitySummary.registrationNumber,
        relationshipReport.corporateIdentitySummary.jurisdiction,
        relationshipReport.corporateIdentitySummary.entityType,
      ];
      const identityPresentCount = identitySignals.filter((value) => Boolean(value)).length;
      const identityComplete = identityPresentCount >= 4;

      const financialSignals = [
        relationshipReport.financialSummary.revenueRange,
        relationshipReport.financialSummary.monthlyTurnover,
        relationshipReport.financialSummary.profitabilitySignal,
        relationshipReport.financialSummary.fundingNeed,
      ];
      const financialPresentCount = financialSignals.filter((value) => Boolean(value)).length;
      const financialComplete = financialPresentCount >= 2
        || relationshipReport.financialSummary.bankingRelationshipCount > 0;

      const tradeDocumentsComplete =
        relationshipReport.tradeActivitySummary.invoiceCount > 0
        && relationshipReport.tradeActivitySummary.shipmentDocumentCount > 0;

      const complianceDocsComplete =
        Boolean(relationshipReport.complianceSummary.jurisdictionalStatus)
        && relationshipReport.complianceSummary.complianceSignals.length > 0;

      const evidenceValidityRatio = toRatio(
        relationshipReport.evidenceSummary.validEvidence,
        relationshipReport.evidenceSummary.totalEvidence,
      );
      const evidenceQualityOk = evidenceValidityRatio >= minimumEvidenceValidityRatio
        && relationshipReport.evidenceSummary.invalidEvidence === 0;

      const confidenceOk = confidenceReport.overallConfidenceScore >= minimumOverallConfidence;

      const noOutstandingInfoGaps = insightsReport.openInformationGaps.length === 0;

      const requirements = evaluateRequirements({
        identityComplete,
        financialComplete,
        tradeDocumentsComplete,
        complianceDocsComplete,
        evidenceQualityOk,
        confidenceOk,
        noOutstandingInfoGaps,
        identityCompletenessDetail: `${identityPresentCount}/4 core identity fields present.`,
        financialCompletenessDetail:
          `${financialPresentCount}/4 financial summary signals present; banking relationships ${relationshipReport.financialSummary.bankingRelationshipCount}.`,
        tradeCoverageDetail:
          `Invoices ${relationshipReport.tradeActivitySummary.invoiceCount}, shipment docs ${relationshipReport.tradeActivitySummary.shipmentDocumentCount}.`,
        complianceDetail:
          `Jurisdiction status: ${relationshipReport.complianceSummary.jurisdictionalStatus ?? "missing"}; compliance signals ${relationshipReport.complianceSummary.complianceSignals.length}.`,
        evidenceQualityDetail:
          `Valid evidence ratio ${percentage(evidenceValidityRatio)} (minimum ${percentage(minimumEvidenceValidityRatio)}), invalid evidence ${relationshipReport.evidenceSummary.invalidEvidence}.`,
        confidenceDetail:
          `Overall confidence ${confidenceReport.overallConfidenceScore} (minimum ${minimumOverallConfidence}).`,
        outstandingInfoDetail:
          `${insightsReport.openInformationGaps.length} open information gap(s) detected.`,
      });

      const completedRequirements = requirements.filter((item) => item.isCompleted);
      const outstandingRequirements = requirements.filter((item) => !item.isCompleted);

      const blockingIssues: string[] = [];

      if (relationshipReport.missingDocuments.length > 0) {
        blockingIssues.push(`Missing required documents: ${relationshipReport.missingDocuments.join(", ")}.`);
      }

      if (correlationReport.conflictingFacts > 0) {
        blockingIssues.push(`Evidence conflicts detected for ${correlationReport.conflictingFacts} fact(s).`);
      }

      if (relationshipReport.evidenceSummary.invalidEvidence > 0) {
        blockingIssues.push(`${relationshipReport.evidenceSummary.invalidEvidence} invalid evidence item(s) require remediation.`);
      }

      if (!confidenceOk) {
        blockingIssues.push(
          `Confidence threshold unmet: ${confidenceReport.overallConfidenceScore}/${minimumOverallConfidence}.`,
        );
      }

      const overallReadinessStatus = deriveOverallStatus({
        completedCount: completedRequirements.length,
        totalCount: requirements.length,
        blockingIssues,
      });

      const recommendedNextSteps = buildRecommendedNextSteps({
        outstandingRequirements,
        missingDocuments: relationshipReport.missingDocuments,
        blockingIssues,
        existingSuggestions: insightsReport.recommendedNextSteps,
      });

      return {
        generatedAt,
        overallReadinessStatus,
        completedRequirements,
        outstandingRequirements,
        missingDocuments: relationshipReport.missingDocuments,
        blockingIssues,
        recommendedNextSteps,
      };
    },
  };
}
