import type { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import type { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { PassportGovernance } from "@/lib/business-passport/domain/Governance";
import type { PassportMetadata } from "@/lib/business-passport/domain/Metadata";
import type {
  AIProfile,
  ComplianceProfile,
  CreditProfile,
  EvidenceProfile,
  ExecutiveProfile,
  FinancialProfile,
  GovernanceProfile,
  IdentityProfile,
  InstitutionProfile,
  OperationalProfile,
  RelationshipProfile,
  RiskProfile,
  TimelineProfile,
  VersionProfile,
} from "@/lib/business-passport/domain/Profiles";
import type { Confidence } from "@/lib/business-passport/types/Confidence";
import type { InstitutionalPulse } from "@/lib/business-passport/types/InstitutionalPulse";
import type { KnowledgeDensity } from "@/lib/business-passport/types/KnowledgeDensity";
import type { PassportMaturity } from "@/lib/business-passport/types/PassportMaturity";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface BusinessPassportProfiles {
  readonly identityProfile: IdentityProfile;
  readonly institutionProfile: InstitutionProfile;
  readonly operationalProfile: OperationalProfile;
  readonly financialProfile: FinancialProfile;
  readonly relationshipProfile: RelationshipProfile;
  readonly riskProfile: RiskProfile;
  readonly creditProfile: CreditProfile;
  readonly complianceProfile: ComplianceProfile;
  readonly executiveProfile: ExecutiveProfile;
  readonly aiProfile: AIProfile;
  readonly governanceProfile: GovernanceProfile;
  readonly evidenceProfile: EvidenceProfile;
  readonly timelineProfile: TimelineProfile;
  readonly versionProfile: VersionProfile;
}

export interface BusinessPassport {
  readonly passportId: PassportId;
  readonly status: PassportStatus;
  readonly lifecycle: PassportLifecycle;
  readonly confidence: Confidence;
  readonly knowledgeDensity: KnowledgeDensity;
  readonly institutionalPulse: InstitutionalPulse;
  readonly maturity: PassportMaturity;
  readonly metadata: PassportMetadata;
  readonly governance: PassportGovernance;
  readonly profiles: BusinessPassportProfiles;
}
