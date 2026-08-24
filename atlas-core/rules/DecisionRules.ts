import type { DealModel } from '@/atlas-core/deals/DealModel';
import type { RuleResult } from './RuleResult';

export type RuleCategory =
  | 'Commercial'
  | 'Credit'
  | 'Documents'
  | 'Legal'
  | 'Fraud'
  | 'Compliance'
  | 'Portfolio';

export type RuleSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type RuleRecommendation =
  | 'APPROVE'
  | 'APPROVE_WITH_CONDITIONS'
  | 'REJECT'
  | 'REVIEW_REQUIRED';

export interface RulePolicy {
  minimumExpectedReturnPercent: number;
  maxFundingAmount: number;
  maxAdvancePercent: number;
  permittedIndustries: string[];
  permittedCountries: string[];
  allowedCounterpartyRatings: string[];
  maxClientExposureAmount: number;
}

export interface RuleContext {
  dealModel: DealModel;
  policy: RulePolicy;
}

export interface DecisionRule {
  ruleId: string;
  ruleName: string;
  description: string;
  category: RuleCategory;
  severity: RuleSeverity;
  recommendation: RuleRecommendation;
  evaluate: (context: RuleContext) => RuleResult;
}

export const defaultRulePolicy: RulePolicy = {
  minimumExpectedReturnPercent: 12,
  maxFundingAmount: 5000000,
  maxAdvancePercent: 90,
  permittedIndustries: [
    'Industrial Trading',
    'Healthcare Procurement',
    'Logistics',
    'Commodities',
    'Manufacturing',
  ],
  permittedCountries: [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Bahrain',
    'Oman',
  ],
  allowedCounterpartyRatings: ['AAA', 'AA', 'A+', 'A', 'A-', 'BBB+', 'BBB'],
  maxClientExposureAmount: 30000000,
};

