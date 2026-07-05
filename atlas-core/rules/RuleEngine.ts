import type { DealModel } from '@/atlas-core/deals/DealModel';
import {
  decisionRules,
  defaultRulePolicy,
  type DecisionRule,
  type RuleContext,
  type RulePolicy,
} from './DecisionRules';
import type { RuleResult, RuleStatus } from './RuleResult';

export interface RuleEngineOutput {
  overallStatus: RuleStatus;
  totalRules: number;
  passedRules: number;
  warningRules: number;
  failedRules: number;
  results: RuleResult[];
}

export class RuleEngine {
  private readonly rules: DecisionRule[];

  constructor(rules: DecisionRule[] = decisionRules) {
    this.rules = rules;
  }

  evaluate(dealModel: DealModel, policy: RulePolicy = defaultRulePolicy): RuleEngineOutput {
    const context: RuleContext = { dealModel, policy };
    const results = this.rules.map((rule) => rule.evaluate(context));

    const passedRules = results.filter((result) => result.status === 'PASS').length;
    const warningRules = results.filter((result) => result.status === 'WARNING').length;
    const failedRules = results.filter((result) => result.status === 'FAIL').length;

    return {
      overallStatus: this.resolveOverallStatus(results),
      totalRules: results.length,
      passedRules,
      warningRules,
      failedRules,
      results,
    };
  }

  private resolveOverallStatus(results: RuleResult[]): RuleStatus {
    if (results.some((result) => result.status === 'FAIL')) {
      return 'FAIL';
    }

    if (results.some((result) => result.status === 'WARNING')) {
      return 'WARNING';
    }

    return 'PASS';
  }
}
