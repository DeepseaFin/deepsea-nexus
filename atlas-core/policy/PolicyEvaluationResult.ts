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

export interface PolicyEvaluationResult {
  evaluation: EvaluationResult;
  policyReadiness: number;
  policyExceptions: PolicyException[];
  criticalViolations: PolicyCriticalViolation[];
  approvalRequirements: string[];
  policySummary: PolicySummary;
  nextRequiredActions: string[];
}
