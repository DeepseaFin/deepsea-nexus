import type { DealModel } from '@/atlas-core/deals/DealModel';
import type { CreditPolicy } from './CreditPolicy';
import type { EvaluationAction } from '@/atlas-core/evaluation/EvaluationAction';
import type { EvaluationBlocker } from '@/atlas-core/evaluation/EvaluationBlocker';
import type { EvaluationRecommendation, EvaluationResult } from '@/atlas-core/evaluation/EvaluationResult';
import type { EvaluationWarning } from '@/atlas-core/evaluation/EvaluationWarning';
import type {
  PolicyCheckDetail,
  PolicyCheckStatus,
  PolicyCriticalViolation,
  PolicyEvaluationResult,
  PolicyException,
  PolicyExceptionSeverity,
  PolicyExecutiveNarrative,
  PolicySectionEvaluation,
} from './PolicyEvaluationResult';
import type { PolicyResult } from './PolicyResult';
import type { PolicyRule } from './PolicyRule';

export interface PolicyEngine {
  evaluateRule(deal: DealModel, rule: PolicyRule): PolicyResult;
  evaluatePolicy(deal: DealModel, policy: CreditPolicy): PolicyResult[];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function isMissing(value: string): boolean {
  const normalized = normalize(value);
  return normalized.length === 0 || normalized === 'placeholder' || normalized === 'pending';
}

function parseAmount(value: string): number {
  const normalized = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function check(
  id: string,
  label: string,
  status: PolicyCheckStatus,
  detail: string,
  recommendedAction: string,
  severity: PolicyExceptionSeverity = status === 'fail' ? 'high' : status === 'conditional' ? 'medium' : 'low',
): PolicyCheckDetail {
  return {
    id,
    label,
    status,
    detail,
    severity,
    recommendedAction,
  };
}

function evaluateProductSection(deal: DealModel): PolicySectionEvaluation {
  const productEligibility =
    normalize(deal.deal.product).includes('receivables')
      ? check(
          'POL-PRODUCT-ELIGIBILITY',
          'Product Eligibility',
          'pass',
          'Receivables financing product is within policy scope.',
          'No action required.',
        )
      : check(
          'POL-PRODUCT-ELIGIBILITY',
          'Product Eligibility',
          'fail',
          'Selected product is outside current policy scope for receivables financing.',
          'Align transaction to approved receivables financing product policy.',
          'critical',
        );

  const maxAdvanceByPolicy = deal.commercialStructure.invoiceAmount * 0.9;
  const approvedFunding = deal.commercialStructure.approvedFunding;
  const advanceLimit =
    approvedFunding <= maxAdvanceByPolicy
      ? check(
          'POL-PRODUCT-ADVANCE-LIMIT',
          'Advance Limit',
          'pass',
          'Approved funding is within policy advance limit of 90% of invoice value.',
          'No action required.',
        )
      : approvedFunding <= deal.commercialStructure.invoiceAmount * 0.95
        ? check(
            'POL-PRODUCT-ADVANCE-LIMIT',
            'Advance Limit',
            'conditional',
            'Approved funding is above standard policy limit and requires conditional approval.',
            'Submit deviation approval for advance above standard limit.',
            'high',
          )
        : check(
            'POL-PRODUCT-ADVANCE-LIMIT',
            'Advance Limit',
            'fail',
            'Approved funding materially exceeds policy advance limit.',
            'Reduce approved funding to policy-compliant advance level.',
            'critical',
          );

  const tenorLimit =
    deal.commercialStructure.tenorDays <= 120
      ? check(
          'POL-PRODUCT-TENOR-LIMIT',
          'Tenor Limit',
          'pass',
          'Tenor is within policy tenor ceiling.',
          'No action required.',
        )
      : deal.commercialStructure.tenorDays <= 180
        ? check(
            'POL-PRODUCT-TENOR-LIMIT',
            'Tenor Limit',
            'conditional',
            'Tenor is above preferred range and needs conditional committee sign-off.',
            'Obtain conditional tenor extension approval.',
            'high',
          )
        : check(
            'POL-PRODUCT-TENOR-LIMIT',
            'Tenor Limit',
            'fail',
            'Tenor exceeds maximum policy limit.',
            'Reduce tenor to policy-compliant horizon.',
            'critical',
          );

  const pricingPolicy =
    deal.commercialStructure.expectedYield >= 10 && deal.commercialStructure.expectedYield <= 24
      ? check(
          'POL-PRODUCT-PRICING',
          'Pricing Policy',
          'pass',
          'Expected yield is within policy pricing corridor.',
          'No action required.',
        )
      : deal.commercialStructure.expectedYield >= 8 && deal.commercialStructure.expectedYield <= 28
        ? check(
            'POL-PRODUCT-PRICING',
            'Pricing Policy',
            'conditional',
            'Expected yield sits near policy boundary and requires pricing review.',
            'Document pricing rationale and seek pricing committee concurrence.',
            'medium',
          )
        : check(
            'POL-PRODUCT-PRICING',
            'Pricing Policy',
            'fail',
            'Expected yield is outside policy pricing corridor.',
            'Re-structure pricing to align with policy corridor.',
            'high',
          );

  return {
    section: 'product',
    title: 'Product Policy Evaluation',
    checks: [productEligibility, advanceLimit, tenorLimit, pricingPolicy],
  };
}

function evaluateCounterpartySection(deal: DealModel): PolicySectionEvaluation {
  const counterpartyEligibility =
    !isMissing(deal.counterparty.name) && !isMissing(deal.counterparty.internalRating)
      ? check(
          'POL-COUNTERPARTY-ELIGIBILITY',
          'Counterparty Eligibility',
          'pass',
          'Counterparty profile and rating are available for policy assessment.',
          'No action required.',
        )
      : check(
          'POL-COUNTERPARTY-ELIGIBILITY',
          'Counterparty Eligibility',
          'fail',
          'Counterparty profile is incomplete for policy eligibility.',
          'Complete counterparty eligibility dataset and internal rating.',
          'critical',
        );

  const creditLimit = parseAmount(deal.counterparty.creditLimit);
  const existingExposure = parseAmount(deal.counterparty.existingExposure);
  const projectedExposure = existingExposure + deal.commercialStructure.requestedFunding;
  const exposureLimit =
    creditLimit <= 0
      ? check(
          'POL-COUNTERPARTY-EXPOSURE-LIMIT',
          'Exposure Limit',
          'fail',
          'Counterparty credit limit is unavailable.',
          'Validate and load approved counterparty credit limit.',
          'critical',
        )
      : projectedExposure <= creditLimit
        ? check(
            'POL-COUNTERPARTY-EXPOSURE-LIMIT',
            'Exposure Limit',
            'pass',
            'Projected exposure is within approved counterparty limit.',
            'No action required.',
          )
        : projectedExposure <= creditLimit * 1.1
          ? check(
              'POL-COUNTERPARTY-EXPOSURE-LIMIT',
              'Exposure Limit',
              'conditional',
              'Projected exposure marginally exceeds approved limit.',
              'Obtain temporary limit exception approval.',
              'high',
            )
          : check(
              'POL-COUNTERPARTY-EXPOSURE-LIMIT',
              'Exposure Limit',
              'fail',
              'Projected exposure exceeds approved limit beyond allowable tolerance.',
              'Reduce requested funding or increase approved limit before progression.',
              'critical',
            );

  const countryPolicy =
    !isMissing(deal.client.country) && !isMissing(deal.counterparty.country)
      ? check(
          'POL-COUNTERPARTY-COUNTRY',
          'Country Policy',
          'pass',
          'Client and counterparty countries are available for policy checks.',
          'No action required.',
        )
      : check(
          'POL-COUNTERPARTY-COUNTRY',
          'Country Policy',
          'fail',
          'Country policy cannot be completed due to missing country metadata.',
          'Provide complete country information for all participants.',
          'critical',
        );

  const industryPolicy =
    !isMissing(deal.client.industry) && !isMissing(deal.counterparty.industry)
      ? check(
          'POL-COUNTERPARTY-INDUSTRY',
          'Industry Policy',
          'pass',
          'Industry classifications are available for policy checks.',
          'No action required.',
        )
      : check(
          'POL-COUNTERPARTY-INDUSTRY',
          'Industry Policy',
          'conditional',
          'Industry profile is partially complete and needs review.',
          'Complete industry classification inputs for full policy confidence.',
          'medium',
        );

  return {
    section: 'counterparty',
    title: 'Counterparty Policy',
    checks: [counterpartyEligibility, exposureLimit, countryPolicy, industryPolicy],
  };
}

function evaluateConcentrationSection(deal: DealModel): PolicySectionEvaluation {
  const facilityLimit = deal.commercialStructure.facilityLimit;
  const requestedFunding = deal.commercialStructure.requestedFunding;
  const clientUtilization = facilityLimit > 0 ? requestedFunding / facilityLimit : 0;

  const clientExposure =
    facilityLimit <= 0
      ? check(
          'POL-CONCENTRATION-CLIENT-EXPOSURE',
          'Client Exposure',
          'fail',
          'Facility limit is unavailable for client concentration policy.',
          'Set facility limit before concentration assessment.',
          'critical',
        )
      : clientUtilization <= 0.8
        ? check(
            'POL-CONCENTRATION-CLIENT-EXPOSURE',
            'Client Exposure',
            'pass',
            'Client exposure utilization is within concentration appetite.',
            'No action required.',
          )
        : clientUtilization <= 1
          ? check(
              'POL-CONCENTRATION-CLIENT-EXPOSURE',
              'Client Exposure',
              'conditional',
              'Client exposure is elevated and requires concentration review.',
              'Escalate for concentration monitoring sign-off.',
              'high',
            )
          : check(
              'POL-CONCENTRATION-CLIENT-EXPOSURE',
              'Client Exposure',
              'fail',
              'Client exposure exceeds approved facility concentration limit.',
              'Reduce exposure or increase approved facility limit.',
              'critical',
            );

  const industryConcentration =
    normalize(deal.client.industry) !== normalize(deal.counterparty.industry)
      ? check(
          'POL-CONCENTRATION-INDUSTRY',
          'Industry Concentration',
          'pass',
          'Industry exposure is diversified across participants.',
          'No action required.',
        )
      : check(
          'POL-CONCENTRATION-INDUSTRY',
          'Industry Concentration',
          'conditional',
          'Client and counterparty industry alignment increases concentration sensitivity.',
          'Record concentration rationale and mitigation controls.',
          'medium',
        );

  const countryConcentration =
    normalize(deal.client.country) !== normalize(deal.counterparty.country)
      ? check(
          'POL-CONCENTRATION-COUNTRY',
          'Country Concentration',
          'pass',
          'Country exposure is diversified.',
          'No action required.',
        )
      : check(
          'POL-CONCENTRATION-COUNTRY',
          'Country Concentration',
          'conditional',
          'Single-country concentration profile detected.',
          'Confirm single-country concentration is within approved portfolio appetite.',
          'high',
        );

  const portfolioLimits =
    deal.commercialStructure.approvedFunding <= deal.commercialStructure.facilityLimit
      ? check(
          'POL-CONCENTRATION-PORTFOLIO',
          'Portfolio Limits',
          'pass',
          'Approved funding remains within portfolio allocation limits.',
          'No action required.',
        )
      : check(
          'POL-CONCENTRATION-PORTFOLIO',
          'Portfolio Limits',
          'fail',
          'Approved funding breaches portfolio allocation limits.',
          'Rebalance allocation or reduce approved funding amount.',
          'critical',
        );

  return {
    section: 'concentration',
    title: 'Concentration Policy',
    checks: [clientExposure, industryConcentration, countryConcentration, portfolioLimits],
  };
}

function toPolicyException(checkResult: PolicyCheckDetail): PolicyException | null {
  if (checkResult.status === 'pass') {
    return null;
  }

  return {
    ruleId: checkResult.id,
    policyArea: checkResult.label,
    reason: checkResult.detail,
    severity: checkResult.severity,
    policyReference: checkResult.id,
  };
}

function toCriticalViolation(exception: PolicyException): PolicyCriticalViolation | null {
  if (exception.severity !== 'critical') {
    return null;
  }

  return {
    ruleId: exception.ruleId,
    reason: exception.reason,
    policyReference: exception.policyReference,
  };
}

function toEvaluationWarning(exception: PolicyException): EvaluationWarning {
  return {
    code: exception.ruleId,
    title: `${exception.policyArea} exception`,
    message: exception.reason,
    severity: exception.severity === 'critical' ? 'high' : exception.severity,
    sourceEngine: 'PolicyEngine',
  };
}

function toEvaluationBlocker(violation: PolicyCriticalViolation): EvaluationBlocker {
  return {
    code: violation.ruleId,
    title: 'Critical Policy Breach',
    message: violation.reason,
    severity: 'critical',
    sourceEngine: 'PolicyEngine',
    requiredResolution: `Resolve policy breach under ${violation.policyReference}`,
    ownerRole: 'Credit Officer',
  };
}

function toRecommendation(
  criticalViolations: PolicyCriticalViolation[],
  failedCount: number,
  conditionalCount: number,
): EvaluationRecommendation {
  if (criticalViolations.length > 0) {
    return 'decline';
  }

  if (failedCount > 0) {
    return 'review_required';
  }

  if (conditionalCount > 0) {
    return 'proceed_with_conditions';
  }

  return 'proceed';
}

function recommendationLabel(recommendation: EvaluationRecommendation): string {
  if (recommendation === 'proceed') return 'Proceed';
  if (recommendation === 'proceed_with_conditions') return 'Proceed with Conditions';
  if (recommendation === 'review_required') return 'Review Required';
  return 'Decline';
}

function buildActions(exceptions: PolicyException[]): EvaluationAction[] {
  if (exceptions.length === 0) {
    return [
      {
        id: 'policy-action-1',
        title: 'Proceed to next decision stage',
        description: 'No policy exceptions detected.',
        ownerRole: 'Credit Officer',
      },
    ];
  }

  return exceptions.map((exception, index) => ({
    id: `policy-action-${index + 1}`,
    title: `Resolve ${exception.policyArea}`,
    description: exception.reason,
    ownerRole: exception.severity === 'critical' ? 'Investment Committee' : 'Credit Officer',
  }));
}

function buildNarrative(
  readiness: number,
  criticalViolations: PolicyCriticalViolation[],
  conditionalCount: number,
  recommendation: EvaluationRecommendation,
): PolicyExecutiveNarrative {
  const overallCompliance =
    readiness >= 85
      ? 'Policy posture is broadly compliant.'
      : readiness >= 60
        ? 'Policy posture is partially compliant.'
        : 'Policy posture is not compliant for funding progression.';

  const majorBreaches =
    criticalViolations.length === 0
      ? 'No critical policy breaches identified.'
      : `${criticalViolations.length} critical policy breach(es) require immediate remediation.`;

  const conditions =
    conditionalCount === 0
      ? 'No conditional policy items outstanding.'
      : `${conditionalCount} conditional policy item(s) require documented closure conditions.`;

  const recommendationText = recommendationLabel(recommendation);

  return {
    overallCompliance,
    majorBreaches,
    conditions,
    recommendation: recommendationText,
    narrative: `${overallCompliance} ${majorBreaches} ${conditions} Recommendation: ${recommendationText}.`,
  };
}

function flattenChecks(sections: PolicySectionEvaluation[]): PolicyCheckDetail[] {
  return sections.flatMap((section) => section.checks);
}

export function evaluateDealPolicy(deal: DealModel): PolicyEvaluationResult {
  const product = evaluateProductSection(deal);
  const counterparty = evaluateCounterpartySection(deal);
  const concentration = evaluateConcentrationSection(deal);

  const allChecks = flattenChecks([product, counterparty, concentration]);
  const passedCount = allChecks.filter((checkResult) => checkResult.status === 'pass').length;
  const failedChecks = allChecks.filter((checkResult) => checkResult.status === 'fail');
  const failedCount = failedChecks.length;
  const conditionalCount = allChecks.filter((checkResult) => checkResult.status === 'conditional').length;

  const policyExceptions = allChecks
    .map((checkResult) => toPolicyException(checkResult))
    .filter((item): item is PolicyException => item !== null);

  const criticalViolations = policyExceptions
    .map((exception) => toCriticalViolation(exception))
    .filter((item): item is PolicyCriticalViolation => item !== null);

  const policyReadiness =
    allChecks.length === 0 ? 0 : Math.round((passedCount / allChecks.length) * 100);
  const recommendation = toRecommendation(criticalViolations, failedCount, conditionalCount);
  const recommendationText = recommendationLabel(recommendation);
  const warnings = policyExceptions.map(toEvaluationWarning);
  const blockers = criticalViolations.map(toEvaluationBlocker);
  const nextActions = buildActions(policyExceptions);
  const executiveNarrative = buildNarrative(
    policyReadiness,
    criticalViolations,
    conditionalCount,
    recommendation,
  );

  const evaluation: EvaluationResult = {
    score: policyReadiness,
    readiness: {
      isReady: criticalViolations.length === 0,
      percent: policyReadiness,
      missingFields: [],
      missingDocuments: deal.documents.missingDocuments,
      notes: ['Policy checks are evaluated from PolicyEngine workstation controls.'],
    },
    warnings,
    blockers,
    recommendation,
    nextActions,
    evidenceSummary: {
      totalEvidenceItems: deal.documents.uploadedDocuments.length + deal.documents.missingDocuments.length,
      verifiedEvidenceItems: 0,
      missingEvidenceItems: deal.documents.missingDocuments.length,
      notes: ['Evidence verification integrations are placeholder in current scope.'],
    },
    evaluatedAt: new Date().toISOString(),
    decisionRecord: {
      finding: executiveNarrative.overallCompliance,
      rationale: executiveNarrative.narrative,
      policyReference: policyExceptions.map((exception) => exception.policyReference),
      supportingEvidence: deal.documents.uploadedDocuments,
      confidence: policyReadiness,
    },
  };

  return {
    evaluation,
    policyReadiness,
    policyExceptions,
    criticalViolations,
    approvalRequirements: criticalViolations.map((violation) => violation.reason),
    policySummary: {
      headline: `${recommendationText} | Policy Readiness ${policyReadiness}%`,
      narrative: executiveNarrative.narrative,
    },
    nextRequiredActions: nextActions.map((action) => action.title),
    executiveSummary: {
      policyReadiness,
      recommendation,
      recommendationLabel: recommendationText,
      policiesPassed: passedCount,
      policiesFailed: failedCount,
      criticalPolicyBreaches: criticalViolations.length,
    },
    sections: {
      product,
      counterparty,
      concentration,
    },
    executiveNarrative,
  };
}

class DefaultPolicyEngine implements PolicyEngine {
  evaluateRule(_deal: DealModel, rule: PolicyRule): PolicyResult {
    return {
      ruleId: rule.id,
      category: rule.category,
      status: 'not_applicable',
      reason: 'Rule-level direct evaluation is not used in workstation mode.',
      severity: rule.severity,
      recommendedAction: 'Use evaluateDealPolicy for integrated policy evaluation.',
      policyReference: rule.id,
    };
  }

  evaluatePolicy(deal: DealModel, policy: CreditPolicy): PolicyResult[] {
    const evaluation = evaluateDealPolicy(deal);
    const failedOrConditional = new Set(
      evaluation.policyExceptions.map((exception) => exception.ruleId),
    );

    return policy.rules.map((rule) => ({
      ruleId: rule.id,
      category: rule.category,
      status: failedOrConditional.has(rule.id) ? 'conditional' : 'pass',
      reason: failedOrConditional.has(rule.id)
        ? 'Rule requires conditional follow-up under integrated policy evaluation.'
        : 'Rule passed under integrated policy evaluation.',
      severity: failedOrConditional.has(rule.id) ? 'medium' : 'low',
      recommendedAction: failedOrConditional.has(rule.id)
        ? 'Resolve conditional follow-up action.'
        : 'No action required.',
      policyReference: rule.id,
    }));
  }
}

export const policyEngine: PolicyEngine = new DefaultPolicyEngine();
