import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { RelationshipReadinessStatus } from "@/lib/intelligence/RelationshipReadinessTypes";

export interface RelationshipWorkspaceExecutiveSummaryViewModel {
  readonly headline: string;
  readonly confidenceSnapshot: string;
  readonly evidenceSnapshot: string;
  readonly riskSnapshot: string;
}

export interface RelationshipWorkspaceConfidenceViewModel {
  readonly overallScore: number;
  readonly overallBand: ConfidenceBand;
  readonly corporateIdentityScore: number;
  readonly financialScore: number;
  readonly tradeScore: number;
  readonly complianceScore: number;
  readonly keyDrivers: readonly {
    readonly kind: "positive" | "negative";
    readonly category: "passport" | "evidence" | "knowledge" | "documents" | "compliance";
    readonly message: string;
    readonly impact: number;
  }[];
}

export interface RelationshipWorkspaceReadinessViewModel {
  readonly status: RelationshipReadinessStatus;
  readonly completedCount: number;
  readonly totalRequirements: number;
  readonly blockingIssues: readonly string[];
}

export interface RelationshipWorkspaceKeyInsightsViewModel {
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
}

export interface RelationshipWorkspaceOutstandingRequirementViewModel {
  readonly requirement: string;
  readonly details: string;
}

export interface RelationshipWorkspaceNextActionViewModel {
  readonly id: string;
  readonly label: string;
}

export interface RelationshipWorkspaceIntelligenceViewModel {
  readonly generatedAt: string;
  readonly executiveSummary: RelationshipWorkspaceExecutiveSummaryViewModel;
  readonly relationshipConfidence: RelationshipWorkspaceConfidenceViewModel;
  readonly readinessStatus: RelationshipWorkspaceReadinessViewModel;
  readonly keyInsights: RelationshipWorkspaceKeyInsightsViewModel;
  readonly outstandingRequirements: readonly RelationshipWorkspaceOutstandingRequirementViewModel[];
  readonly missingDocuments: readonly string[];
  readonly recommendedNextActions: readonly RelationshipWorkspaceNextActionViewModel[];
}
