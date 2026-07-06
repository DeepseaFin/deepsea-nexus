import type { DealModel } from '@/atlas-core/deals/DealModel';
import type { CreditPolicy } from './CreditPolicy';
import type { PolicyResult } from './PolicyResult';
import type { PolicyRule } from './PolicyRule';

export interface PolicyEngine {
  evaluateRule(deal: DealModel, rule: PolicyRule): PolicyResult;
  evaluatePolicy(deal: DealModel, policy: CreditPolicy): PolicyResult[];
}
