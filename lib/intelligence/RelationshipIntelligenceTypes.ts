import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";

export interface RelationshipRequiredDocument {
  readonly code: string;
  readonly label: string;
  readonly matchers: readonly string[];
}

export interface RelationshipIntelligenceInput {
  readonly passportId: string;
  readonly customerId?: string;
  readonly documentIds?: readonly string[];
  readonly knowledgeFactNames?: readonly string[];
  readonly requiredDocuments?: readonly RelationshipRequiredDocument[];
}

export interface CorporateIdentitySummary {
  readonly legalName?: string;
  readonly registrationNumber?: string;
  readonly jurisdiction?: string;
  readonly entityType?: string;
  readonly incorporationDate?: string;
}

export interface FinancialSummary {
  readonly revenueRange?: string;
  readonly monthlyTurnover?: string;
  readonly profitabilitySignal?: string;
  readonly fundingNeed?: string;
  readonly bankingRelationshipCount: number;
}

export interface TradeActivitySummary {
  readonly invoiceCount: number;
  readonly shipmentDocumentCount: number;
  readonly counterparties: readonly string[];
  readonly recentTradeSignals: readonly string[];
}

export interface ComplianceSummary {
  readonly jurisdictionalStatus?: string;
  readonly sanctionsScreeningStatus?: string;
  readonly complianceSignals: readonly string[];
}

export interface DocumentCoverageSummary {
  readonly totalDocuments: number;
  readonly matchedRequiredDocuments: readonly string[];
  readonly missingDocuments: readonly string[];
}

export interface EvidenceSummary {
  readonly totalEvidence: number;
  readonly validEvidence: number;
  readonly pendingValidationEvidence: number;
  readonly invalidEvidence: number;
  readonly uniqueSources: number;
}

export interface KnowledgeSummary {
  readonly totalFacts: number;
  readonly verifiedFacts: number;
  readonly averageConfidence: number;
  readonly factCoverage: readonly string[];
}

export interface RelationshipConfidenceSummary {
  readonly score: number;
  readonly band: ConfidenceBand;
  readonly rationale: readonly string[];
}

export interface InstitutionalAlert {
  readonly severity: "low" | "medium" | "high";
  readonly code: string;
  readonly message: string;
  readonly source: "documents" | "evidence" | "knowledge" | "passport";
}

export interface RelationshipIntelligenceReport {
  readonly generatedAt: string;
  readonly corporateIdentitySummary: CorporateIdentitySummary;
  readonly financialSummary: FinancialSummary;
  readonly tradeActivitySummary: TradeActivitySummary;
  readonly complianceSummary: ComplianceSummary;
  readonly documentCoverage: DocumentCoverageSummary;
  readonly evidenceSummary: EvidenceSummary;
  readonly knowledgeSummary: KnowledgeSummary;
  readonly missingDocuments: readonly string[];
  readonly relationshipConfidence: RelationshipConfidenceSummary;
  readonly institutionalAlerts: readonly InstitutionalAlert[];
}
