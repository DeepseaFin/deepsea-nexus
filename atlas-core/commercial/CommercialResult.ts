export type CommercialWarningSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface CommercialObservation {
  code: string;
  message: string;
}

export interface CommercialWarning {
  code: string;
  severity: CommercialWarningSeverity;
  message: string;
}

export interface CommercialBlocker {
  code: string;
  message: string;
}

export interface CommercialAction {
  id: string;
  action: string;
  owner: 'Relationship Manager' | 'Credit Analyst' | 'Deal Structuring';
  priority: 'high' | 'medium' | 'low';
}

export type CommercialRecommendation =
  | 'Proceed'
  | 'Proceed with Conditions'
  | 'Do Not Proceed';

export interface CommercialReadiness {
  score: number;
  isReady: boolean;
  status: 'Ready' | 'Conditional' | 'Needs Review';
}

export interface CommercialCalculatedValues {
  fundingPercent: number;
  netDisbursement: number;
  totalFees: number;
  expectedProfit: number;
  expectedYieldPercent: number;
}

export interface CommercialSummary {
  headline: string;
  narrative: string;
}

export interface CommercialEvaluationFindings {
  readiness: CommercialReadiness;
  observations: CommercialObservation[];
  warnings: CommercialWarning[];
  blockers: CommercialBlocker[];
  recommendedActions: CommercialAction[];
  recommendation: CommercialRecommendation;
  summary: CommercialSummary;
}

export interface CommercialResult {
  calculatedValues: CommercialCalculatedValues;
  evaluationFindings: CommercialEvaluationFindings;
}
