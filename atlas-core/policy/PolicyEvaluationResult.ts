import type { EvaluationResult } from '@/atlas-core/evaluation/EvaluationResult';

export type PolicyExceptionSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface PolicyException {
  ruleId: string;
  policyArea: string;
  reason: string;
  severity: PolicyExceptionSeverity;
  policyReference: string;
}

export interface PolicyCriticalViolation {
  ruleId: string;
  reason: string;
  policyReference: string;
}

export interface PolicySummary {
  headline: string;
  narrative: string;
}

export type PolicyCheckStatus = 'pass' | 'conditional' | 'fail';

export interface PolicyCheckDetail {
  id: string;
  label: string;
  status: PolicyCheckStatus;
  detail: string;
  severity: PolicyExceptionSeverity;
  recommendedAction: string;
}

export interface PolicySectionEvaluation {
  section: 'product' | 'counterparty' | 'concentration';
  title: string;
  checks: PolicyCheckDetail[];
}

export interface PolicyExecutiveSummary {
  policyReadiness: number;
  recommendation: string;
  recommendationLabel: string;
  policiesPassed: number;
  policiesFailed: number;
  criticalPolicyBreaches: number;
}

export interface PolicyExecutiveNarrative {
  overallCompliance: string;
  majorBreaches: string;
  conditions: string;
  recommendation: string;
  narrative: string;
}

export interface PolicyEvaluationResult {
  evaluation: EvaluationResult;
  policyReadiness: number;
  policyExceptions: PolicyException[];
  criticalViolations: PolicyCriticalViolation[];
  approvalRequirements: string[];
  policySummary: PolicySummary;
  nextRequiredActions: string[];
  executiveSummary: PolicyExecutiveSummary;
  sections: {
    product: PolicySectionEvaluation;
    counterparty: PolicySectionEvaluation;
    concentration: PolicySectionEvaluation;
  };
  executiveNarrative: PolicyExecutiveNarrative;
}
