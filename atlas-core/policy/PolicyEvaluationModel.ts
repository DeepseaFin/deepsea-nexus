import type { DealModel } from '@/atlas-core/deals/DealModel';

export type PolicyEvaluationArea =
  | 'Commercial Policy'
  | 'Participant Policy'
  | 'Documentation Policy'
  | 'Exposure Policy'
  | 'Country Policy'
  | 'Approval Policy';

export interface PolicyEvaluationInput {
  deal: DealModel;
}

export interface PolicyEvaluationRuleModel {
  id: string;
  name: string;
  area: PolicyEvaluationArea;
  description: string;
  policyReference: string;
}

export interface PolicyEvaluationModel {
  input: PolicyEvaluationInput;
  rules: PolicyEvaluationRuleModel[];
}
