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

export interface ParticipantResult {
  readiness: ParticipantReadiness;
  warnings: ParticipantWarning[];
  recommendation: ParticipantRecommendation;
  requiredActions: ParticipantRequiredAction[];
  summary: ParticipantSummary;
}
