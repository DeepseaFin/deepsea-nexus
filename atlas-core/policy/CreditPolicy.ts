import type { PolicyCategory } from './PolicyCategory';
import type { PolicyRule } from './PolicyRule';

export interface CreditPolicy {
  id: string;
  name: string;
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  categories: PolicyCategory[];
  rules: PolicyRule[];
  owner?: string;
  jurisdiction?: string;
}
