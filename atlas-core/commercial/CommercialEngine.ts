import {
  type CommercialInput,
  type CommercialModel,
} from '@/atlas-core/commercial/CommercialModel';
import {
  type CommercialAction,
  type CommercialBlocker,
  type CommercialCalculatedValues,
  type CommercialObservation,
  type CommercialRecommendation,
  type CommercialResult,
  type CommercialSummary,
  type CommercialWarning,
} from '@/atlas-core/commercial/CommercialResult';

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toModel(input: CommercialInput): CommercialModel {
  const maxFundingByAdvance = input.invoiceAmount * (clampPercent(input.advanceRatePercent) / 100);
  const approvedFunding = Math.min(input.requestedFunding, maxFundingByAdvance);

  return {
    ...input,
    approvedFunding,
  };
}

function calculateFundingPercent(model: CommercialModel): number {
  if (model.invoiceAmount <= 0) {
    return 0;
  }

  return (model.approvedFunding / model.invoiceAmount) * 100;
}

function calculateDiscountFee(model: CommercialModel): number {
  return (
    model.approvedFunding *
    (clampPercent(model.discountRatePercent) / 100) *
    (Math.max(model.tenorDays, 0) / 365)
  );
}

function calculateTotalFees(model: CommercialModel): number {
  const discountFee = calculateDiscountFee(model);
  return discountFee + model.fees.processingFee + model.fees.legalFee + model.fees.otherCharges;
}

function calculateNetDisbursement(model: CommercialModel, totalFees: number): number {
  return model.approvedFunding - totalFees;
}

function calculateExpectedProfit(totalFees: number): number {
  return totalFees;
}

function calculateExpectedYieldPercent(expectedProfit: number, approvedFunding: number): number {
  if (approvedFunding <= 0) {
    return 0;
  }

  return (expectedProfit / approvedFunding) * 100;
}

function buildObservations(
  model: CommercialModel,
  calculatedValues: CommercialCalculatedValues,
): CommercialObservation[] {
  const observations: CommercialObservation[] = [];

  observations.push({
    code: 'FUNDING_PROFILE',
    message: `Funding percentage is ${round2(calculatedValues.fundingPercent)}% against an advance cap of ${round2(model.advanceRatePercent)}%.`,
  });

  observations.push({
    code: 'YIELD_PROFILE',
    message: `Expected yield is ${round2(calculatedValues.expectedYieldPercent)}% for ${Math.max(model.tenorDays, 0)} tenor day(s).`,
  });

  observations.push({
    code: 'RECOURSE_PROFILE',
    message: `Recourse profile captured as ${model.recourseType.trim() || 'Not Provided'}.`,
  });

  return observations;
}

function buildWarnings(
  model: CommercialModel,
  calculatedValues: CommercialCalculatedValues,
): CommercialWarning[] {
  const warnings: CommercialWarning[] = [];

  if (model.invoiceAmount <= 0) {
    warnings.push({
      code: 'INVOICE_AMOUNT_MISSING',
      severity: 'critical',
      message: 'Invoice Amount must be greater than 0.',
    });
  }

  if (model.requestedFunding <= 0) {
    warnings.push({
      code: 'REQUESTED_FUNDING_MISSING',
      severity: 'critical',
      message: 'Requested Funding must be greater than 0.',
    });
  }

  if (model.requestedFunding > model.invoiceAmount) {
    warnings.push({
      code: 'REQUESTED_GT_INVOICE',
      severity: 'high',
      message: 'Requested Funding exceeds Invoice Amount.',
    });
  }

  if (model.advanceRatePercent <= 0) {
    warnings.push({
      code: 'ADVANCE_RATE_MISSING',
      severity: 'high',
      message: 'Advance Rate must be greater than 0.',
    });
  }

  if (model.tenorDays <= 0) {
    warnings.push({
      code: 'TENOR_MISSING',
      severity: 'high',
      message: 'Tenor must be greater than 0 days.',
    });
  }

  if (model.tenorDays > 180) {
    warnings.push({
      code: 'TENOR_ELEVATED',
      severity: 'medium',
      message: 'Tenor exceeds standard short-duration threshold (180 days).',
    });
  }

  if (model.discountRatePercent <= 0) {
    warnings.push({
      code: 'DISCOUNT_RATE_MISSING',
      severity: 'high',
      message: 'Discount Rate must be greater than 0%.',
    });
  }

  if (calculatedValues.netDisbursement <= 0) {
    warnings.push({
      code: 'NET_DISBURSEMENT_NON_POSITIVE',
      severity: 'critical',
      message: 'Net Disbursement is non-positive after fees.',
    });
  }

  if (calculatedValues.fundingPercent > model.advanceRatePercent + 0.01) {
    warnings.push({
      code: 'FUNDING_OVER_ADVANCE_LIMIT',
      severity: 'high',
      message: 'Approved Funding exceeds configured Advance Rate capacity.',
    });
  }

  if (calculatedValues.expectedYieldPercent < 1.5) {
    warnings.push({
      code: 'YIELD_LOW',
      severity: 'medium',
      message: 'Expected Yield is low for this structure.',
    });
  }

  const feeToFundingRatio =
    model.approvedFunding > 0 ? (calculatedValues.totalFees / model.approvedFunding) * 100 : 0;

  if (feeToFundingRatio > 12) {
    warnings.push({
      code: 'FEE_LOAD_ELEVATED',
      severity: 'medium',
      message: 'Total fees are elevated relative to approved funding.',
    });
  }

  if (model.currency.trim().length === 0) {
    warnings.push({
      code: 'CURRENCY_MISSING',
      severity: 'medium',
      message: 'Currency is missing.',
    });
  }

  if (model.recourseType.trim().length === 0) {
    warnings.push({
      code: 'RECOURSE_MISSING',
      severity: 'medium',
      message: 'Recourse Type is missing.',
    });
  }

  return warnings;
}

