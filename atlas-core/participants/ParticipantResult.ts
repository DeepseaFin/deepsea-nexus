export type ParticipantWarningSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ParticipantWarning {
  code: string;
  severity: ParticipantWarningSeverity;
  message: string;
}

export type ParticipantRecommendation =
  | 'Proceed'
  | 'Proceed with Conditions'
  | 'Do Not Proceed';

export interface ParticipantReadiness {
  score: number;
  status: 'Ready' | 'Conditional' | 'Needs Review';
  isReady: boolean;
}

export interface ParticipantRequiredAction {
  id: string;
  action: string;
  owner: string;
}

export interface ParticipantSummary {
  headline: string;
  narrative: string;
}

export interface ParticipantAssessment {
  entityName: string;
  country: string;
  industry: string;
  relationship: string;
  rating: string;
  kycStatus?: string;
  paymentTerms?: string;
  exposure?: string;
  riskLevel: 'low' | 'medium' | 'high';
  highlights: string[];
}

export interface ParticipantExposureAssessment {
  currency: string;
  requestedFunding: number;
  existingExposure: number;
  creditLimit: number;
  projectedExposure: number;
  utilizationPercent: number;
  concentrationRisk: 'low' | 'medium' | 'high';
  notes: string[];
}

export interface ParticipantBlocker {
  code: string;
  severity: 'high' | 'critical';
  title: string;
  message: string;
  ownerRole: string;
  requiredResolution: string;
}

export interface ParticipantResult {
  readiness: ParticipantReadiness;
  warnings: ParticipantWarning[];
  blockers: ParticipantBlocker[];
  clientAssessment: ParticipantAssessment;
  counterpartyAssessment: ParticipantAssessment;
  exposureAssessment: ParticipantExposureAssessment;
  recommendation: ParticipantRecommendation;
  requiredActions: ParticipantRequiredAction[];
  summary: ParticipantSummary;
}
