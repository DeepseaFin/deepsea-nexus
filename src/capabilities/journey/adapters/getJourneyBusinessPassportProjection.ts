import { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type {
  ProfileBase,
  IdentityProfile,
  InstitutionProfile,
  OperationalProfile,
  FinancialProfile,
  RelationshipProfile,
  RiskProfile,
  CreditProfile,
  ComplianceProfile,
  ExecutiveProfile,
  AIProfile,
  GovernanceProfile,
  EvidenceProfile,
  TimelineProfile,
  VersionProfile,
} from "@/lib/business-passport/domain/Profiles";
import { knowledgeIdentityProjector } from "@/lib/business-passport/projections/KnowledgeIdentityProjector";
import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import { InstitutionalPulseState } from "@/lib/business-passport/types/InstitutionalPulse";
import { KnowledgeDensityBand } from "@/lib/business-passport/types/KnowledgeDensity";
import { PassportMaturityLevel } from "@/lib/business-passport/types/PassportMaturity";
import { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export type JourneyBusinessPassportViewModel = Pick<BusinessPassport, "status" | "metadata"> & {
  readonly profiles: {
    readonly identityProfile: IdentityProfile;
  };
};

const PROJECTION_TIMESTAMP = "2026-07-13T09:20:00Z";

function buildProfileBase(profileCode: string): ProfileBase {
  return {
    profileCode,
    lastUpdatedAt: PROJECTION_TIMESTAMP,
    confidence: {
      score: 88,
      band: ConfidenceBand.High,
      assessedAt: PROJECTION_TIMESTAMP,
      breakdown: [],
    },
    knowledgeDensity: {
      score: 76,
      band: KnowledgeDensityBand.Established,
      assessedAt: PROJECTION_TIMESTAMP,
      dimensions: [],
    },
    evidence: [],
  };
}

function buildBaselinePassport(): BusinessPassport {
  const passportId = PassportId.fromString("BPP-2401");

  const identityProfile: IdentityProfile = {
    ...buildProfileBase("IDENTITY"),
    legalName: "Northstar Exports LLC",
    registrationNumber: "REG-77421",
    jurisdiction: "UAE",
    incorporationDate: "2017-03-22",
    entityType: "Limited Liability Company",
  };

  const institutionProfile: InstitutionProfile = {
    ...buildProfileBase("INSTITUTION"),
  };

  const operationalProfile: OperationalProfile = {
    ...buildProfileBase("OPERATIONAL"),
  };

  const financialProfile: FinancialProfile = {
    ...buildProfileBase("FINANCIAL"),
  };

  const relationshipProfile: RelationshipProfile = {
    ...buildProfileBase("RELATIONSHIP"),
  };

  const riskProfile: RiskProfile = {
    ...buildProfileBase("RISK"),
  };

  const creditProfile: CreditProfile = {
    ...buildProfileBase("CREDIT"),
  };

  const complianceProfile: ComplianceProfile = {
    ...buildProfileBase("COMPLIANCE"),
  };

  const executiveProfile: ExecutiveProfile = {
    ...buildProfileBase("EXECUTIVE"),
  };

  const aiProfile: AIProfile = {
    ...buildProfileBase("AI"),
  };

  const governanceProfile: GovernanceProfile = {
    ...buildProfileBase("GOVERNANCE"),
  };

  const evidenceProfile: EvidenceProfile = {
    ...buildProfileBase("EVIDENCE"),
  };

  const timelineProfile: TimelineProfile = {
    ...buildProfileBase("TIMELINE"),
  };

  const versionProfile: VersionProfile = {
    ...buildProfileBase("VERSION"),
    schemaVersion: "1.0.0",
    modelVersion: "1.0.0",
    changeSetId: "journey-projection-seed",
  };

  return {
    id: passportId,
    version: 3,
    passportId,
    status: PassportStatus.UnderReview,
    lifecycle: PassportLifecycle.Onboarding,
    confidence: {
      score: 88,
      band: ConfidenceBand.High,
      assessedAt: PROJECTION_TIMESTAMP,
      breakdown: [],
    },
    knowledgeDensity: {
      score: 76,
      band: KnowledgeDensityBand.Established,
      assessedAt: PROJECTION_TIMESTAMP,
      dimensions: [],
    },
    institutionalPulse: {
      score: 72,
      state: InstitutionalPulseState.Stable,
      measuredAt: PROJECTION_TIMESTAMP,
      momentum: 0,
      drivers: [],
    },
    maturity: {
      level: PassportMaturityLevel.Developing,
      score: 68,
      assessedAt: PROJECTION_TIMESTAMP,
    },
    metadata: {
      audit: {
        createdAt: "2026-07-10T10:00:00Z",
        createdBy: "Identity Service",
        updatedAt: PROJECTION_TIMESTAMP,
        updatedBy: "Journey Operator",
      },
      lineage: {
        sourceSystems: ["DNOS-ONBOARDING"],
        sourceReferences: ["BUS-1190"],
        ingestedAt: "2026-07-10T10:05:00Z",
      },
      version: {
        aggregateVersion: 3,
        schemaVersion: "1.0.0",
        modelVersion: "1.0.0",
      },
    },
    governance: {
      controls: [],
      policyAssessments: [],
      decisions: [],
    },
    profiles: {
      identityProfile,
      institutionProfile,
      operationalProfile,
      financialProfile,
      relationshipProfile,
      riskProfile,
      creditProfile,
      complianceProfile,
      executiveProfile,
      aiProfile,
      governanceProfile,
      evidenceProfile,
      timelineProfile,
      versionProfile,
    },
  };
}

export function getJourneyBusinessPassportProjection(): JourneyBusinessPassportViewModel {
  const baselinePassport = buildBaselinePassport();
  const projection = knowledgeIdentityProjector.project({ facts: [] }, baselinePassport);

  return {
    status: projection.updatedPassport.status,
    metadata: projection.updatedPassport.metadata,
    profiles: {
      identityProfile: projection.updatedProfiles.identityProfile,
    },
  };
}

export function getJourneyProjectedBusinessPassport(): BusinessPassport {
  const baselinePassport = buildBaselinePassport();
  const projection = knowledgeIdentityProjector.project({ facts: [] }, baselinePassport);
  return projection.updatedPassport;
}