function buildBlockers(warnings: CommercialWarning[]): CommercialBlocker[] {
  return warnings
    .filter((warning) => warning.severity === 'critical')
    .map((warning) => ({
      code: `BLOCKER_${warning.code}`,
      message: warning.message,
    }));
}

function buildRecommendation(warnings: CommercialWarning[]): CommercialRecommendation {
  if (warnings.some((warning) => warning.severity === 'critical')) {
    return 'Do Not Proceed';
  }

  const highCount = warnings.filter((warning) => warning.severity === 'high').length;
  const mediumCount = warnings.filter((warning) => warning.severity === 'medium').length;

  if (highCount > 0 || mediumCount > 1) {
    return 'Proceed with Conditions';
  }

  return 'Proceed';
}

function buildRecommendedActions(
  recommendation: CommercialRecommendation,
  warnings: CommercialWarning[],
  blockers: CommercialBlocker[],
): CommercialAction[] {
  const actions: CommercialAction[] = [];

  blockers.forEach((blocker, index) => {
    actions.push({
      id: `ACTION_BLOCKER_${index + 1}`,
      action: `Resolve blocker: ${blocker.message}`,
      owner: 'Relationship Manager',
      priority: 'high',
    });
  });

  warnings
    .filter((warning) => warning.severity === 'high')
    .slice(0, 2)
    .forEach((warning, index) => {
      actions.push({
        id: `ACTION_WARNING_${index + 1}`,
        action: `Mitigate high-risk warning: ${warning.message}`,
        owner: 'Credit Analyst',
        priority: 'medium',
      });
    });

  if (recommendation === 'Proceed' && actions.length === 0) {
    actions.push({
      id: 'ACTION_PROCEED_1',
      action: 'Proceed to recommendation and term sheet preparation.',
      owner: 'Deal Structuring',
      priority: 'low',
    });
  }

  return actions;
}

function calculateReadinessScore(warnings: CommercialWarning[]): number {
  const severityPenalty: Record<CommercialWarning['severity'], number> = {
    low: 5,
    medium: 10,
    high: 20,
    critical: 35,
  };

  const penalty = warnings.reduce((sum, warning) => sum + severityPenalty[warning.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

function buildSummary(
  recommendation: CommercialRecommendation,
  calculatedValues: CommercialCalculatedValues,
  readinessScore: number,
  warningCount: number,
  blockerCount: number,
): CommercialSummary {
  const headline = `${recommendation} | Readiness ${readinessScore}%`;
  const narrative = `Funding ${round2(calculatedValues.fundingPercent)}%, expected yield ${round2(calculatedValues.expectedYieldPercent)}%, expected profit ${round2(calculatedValues.expectedProfit)} with ${warningCount} warning(s) and ${blockerCount} blocker(s).`;

  return {
    headline,
    narrative,
  };
}

export function evaluateCommercial(input: CommercialInput): CommercialResult {
  const model = toModel(input);

  const totalFees = calculateTotalFees(model);
  const calculatedValues: CommercialCalculatedValues = {
    fundingPercent: round2(calculateFundingPercent(model)),
    netDisbursement: round2(calculateNetDisbursement(model, totalFees)),
    totalFees: round2(totalFees),
    expectedProfit: round2(calculateExpectedProfit(totalFees)),
    expectedYieldPercent: round2(calculateExpectedYieldPercent(totalFees, model.approvedFunding)),
  };

  const observations = buildObservations(model, calculatedValues);
  const warnings = buildWarnings(model, calculatedValues);
  const blockers = buildBlockers(warnings);
  const recommendation = buildRecommendation(warnings);
  const readinessScore = calculateReadinessScore(warnings);
  const recommendedActions = buildRecommendedActions(recommendation, warnings, blockers);
  const summary = buildSummary(
    recommendation,
    calculatedValues,
    readinessScore,
    warnings.length,
    blockers.length,
  );

  return {
    calculatedValues,
    evaluationFindings: {
      readiness: {
        score: readinessScore,
        isReady: recommendation === 'Proceed',
        status:
          recommendation === 'Proceed'
            ? 'Ready'
            : recommendation === 'Proceed with Conditions'
              ? 'Conditional'
              : 'Needs Review',
      },
      observations,
      warnings,
      blockers,
      recommendedActions,
      recommendation,
      summary,
    },
  };
}

export const CommercialEngine = {
  evaluateCommercial,
};
