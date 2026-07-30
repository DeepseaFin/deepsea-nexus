import type {
  FinancialProfile,
  InstitutionProfile,
  OperationalProfile,
  RelationshipProfile,
} from "@/lib/business-passport/domain/Profiles";
import { businessPassportProfileService } from "@/lib/business-passport/services/BusinessPassportProfileService";
import type { PassportPanelModel } from "@/lib/customer/business-passport/passport-panel.types";
import type {
  BusinessPassportSectionId,
  BusinessPassportSectionCompletionStatus,
  BusinessPassportValidationStatus,
  BusinessPassportWorkspaceSectionComputedState,
  BusinessPassportWorkspaceSectionConfig,
} from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";

export interface BusinessPassportCompletionEngineInput {
  readonly sectionConfigs: readonly BusinessPassportWorkspaceSectionConfig[];
  readonly passportPanelModel: PassportPanelModel;
  readonly businessIdentity: {
    readonly legalName: string;
    readonly registrationNumber: string;
    readonly jurisdiction: string;
    readonly country?: string;
    readonly incorporationDate?: string;
    readonly entityType?: string;
    readonly industry?: string;
  };
  readonly documentState: {
    readonly status: "current" | "review" | "expiring";
    readonly name: string;
  }[];
  readonly evidenceState: {
    readonly status: "verified" | "review" | "missing";
    readonly name: string;
  }[];
  readonly relationshipState: {
    readonly score: number;
    readonly posture: string;
    readonly watchItems: string;
  };
  readonly workflowState: {
    readonly status: "on_track" | "attention" | "blocked";
    readonly name: string;
  }[];
  readonly knowledgeState: {
    readonly confidence: number;
    readonly title: string;
  }[];
  readonly activityCount: number;
}

interface SectionProgress {
  readonly completionPercentage: number;
  readonly validationStatus: BusinessPassportValidationStatus;
  readonly missingRequiredFields: readonly string[];
}

function toCompletionStatus(percent: number): BusinessPassportSectionCompletionStatus {
  if (percent <= 0) {
    return "not_started";
  }

  if (percent >= 100) {
    return "completed";
  }

  return "in_progress";
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function ratioToPercent(completed: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return clampPercent((completed / total) * 100);
}

function mapValidation(hasError: boolean, hasWarning: boolean): BusinessPassportValidationStatus {
  if (hasError) {
    return "error";
  }

  if (hasWarning) {
    return "warning";
  }

  return "success";
}

function toFinancialProfile(input: BusinessPassportCompletionEngineInput): FinancialProfile {
  const documentCoverage = input.documentState.filter((item) => item.status === "current").length;
  const evidenceCoverage = input.evidenceState.filter((item) => item.status === "verified").length;

  return {
    profileCode: "financial",
    lastUpdatedAt: new Date().toISOString(),
    confidence: input.passportPanelModel.passport.confidence,
    knowledgeDensity: input.passportPanelModel.passport.knowledgeDensity,
    evidence: [],
    estimatedRevenue: documentCoverage > 0 ? { amount: 120_000_000, currency: "AED", asOfDate: new Date().toISOString() } : undefined,
    verifiedRevenue: evidenceCoverage > 1 ? { amount: 110_000_000, currency: "AED", asOfDate: new Date().toISOString() } : undefined,
    workingCapital: documentCoverage > 1 ? { amount: 34_000_000, currency: "AED", asOfDate: new Date().toISOString() } : undefined,
    receivables: evidenceCoverage > 0 ? { amount: 24_000_000, currency: "AED", asOfDate: new Date().toISOString() } : undefined,
    payables: undefined,
    fundingHistory: undefined,
    bankingRelationships: undefined,
  };
}

function toInstitutionProfile(input: BusinessPassportCompletionEngineInput): InstitutionProfile {
  return {
    profileCode: "institution",
    lastUpdatedAt: new Date().toISOString(),
    confidence: input.passportPanelModel.passport.confidence,
    knowledgeDensity: input.passportPanelModel.passport.knowledgeDensity,
    evidence: [],
    parentCompany: input.businessIdentity.legalName,
    businessModel: input.businessIdentity.entityType,
    operatingRegions: input.businessIdentity.country ? [input.businessIdentity.country] : undefined,
    institutionSegment: input.businessIdentity.industry,
    institutionOwner: input.passportPanelModel.governanceProfile.owner,
    assignedCoverageTeam: [input.passportPanelModel.governanceProfile.custodian ?? "Coverage Team"],
  };
}

function toOperationalProfile(input: BusinessPassportCompletionEngineInput): OperationalProfile {
  return {
    profileCode: "operational",
    lastUpdatedAt: new Date().toISOString(),
    confidence: input.passportPanelModel.passport.confidence,
    knowledgeDensity: input.passportPanelModel.passport.knowledgeDensity,
    evidence: [],
    invoiceVolume: input.activityCount > 0 ? input.activityCount * 3 : undefined,
    averageDSO: input.relationshipState.score > 80 ? 26 : 34,
    operatingCountries: input.businessIdentity.country ? [input.businessIdentity.country] : undefined,
    businessModel: input.businessIdentity.entityType,
    operationalRiskSignals: input.relationshipState.watchItems === "0" ? [] : [input.relationshipState.watchItems],
  };
}

function toRelationshipProfile(input: BusinessPassportCompletionEngineInput): RelationshipProfile {
  return {
    profileCode: "relationship",
    lastUpdatedAt: new Date().toISOString(),
    confidence: input.passportPanelModel.passport.confidence,
    knowledgeDensity: input.passportPanelModel.passport.knowledgeDensity,
    evidence: [],
    relationshipStage: input.relationshipState.posture,
    engagementLevel: input.relationshipState.score >= 80 ? "high" : "moderate",
    responsiveness: input.activityCount > 0 ? "active" : "low",
    relationshipOwner: input.passportPanelModel.governanceProfile.owner,
  };
}

function identityProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const summaries = businessPassportProfileService.summarizeProfiles(
    {
      identityProfile: input.passportPanelModel.identityProfile,
      governanceProfile: input.passportPanelModel.governanceProfile,
      financialProfile: toFinancialProfile(input),
      institutionProfile: toInstitutionProfile(input),
      operationalProfile: toOperationalProfile(input),
    },
    new Date().toISOString(),
  );

  return {
    completionPercentage: summaries.identity.completeness.percentage,
    validationStatus: mapValidation(
      summaries.identity.validation.issues.some((issue) => issue.severity === "error"),
      summaries.identity.validation.issues.some((issue) => issue.severity === "warning"),
    ),
    missingRequiredFields: summaries.identity.completeness.missingFields,
  };
}

function ownershipProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const profile = toInstitutionProfile(input);
  const validation = businessPassportProfileService.validateProfiles(
    {
      identityProfile: input.passportPanelModel.identityProfile,
      governanceProfile: input.passportPanelModel.governanceProfile,
      financialProfile: toFinancialProfile(input),
      institutionProfile: profile,
      operationalProfile: toOperationalProfile(input),
    },
    new Date().toISOString(),
  ).institution;

  const missing = validation.issues.map((issue) => String(issue.field));
  const completedFields = 7 - missing.length;

  return {
    completionPercentage: ratioToPercent(completedFields, 7),
    validationStatus: mapValidation(
      validation.issues.some((issue) => issue.severity === "error"),
      validation.issues.some((issue) => issue.severity === "warning"),
    ),
    missingRequiredFields: missing,
  };
}

function documentsProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const completed = input.documentState.filter((item) => item.status === "current").length;
  const reviews = input.documentState.filter((item) => item.status === "review");
  const expiring = input.documentState.filter((item) => item.status === "expiring");

  return {
    completionPercentage: ratioToPercent(completed, input.documentState.length),
    validationStatus: mapValidation(expiring.length > 0, reviews.length > 0),
    missingRequiredFields: [...expiring, ...reviews].map((item) => item.name),
  };
}

function relationshipsProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const profile = toRelationshipProfile(input);
  const completedSignals = [profile.relationshipStage, profile.engagementLevel, profile.responsiveness, profile.relationshipOwner].filter(Boolean).length;
  const missing = [
    !profile.relationshipStage ? "relationshipStage" : null,
    !profile.engagementLevel ? "engagementLevel" : null,
    !profile.responsiveness ? "responsiveness" : null,
    !profile.relationshipOwner ? "relationshipOwner" : null,
  ].filter((item): item is string => Boolean(item));

  return {
    completionPercentage: ratioToPercent(completedSignals, 4),
    validationStatus: mapValidation(input.relationshipState.score < 60, input.relationshipState.score < 80),
    missingRequiredFields: missing,
  };
}

function complianceProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const summaries = businessPassportProfileService.summarizeProfiles(
    {
      identityProfile: input.passportPanelModel.identityProfile,
      governanceProfile: input.passportPanelModel.governanceProfile,
      financialProfile: toFinancialProfile(input),
      institutionProfile: toInstitutionProfile(input),
      operationalProfile: toOperationalProfile(input),
    },
    new Date().toISOString(),
  );

  const evidenceMissing = input.evidenceState.filter((item) => item.status === "missing").map((item) => item.name);
  const governanceMissing = summaries.governance.completeness.missingFields.map((field) => String(field));

  return {
    completionPercentage: ratioToPercent(
      input.evidenceState.filter((item) => item.status === "verified").length + summaries.governance.completeness.completedFields.length,
      input.evidenceState.length + summaries.governance.completeness.completedFields.length + governanceMissing.length,
    ),
    validationStatus: mapValidation(evidenceMissing.length > 0, governanceMissing.length > 0),
    missingRequiredFields: [...evidenceMissing, ...governanceMissing],
  };
}

function financialProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const summaries = businessPassportProfileService.summarizeProfiles(
    {
      identityProfile: input.passportPanelModel.identityProfile,
      governanceProfile: input.passportPanelModel.governanceProfile,
      financialProfile: toFinancialProfile(input),
      institutionProfile: toInstitutionProfile(input),
      operationalProfile: toOperationalProfile(input),
    },
    new Date().toISOString(),
  );

  return {
    completionPercentage: summaries.financial.completeness.percentage,
    validationStatus: mapValidation(
      summaries.financial.validation.issues.some((issue) => issue.severity === "error"),
      summaries.financial.validation.issues.some((issue) => issue.severity === "warning"),
    ),
    missingRequiredFields: summaries.financial.completeness.missingFields,
  };
}

function evidenceProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const verified = input.evidenceState.filter((item) => item.status === "verified").length;
  const missing = input.evidenceState.filter((item) => item.status === "missing").map((item) => item.name);
  const review = input.evidenceState.filter((item) => item.status === "review").map((item) => item.name);

  return {
    completionPercentage: ratioToPercent(verified, input.evidenceState.length),
    validationStatus: mapValidation(missing.length > 0, review.length > 0),
    missingRequiredFields: [...missing, ...review],
  };
}

function knowledgeProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const averageConfidence = input.knowledgeState.length === 0
    ? 0
    : clampPercent(
      input.knowledgeState.reduce((sum, signal) => sum + signal.confidence, 0) / input.knowledgeState.length,
    );

  return {
    completionPercentage: averageConfidence,
    validationStatus: mapValidation(averageConfidence < 50, averageConfidence < 75),
    missingRequiredFields: input.knowledgeState.length > 0 ? [] : ["knowledgeSignals"],
  };
}

function workflowProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const onTrack = input.workflowState.filter((item) => item.status === "on_track").length;
  const attention = input.workflowState.filter((item) => item.status === "attention").map((item) => item.name);
  const blocked = input.workflowState.filter((item) => item.status === "blocked").map((item) => item.name);

  return {
    completionPercentage: ratioToPercent(onTrack, input.workflowState.length),
    validationStatus: mapValidation(blocked.length > 0, attention.length > 0),
    missingRequiredFields: [...blocked, ...attention],
  };
}

function activityProgress(input: BusinessPassportCompletionEngineInput): SectionProgress {
  const completionPercentage = input.activityCount >= 4 ? 100 : ratioToPercent(input.activityCount, 4);

  return {
    completionPercentage,
    validationStatus: mapValidation(input.activityCount === 0, input.activityCount < 2),
    missingRequiredFields: input.activityCount > 0 ? [] : ["activityEvents"],
  };
}

function computeSectionProgress(
  sectionId: BusinessPassportSectionId,
  input: BusinessPassportCompletionEngineInput,
): SectionProgress {
  if (sectionId === "identity") {
    return identityProgress(input);
  }

  if (sectionId === "ownership") {
    return ownershipProgress(input);
  }

  if (sectionId === "documents") {
    return documentsProgress(input);
  }

  if (sectionId === "relationships") {
    return relationshipsProgress(input);
  }

  if (sectionId === "compliance") {
    return complianceProgress(input);
  }

  if (sectionId === "financials") {
    return financialProgress(input);
  }

  if (sectionId === "evidence") {
    return evidenceProgress(input);
  }

  if (sectionId === "knowledge") {
    return knowledgeProgress(input);
  }

  if (sectionId === "workflow") {
    return workflowProgress(input);
  }

  return activityProgress(input);
}

export function computeBusinessPassportSectionStates(
  input: BusinessPassportCompletionEngineInput,
): readonly BusinessPassportWorkspaceSectionComputedState[] {
  return input.sectionConfigs.map((section) => {
    const progress = computeSectionProgress(section.id, input);

    return {
      ...section,
      completionPercentage: progress.completionPercentage,
      completionStatus: toCompletionStatus(progress.completionPercentage),
      validationStatus: progress.validationStatus,
      missingRequiredFields: progress.missingRequiredFields,
      disabled: Boolean(section.disabled),
    };
  });
}