export const decisionRules: DecisionRule[] = [
  {
    ruleId: 'DOC-001',
    ruleName: 'Mandatory documents uploaded',
    description: 'Validate that all mandatory documents are uploaded and completion is adequate.',
    category: 'Documents',
    severity: 'Critical',
    recommendation: 'REVIEW_REQUIRED',
    evaluate: ({ dealModel }) => {
      const hasMissingDocuments = dealModel.documents.missingDocuments.length > 0;
      const completionBelowThreshold = dealModel.documents.completionPercent < 80;

      if (hasMissingDocuments || completionBelowThreshold) {
        return {
          ruleId: 'DOC-001',
          status: 'FAIL',
          comment: 'Mandatory documentation is incomplete and requires closure before final decisioning.',
        };
      }

      return {
        ruleId: 'DOC-001',
        status: 'PASS',
        comment: 'Mandatory documentation requirements are satisfied.',
      };
    },
  },
  {
    ruleId: 'CMP-001',
    ruleName: 'Client KYC complete',
    description: 'Ensure client KYC pack is complete and internally acceptable.',
    category: 'Compliance',
    severity: 'Critical',
    recommendation: 'REVIEW_REQUIRED',
    evaluate: ({ dealModel }) => {
      const hasKycGap = dealModel.documents.missingDocuments.some((item) =>
        item.toLowerCase().includes('kyc') || item.toLowerCase().includes('trade license')
      );

      if (hasKycGap) {
        return {
          ruleId: 'CMP-001',
          status: 'FAIL',
          comment: 'KYC-related artifacts are pending and must be completed.',
        };
      }

      return {
        ruleId: 'CMP-001',
        status: 'PASS',
        comment: 'KYC requirements are acceptable for current stage.',
      };
    },
  },
  {
    ruleId: 'CRD-001',
    ruleName: 'Counterparty approved',
    description: 'Validate counterparty internal rating is inside approved range.',
    category: 'Credit',
    severity: 'High',
    recommendation: 'REVIEW_REQUIRED',
    evaluate: ({ dealModel, policy }) => {
      const rating = dealModel.counterparty.internalRating;

      if (!policy.allowedCounterpartyRatings.includes(rating)) {
        return {
          ruleId: 'CRD-001',
          status: 'FAIL',
          comment: 'Counterparty rating is outside approved policy range.',
        };
      }

      return {
        ruleId: 'CRD-001',
        status: 'PASS',
        comment: 'Counterparty rating is within approved policy range.',
      };
    },
  },
  {
    ruleId: 'COM-001',
    ruleName: 'Funding within policy limit',
    description: 'Check funding required amount against policy maximum.',
    category: 'Commercial',
    severity: 'High',
    recommendation: 'REVIEW_REQUIRED',
    evaluate: ({ dealModel, policy }) => {
      if (dealModel.deal.fundingRequired > policy.maxFundingAmount) {
        return {
          ruleId: 'COM-001',
          status: 'FAIL',
          comment: 'Funding required exceeds policy limit and requires escalation.',
        };
      }

      return {
        ruleId: 'COM-001',
        status: 'PASS',
        comment: 'Funding required is within approved policy limit.',
      };
    },
  },
  {
    ruleId: 'CMP-002',
    ruleName: 'Industry permitted',
    description: 'Validate client industry against approved policy list.',
    category: 'Compliance',
    severity: 'High',
    recommendation: 'REJECT',
    evaluate: ({ dealModel, policy }) => {
      const industryPermitted = policy.permittedIndustries.includes(dealModel.client.industry);

      if (!industryPermitted) {
        return {
          ruleId: 'CMP-002',
          status: 'FAIL',
          comment: 'Client industry is outside permitted policy sectors.',
        };
      }

      return {
        ruleId: 'CMP-002',
        status: 'PASS',
        comment: 'Client industry is permitted by policy.',
      };
    },
  },
  {
    ruleId: 'CMP-003',
    ruleName: 'Country permitted',
    description: 'Validate client country against approved policy list.',
    category: 'Compliance',
    severity: 'Critical',
    recommendation: 'REJECT',
    evaluate: ({ dealModel, policy }) => {
      const countryPermitted = policy.permittedCountries.includes(dealModel.client.country);

      if (!countryPermitted) {
        return {
          ruleId: 'CMP-003',
          status: 'FAIL',
          comment: 'Client country is outside permitted policy jurisdictions.',
        };
      }

      return {
        ruleId: 'CMP-003',
        status: 'PASS',
        comment: 'Client country is permitted by policy.',
      };
    },
  },
  {
    ruleId: 'COM-002',
    ruleName: 'Expected return above minimum hurdle',
    description: 'Check expected return meets minimum hurdle rate.',
    category: 'Commercial',
    severity: 'Medium',
    recommendation: 'APPROVE_WITH_CONDITIONS',
    evaluate: ({ dealModel, policy }) => {
      if (dealModel.deal.expectedReturnPercent < policy.minimumExpectedReturnPercent) {
        return {
          ruleId: 'COM-002',
          status: 'WARNING',
          comment: 'Expected return is below hurdle and may require commercial override.',
        };
      }

      return {
        ruleId: 'COM-002',
        status: 'PASS',
        comment: 'Expected return is above minimum hurdle rate.',
      };
    },
  },
  {
    ruleId: 'POR-001',
    ruleName: 'Exposure within limits',
    description: 'Validate client exposure against concentration threshold.',
    category: 'Portfolio',
    severity: 'High',
    recommendation: 'APPROVE_WITH_CONDITIONS',
    evaluate: ({ dealModel, policy }) => {
      if (dealModel.deal.amount > policy.maxClientExposureAmount) {
        return {
          ruleId: 'POR-001',
          status: 'WARNING',
          comment: 'Client exposure is near or above concentration guardrail.',
        };
      }

      return {
        ruleId: 'POR-001',
        status: 'PASS',
        comment: 'Client exposure is within portfolio concentration limits.',
      };
    },
  },
  {
    ruleId: 'FRA-001',
    ruleName: 'Fraud posture acceptable',
    description: 'Ensure fraud risk posture is acceptable for recommendation stage.',
    category: 'Fraud',
    severity: 'High',
    recommendation: 'REVIEW_REQUIRED',
    evaluate: ({ dealModel }) => {
      const fraudRating = dealModel.intelligence.fraudRating.toLowerCase();

      if (fraudRating === 'high') {
        return {
          ruleId: 'FRA-001',
          status: 'FAIL',
          comment: 'Fraud rating is high and requires immediate risk review.',
        };
      }

      if (fraudRating === 'medium') {
        return {
          ruleId: 'FRA-001',
          status: 'WARNING',
          comment: 'Fraud rating is medium and requires conditional controls.',
        };
      }

      return {
        ruleId: 'FRA-001',
        status: 'PASS',
        comment: 'Fraud posture is acceptable for current decision stage.',
      };
    },
  },
  {
    ruleId: 'LEG-001',
    ruleName: 'Legal posture acceptable',
    description: 'Validate legal risk posture for recommendation stage.',
    category: 'Legal',
    severity: 'High',
    recommendation: 'REVIEW_REQUIRED',
    evaluate: ({ dealModel }) => {
      const legalRating = dealModel.intelligence.legalRating.toLowerCase();

      if (legalRating === 'high') {
        return {
          ruleId: 'LEG-001',
          status: 'FAIL',
          comment: 'Legal risk posture is high and blocks recommendation.',
        };
      }

      if (legalRating === 'medium') {
        return {
          ruleId: 'LEG-001',
          status: 'WARNING',
          comment: 'Legal posture requires conditional approvals and mitigants.',
        };
      }

      return {
        ruleId: 'LEG-001',
        status: 'PASS',
        comment: 'Legal posture is acceptable for current decision stage.',
      };
    },
  },
];
