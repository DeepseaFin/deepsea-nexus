import type { Confidence } from "@/lib/business-passport/types/Confidence";
import type { EvidenceReference } from "@/lib/business-passport/types/EvidenceReference";
import type { KnowledgeDensity } from "@/lib/business-passport/types/KnowledgeDensity";
import type {
  BankingRelationship,
  BranchRecord,
  FundingHistoryEntry,
  GovernanceApprovalStatus,
  MonetaryAmount,
  OwnershipStructure,
  ReviewFrequency,
  StrategicClassification,
} from "@/lib/business-passport/types/ProfileFieldModels";

export interface ProfileBase {
  readonly profileCode: string;
  readonly lastUpdatedAt: string;
  readonly confidence: Confidence;
  readonly knowledgeDensity: KnowledgeDensity;
  readonly evidence: readonly EvidenceReference[];
}

export interface IdentityProfile extends ProfileBase {
  readonly legalName?: string;
  readonly tradingName?: string;
  readonly registrationNumber?: string;
  readonly jurisdiction?: string;
  readonly country?: string;
  readonly incorporationDate?: string;
  readonly entityType?: string;
  readonly industry?: string;
  readonly website?: string;
}

export interface InstitutionProfile extends ProfileBase {
  readonly ownershipStructure?: OwnershipStructure;
  readonly parentCompany?: string;
  readonly subsidiaries?: readonly string[];
  readonly businessModel?: string;
  readonly strategicClassification?: StrategicClassification;
  readonly yearsInBusiness?: number;
  readonly operatingRegions?: readonly string[];
  readonly institutionSegment?: string;
  readonly institutionalGrade?: string;
  readonly institutionOwner?: string;
  readonly assignedCoverageTeam?: readonly string[];
}

export interface OperationalProfile extends ProfileBase {
  readonly employeeCount?: number;
  readonly branches?: readonly BranchRecord[];
  readonly accountingPlatform?: string;
  readonly erpPlatform?: string;
  readonly invoiceVolume?: number;
  readonly averageDSO?: number;
  readonly operatingCountries?: readonly string[];
  readonly businessModel?: string;
  readonly operatingMarkets?: readonly string[];
  readonly operatingRegions?: readonly string[];
  readonly operationalRiskSignals?: readonly string[];
}

export interface FinancialProfile extends ProfileBase {
  readonly estimatedRevenue?: MonetaryAmount;
  readonly verifiedRevenue?: MonetaryAmount;
  readonly workingCapital?: MonetaryAmount;
  readonly receivables?: MonetaryAmount;
  readonly payables?: MonetaryAmount;
  readonly fundingHistory?: readonly FundingHistoryEntry[];
  readonly bankingRelationships?: readonly BankingRelationship[];
  readonly revenueRange?: string;
  readonly monthlyTurnover?: string;
  readonly profitabilitySignal?: string;
  readonly fundingNeed?: string;
}

export interface RelationshipProfile extends ProfileBase {
  readonly relationshipStage?: string;
  readonly engagementLevel?: string;
  readonly responsiveness?: string;
  readonly relationshipOwner?: string;
}

export interface RiskProfile extends ProfileBase {
  readonly riskLevel?: string;
  readonly riskSignals?: readonly string[];
  readonly mitigants?: readonly string[];
}

export interface CreditProfile extends ProfileBase {
  readonly creditConfidenceIndex?: number;
  readonly documentationCompletenessScore?: number;
  readonly fundingReadiness?: string;
}

export interface ComplianceProfile extends ProfileBase {
  readonly jurisdictionalStatus?: string;
  readonly sanctionsScreeningStatus?: string;
  readonly complianceSignals?: readonly string[];
}

export interface ExecutiveProfile extends ProfileBase {
  readonly executiveNarrative?: string;
  readonly executivePriority?: string;
  readonly portfolioSignal?: string;
}

export interface AIProfile extends ProfileBase {
  readonly orchestratorConfidence?: number;
  readonly insightCount?: number;
  readonly unresolvedConflicts?: number;
}

export interface GovernanceProfile extends ProfileBase {
  readonly owner?: string;
  readonly custodian?: string;
  readonly reviewer?: string;
  readonly approvalStatus?: GovernanceApprovalStatus;
  readonly reviewFrequency?: ReviewFrequency;
  readonly lastReview?: string;
  readonly policyVersion?: string;
  readonly governanceStatus?: string;
  readonly policyAlerts?: readonly string[];
  readonly escalationState?: string;
}

export interface EvidenceProfile extends ProfileBase {
  readonly evidenceCoverageScore?: number;
  readonly missingEvidenceItems?: readonly string[];
  readonly staleEvidenceItems?: readonly string[];
}

export interface TimelineProfile extends ProfileBase {
  readonly currentLifecycleStep?: string;
  readonly nextLifecycleStep?: string;
  readonly lastMaterialEventAt?: string;
}

export interface VersionProfile extends ProfileBase {
  readonly schemaVersion: string;
  readonly modelVersion: string;
  readonly changeSetId: string;
}

export type IdentityProfileField =
  | "legalName"
  | "tradingName"
  | "registrationNumber"
  | "jurisdiction"
  | "country"
  | "incorporationDate"
  | "entityType"
  | "industry"
  | "website";

export type InstitutionProfileField =
  | "ownershipStructure"
  | "parentCompany"
  | "subsidiaries"
  | "businessModel"
  | "strategicClassification"
  | "yearsInBusiness"
  | "operatingRegions";

export type FinancialProfileField =
  | "estimatedRevenue"
  | "verifiedRevenue"
  | "workingCapital"
  | "receivables"
  | "payables"
  | "fundingHistory"
  | "bankingRelationships";

export type OperationalProfileField =
  | "employeeCount"
  | "branches"
  | "accountingPlatform"
  | "erpPlatform"
  | "invoiceVolume"
  | "averageDSO"
  | "operatingCountries";

export type GovernanceProfileField =
  | "owner"
  | "custodian"
  | "reviewer"
  | "approvalStatus"
  | "reviewFrequency"
  | "lastReview"
  | "policyVersion";
