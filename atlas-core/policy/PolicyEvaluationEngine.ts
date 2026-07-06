import type { DealModel } from '@/atlas-core/deals/DealModel';
import type { EvaluationEngine } from '@/atlas-core/evaluation/EvaluationEngine';
import type { EvaluationResult } from '@/atlas-core/evaluation/EvaluationResult';
import type { PolicyEvaluationInput } from '@/atlas-core/policy/PolicyEvaluationModel';
import type { PolicyEvaluationResult } from '@/atlas-core/policy/PolicyEvaluationResult';
import { evaluateDealPolicy } from '@/atlas-core/policy/PolicyEngine';

export function evaluatePolicyEvaluation(input: PolicyEvaluationInput): PolicyEvaluationResult {
  return evaluateDealPolicy(input.deal);
}

export class PolicyEvaluationEngine implements EvaluationEngine {
  evaluate(deal: DealModel): EvaluationResult {
    return evaluateDealPolicy(deal).evaluation;
  }
}
