export type RuleStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface RuleResult {
  ruleId: string;
  status: RuleStatus;
  comment: string;
}
