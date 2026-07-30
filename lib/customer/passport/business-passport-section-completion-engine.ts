import type {
  FinancialProfile,
  InstitutionProfile,
  OperationalProfile,
  RelationshipProfile,
} from "@/lib/business-passport/domain/Profiles";
import { businessPassportProfileService } from "@/lib/business-passport/services/BusinessPassportProfileService";
import type { PassportPanelModel } from "@/lib/customer/business-passport/passport-panel.types";
import type {
  BusinessPassportSectionCompletionStatus,
  BusinessPassportWorkspaceSectionComputedState,
} from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";
import {
  type BusinessPassportCompletionStrategyId,
  getEnabledSections,
} from "@/lib/customer/passport/business-passport-section-registry";
import type { BusinessPassportValidationStatus } from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";

export interface BusinessPassportCompletionEngineInput {
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

interface SectionStrategyEvaluation {
  readonly completionPercentage: number;
  readonly missingRequiredFields: readonly string[];
  readonly hasError: boolean;
  readonly hasWarning: boolean;
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

function identityProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
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
    missingRequiredFields: summaries.identity.completeness.missingFields,
    hasError: summaries.identity.validation.issues.some((issue) => issue.severity === "error"),
    hasWarning: summaries.identity.validation.issues.some((issue) => issue.severity === "warning"),
  };
}

function ownershipProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
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
    missingRequiredFields: missing,
    hasError: validation.issues.some((issue) => issue.severity === "error"),
    hasWarning: validation.issues.some((issue) => issue.severity === "warning"),
  };
}

function documentsProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
  const completed = input.documentState.filter((item) => item.status === "current").length;
  const reviews = input.documentState.filter((item) => item.status === "review");
  const expiring = input.documentState.filter((item) => item.status === "expiring");

  return {
    completionPercentage: ratioToPercent(completed, input.documentState.length),
    missingRequiredFields: [...expiring, ...reviews].map((item) => item.name),
    hasError: expiring.length > 0,
    hasWarning: reviews.length > 0,
  };
}

function relationshipsProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
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
    missingRequiredFields: missing,
    hasError: input.relationshipState.score < 60,
    hasWarning: input.relationshipState.score < 80,
  };
}

function complianceProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
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
    missingRequiredFields: [...evidenceMissing, ...governanceMissing],
    hasError: evidenceMissing.length > 0,
    hasWarning: governanceMissing.length > 0,
  };
}

function financialProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
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
    missingRequiredFields: summaries.financial.completeness.missingFields,
    hasError: summaries.financial.validation.issues.some((issue) => issue.severity === "error"),
    hasWarning: summaries.financial.validation.issues.some((issue) => issue.severity === "warning"),
  };
}

function evidenceProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
  const verified = input.evidenceState.filter((item) => item.status === "verified").length;
  const missing = input.evidenceState.filter((item) => item.status === "missing").map((item) => item.name);
  const review = input.evidenceState.filter((item) => item.status === "review").map((item) => item.name);

  return {
    completionPercentage: ratioToPercent(verified, input.evidenceState.length),
    missingRequiredFields: [...missing, ...review],
    hasError: missing.length > 0,
    hasWarning: review.length > 0,
  };
}

function knowledgeProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
  const averageConfidence = input.knowledgeState.length === 0
    ? 0
    : clampPercent(
      input.knowledgeState.reduce((sum, signal) => sum + signal.confidence, 0) / input.knowledgeState.length,
    );

  return {
    completionPercentage: averageConfidence,
    missingRequiredFields: input.knowledgeState.length > 0 ? [] : ["knowledgeSignals"],
    hasError: averageConfidence < 50,
    hasWarning: averageConfidence < 75,
  };
}

function workflowProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
  const onTrack = input.workflowState.filter((item) => item.status === "on_track").length;
  const attention = input.workflowState.filter((item) => item.status === "attention").map((item) => item.name);
  const blocked = input.workflowState.filter((item) => item.status === "blocked").map((item) => item.name);

  return {
    completionPercentage: ratioToPercent(onTrack, input.workflowState.length),
    missingRequiredFields: [...blocked, ...attention],
    hasError: blocked.length > 0,
    hasWarning: attention.length > 0,
  };
}

function activityProgress(input: BusinessPassportCompletionEngineInput): SectionStrategyEvaluation {
  const completionPercentage = input.activityCount >= 4 ? 100 : ratioToPercent(input.activityCount, 4);

  return {
    completionPercentage,
    missingRequiredFields: input.activityCount > 0 ? [] : ["activityEvents"],
    hasError: input.activityCount === 0,
    hasWarning: input.activityCount < 2,
  };
}

const STRATEGY_HANDLERS: Readonly<Record<BusinessPassportCompletionStrategyId, (input: BusinessPassportCompletionEngineInput) => SectionStrategyEvaluation>> = {
  identity: identityProgress,
  ownership: ownershipProgress,
  documents: documentsProgress,
  relationships: relationshipsProgress,
  compliance: complianceProgress,
  financials: financialProgress,
  evidence: evidenceProgress,
  knowledge: knowledgeProgress,
  workflow: workflowProgress,
  activity: activityProgress,
};

export function computeBusinessPassportSectionStates(
  input: BusinessPassportCompletionEngineInput,
): readonly BusinessPassportWorkspaceSectionComputedState[] {
  return getEnabledSections().map((section) => {
    const completionEvaluation = STRATEGY_HANDLERS[section.completionStrategy](input);
    const validationEvaluation = STRATEGY_HANDLERS[section.validationStrategy](input);
    const validationStatus = mapValidation(validationEvaluation.hasError, validationEvaluation.hasWarning);

    return {
      id: section.id,
      label: section.title,
      anchorId: section.anchorId,
      disabled: !section.enabled,
      completionPercentage: completionEvaluation.completionPercentage,
      completionStatus: toCompletionStatus(completionEvaluation.completionPercentage),
      validationStatus,
      missingRequiredFields: completionEvaluation.missingRequiredFields,
    };
  });
}
