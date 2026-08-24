import type { EvidenceCorrelationEngine } from "@/lib/intelligence/EvidenceCorrelationEngine";
import type { RelationshipConfidenceEngine } from "@/lib/intelligence/RelationshipConfidenceEngine";
import type { RelationshipInsightsEngine } from "@/lib/intelligence/RelationshipInsightsEngine";
import type { RelationshipIntelligenceEngine } from "@/lib/intelligence/RelationshipIntelligenceEngine";
import type { RelationshipReadinessEngine } from "@/lib/intelligence/RelationshipReadinessEngine";
import type { RelationshipRequiredDocument } from "@/lib/intelligence/RelationshipIntelligenceTypes";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";

export interface RelationshipWorkspaceIntelligenceInput {
  readonly passportId: string;
  readonly customerId?: string;
  readonly documentIds?: readonly string[];
  readonly requiredDocuments?: readonly RelationshipRequiredDocument[];
}

export interface RelationshipWorkspaceIntelligenceDependencies {
  readonly relationshipIntelligenceEngine: RelationshipIntelligenceEngine;
  readonly evidenceCorrelationEngine: EvidenceCorrelationEngine;
  readonly relationshipConfidenceEngine: RelationshipConfidenceEngine;
  readonly relationshipInsightsEngine: RelationshipInsightsEngine;
  readonly relationshipReadinessEngine: RelationshipReadinessEngine;
}

export interface RelationshipWorkspaceIntelligenceService {
  buildViewModel(input: RelationshipWorkspaceIntelligenceInput): Promise<RelationshipWorkspaceIntelligenceViewModel>;
}

function toNextActionId(index: number): string {
  return `next-action-${index + 1}`;
}

export function createRelationshipWorkspaceIntelligence(
  dependencies: RelationshipWorkspaceIntelligenceDependencies,
): RelationshipWorkspaceIntelligenceService {
  return {
    async buildViewModel(input: RelationshipWorkspaceIntelligenceInput): Promise<RelationshipWorkspaceIntelligenceViewModel> {
      const [
        relationshipReport,
        correlationReport,
        confidenceReport,
        insightsReport,
        readinessReport,
      ] = await Promise.all([
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
        dependencies.relationshipReadinessEngine.evaluateReadiness({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
          requiredDocuments: input.requiredDocuments,
        }),
      ]);

      return {
        generatedAt: new Date().toISOString(),
        executiveSummary: {
          headline: insightsReport.executiveSummary.headline,
          confidenceSnapshot: insightsReport.executiveSummary.confidenceSnapshot,
          evidenceSnapshot: `${insightsReport.executiveSummary.evidenceSnapshot} Correlated facts: ${correlationReport.totalFacts}.`,
          riskSnapshot:
            `${insightsReport.executiveSummary.riskSnapshot} Institutional alerts: ${relationshipReport.institutionalAlerts.length}.`,
        },
        relationshipConfidence: {
          overallScore: confidenceReport.overallConfidenceScore,
          overallBand: confidenceReport.overallConfidenceBand,
          corporateIdentityScore: confidenceReport.corporateIdentityConfidence.score,
          financialScore: confidenceReport.financialConfidence.score,
          tradeScore: confidenceReport.tradeConfidence.score,
          complianceScore: confidenceReport.complianceConfidence.score,
          keyDrivers: confidenceReport.confidenceDrivers,
        },
        readinessStatus: {
          status: readinessReport.overallReadinessStatus,
          completedCount: readinessReport.completedRequirements.length,
          totalRequirements:
            readinessReport.completedRequirements.length + readinessReport.outstandingRequirements.length,
          blockingIssues: readinessReport.blockingIssues,
        },
        keyInsights: {
          strengths: insightsReport.keyStrengths,
          informationGaps: insightsReport.openInformationGaps,
          inconsistencies: insightsReport.potentialInconsistencies,
        },
        outstandingRequirements: readinessReport.outstandingRequirements.map((requirement) => ({
          requirement: requirement.requirement,
          details: requirement.details,
        })),
        missingDocuments: readinessReport.missingDocuments,
        recommendedNextActions: readinessReport.recommendedNextSteps.map((step, index) => ({
          id: toNextActionId(index),
          label: step,
        })),
      };
    },
  };
}
