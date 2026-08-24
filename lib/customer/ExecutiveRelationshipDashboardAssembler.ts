import type {
  ExecutiveRelationshipCustomerSnapshotViewModel,
  ExecutiveRelationshipDashboardViewModel,
  ExecutiveRelationshipRecentDocumentViewModel,
  ExecutiveRelationshipRiskFlagViewModel,
} from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";

export interface ExecutiveRelationshipDashboardAssemblerInput {
  readonly intelligence: RelationshipWorkspaceIntelligenceViewModel;
  readonly customerSnapshot: ExecutiveRelationshipCustomerSnapshotViewModel;
  readonly recentDocuments?: readonly ExecutiveRelationshipRecentDocumentViewModel[];
  readonly riskAndAttentionFlags?: readonly ExecutiveRelationshipRiskFlagViewModel[];
}

export interface ExecutiveRelationshipDashboardAssembler {
  assemble(input: ExecutiveRelationshipDashboardAssemblerInput): ExecutiveRelationshipDashboardViewModel;
}

export function createExecutiveRelationshipDashboardAssembler(): ExecutiveRelationshipDashboardAssembler {
  return {
    assemble(input: ExecutiveRelationshipDashboardAssemblerInput): ExecutiveRelationshipDashboardViewModel {
      return {
        generatedAt: new Date().toISOString(),
        executiveSummary: {
          headline: input.intelligence.executiveSummary.headline,
          confidenceSnapshot: input.intelligence.executiveSummary.confidenceSnapshot,
          evidenceSnapshot: input.intelligence.executiveSummary.evidenceSnapshot,
          riskSnapshot: input.intelligence.executiveSummary.riskSnapshot,
        },
        customerSnapshot: input.customerSnapshot,
        relationshipConfidence: {
          overallScore: input.intelligence.relationshipConfidence.overallScore,
          overallBand: input.intelligence.relationshipConfidence.overallBand,
          corporateIdentityScore: input.intelligence.relationshipConfidence.corporateIdentityScore,
          financialScore: input.intelligence.relationshipConfidence.financialScore,
          tradeScore: input.intelligence.relationshipConfidence.tradeScore,
          complianceScore: input.intelligence.relationshipConfidence.complianceScore,
        },
        readinessStatus: {
          status: input.intelligence.readinessStatus.status,
          completedCount: input.intelligence.readinessStatus.completedCount,
          totalRequirements: input.intelligence.readinessStatus.totalRequirements,
          blockingIssues: input.intelligence.readinessStatus.blockingIssues,
        },
        outstandingRequirements: input.intelligence.outstandingRequirements,
        missingDocuments: input.intelligence.missingDocuments,
        keyBusinessInsights: {
          strengths: input.intelligence.keyInsights.strengths,
          informationGaps: input.intelligence.keyInsights.informationGaps,
          inconsistencies: input.intelligence.keyInsights.inconsistencies,
        },
        recentDocuments: input.recentDocuments ?? [],
        recommendedNextActions: input.intelligence.recommendedNextActions,
        riskAndAttentionFlags: input.riskAndAttentionFlags ?? [],
      };
    },
  };
}
