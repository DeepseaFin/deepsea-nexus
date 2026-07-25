import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";

export interface RelationshipConfidenceInput {
  readonly passportId: string;
  readonly customerId?: string;
  readonly documentIds?: readonly string[];
  readonly requiredDocuments?: readonly {
    readonly code: string;
    readonly label: string;
    readonly matchers: readonly string[];
  }[];
}

export interface ConfidenceComponent {
  readonly score: number;
  readonly band: ConfidenceBand;
  readonly rationale: readonly string[];
}

export interface ConfidenceDriver {
  readonly kind: "positive" | "negative";
  readonly category: "passport" | "evidence" | "knowledge" | "documents" | "compliance";
  readonly message: string;
  readonly impact: number;
}

export interface RelationshipConfidenceReport {
  readonly generatedAt: string;
  readonly overallConfidenceScore: number;
  readonly overallConfidenceBand: ConfidenceBand;
  readonly corporateIdentityConfidence: ConfidenceComponent;
  readonly financialConfidence: ConfidenceComponent;
  readonly tradeConfidence: ConfidenceComponent;
  readonly complianceConfidence: ConfidenceComponent;
  readonly missingCriticalDocuments: readonly string[];
  readonly confidenceDrivers: readonly ConfidenceDriver[];
}
