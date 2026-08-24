import type { PolicyCategory } from './PolicyCategory';

export type PolicyStatus = 'pass' | 'fail' | 'conditional' | 'not_applicable';

export type PolicySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface PolicyResult {
  ruleId: string;
  category: PolicyCategory;
  status: PolicyStatus;
  reason: string;
  severity: PolicySeverity;
  recommendedAction: string;
  policyReference: string;
}
