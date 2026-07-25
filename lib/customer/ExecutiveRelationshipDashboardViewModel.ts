import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { RelationshipReadinessStatus } from "@/lib/intelligence/RelationshipReadinessTypes";

export interface ExecutiveRelationshipCustomerSnapshotViewModel {
  readonly customerName: string;
  readonly relationshipManager?: string;
  readonly industry?: string;
  readonly country?: string;
  readonly lifecycleStage?: string;
}

export interface ExecutiveRelationshipRecentDocumentViewModel {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly updatedAt: string;
}

export interface ExecutiveRelationshipRiskFlagViewModel {
  readonly severity: "low" | "medium" | "high";
  readonly message: string;
}

export interface ExecutiveRelationshipDashboardViewModel {
  readonly generatedAt: string;
  readonly executiveSummary: {
    readonly headline: string;
    readonly confidenceSnapshot: string;
    readonly evidenceSnapshot: string;
    readonly riskSnapshot: string;
  };
  readonly customerSnapshot: ExecutiveRelationshipCustomerSnapshotViewModel;
  readonly relationshipConfidence: {
    readonly overallScore: number;
    readonly overallBand: ConfidenceBand;
    readonly corporateIdentityScore: number;
    readonly financialScore: number;
    readonly tradeScore: number;
    readonly complianceScore: number;
  };
  readonly readinessStatus: {
    readonly status: RelationshipReadinessStatus;
    readonly completedCount: number;
    readonly totalRequirements: number;
    readonly blockingIssues: readonly string[];
  };
  readonly outstandingRequirements: readonly {
    readonly requirement: string;
    readonly details: string;
  }[];
  readonly missingDocuments: readonly string[];
  readonly keyBusinessInsights: {
    readonly strengths: readonly {
      readonly code: string;
      readonly message: string;
    }[];
    readonly informationGaps: readonly {
      readonly code: string;
      readonly message: string;
    }[];
    readonly inconsistencies: readonly {
      readonly code: string;
      readonly message: string;
    }[];
  };
  readonly recentDocuments: readonly ExecutiveRelationshipRecentDocumentViewModel[];
  readonly recommendedNextActions: readonly {
    readonly id: string;
    readonly label: string;
  }[];
  readonly riskAndAttentionFlags: readonly ExecutiveRelationshipRiskFlagViewModel[];
}
