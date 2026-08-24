import type { PolicyCategory } from './PolicyCategory';
import type { PolicySeverity } from './PolicyResult';

export type PolicyEvaluationType =
  | 'boolean'
  | 'threshold'
  | 'document_check'
  | 'counterparty_check'
  | 'country_check'
  | 'manual_review';

export interface PolicyRule {
  id: string;
  name: string;
  category: PolicyCategory;
  description: string;
  severity: PolicySeverity;
  evaluationType: PolicyEvaluationType;
  enabled: boolean;
}
