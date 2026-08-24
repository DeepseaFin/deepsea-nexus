import type { DealModel } from '@/atlas-core/deals/DealModel';
import {
  buildParticipantModel,
  type ParticipantModel,
} from '@/atlas-core/participants/ParticipantModel';
import {
  type ParticipantAssessment,
  type ParticipantBlocker,
  type ParticipantExposureAssessment,
  type ParticipantRecommendation,
  type ParticipantRequiredAction,
  type ParticipantResult,
  type ParticipantWarning,
} from '@/atlas-core/participants/ParticipantResult';

function isMissing(value: string): boolean {
  return value.trim().length === 0 || value.trim().toLowerCase() === 'placeholder';
}

function buildWarnings(model: ParticipantModel): ParticipantWarning[] {
  const warnings: ParticipantWarning[] = [];

  if (isMissing(model.client.companyName)) {
    warnings.push({
      code: 'CLIENT_NAME_MISSING',
      severity: 'critical',
      message: 'Client company name is missing.',
    });
  }

  if (isMissing(model.client.country)) {
    warnings.push({
      code: 'CLIENT_COUNTRY_MISSING',
      severity: 'high',
      message: 'Client country is missing.',
    });
  }

  if (isMissing(model.client.industry)) {
    warnings.push({
      code: 'CLIENT_INDUSTRY_MISSING',
      severity: 'medium',
      message: 'Client industry is missing.',
    });
  }

  if (isMissing(model.client.kycStatus)) {
    warnings.push({
      code: 'CLIENT_KYC_PENDING',
      severity: 'high',
      message: 'Client KYC status is pending connector data.',
    });
  }

  if (isMissing(model.counterparty.companyName)) {
    warnings.push({
      code: 'COUNTERPARTY_NAME_MISSING',
      severity: 'critical',
      message: 'Counterparty name is missing.',
    });
  }

  if (isMissing(model.counterparty.country)) {
    warnings.push({
      code: 'COUNTERPARTY_COUNTRY_MISSING',
      severity: 'high',
      message: 'Counterparty country is missing.',
    });
  }

  if (isMissing(model.counterparty.industry)) {
    warnings.push({
      code: 'COUNTERPARTY_INDUSTRY_MISSING',
      severity: 'medium',
      message: 'Counterparty industry is missing.',
    });
  }

  if (isMissing(model.counterparty.previousTransactions)) {
    warnings.push({
      code: 'COUNTERPARTY_HISTORY_PENDING',
      severity: 'medium',
      message: 'Counterparty previous transactions are pending connector data.',
    });
  }

  return warnings;
}

function parseAmount(value: string): number {
  const normalized = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function classifyAssessmentRisk(
  warningCount: number,
  hasHighSeverity: boolean,
): ParticipantAssessment['riskLevel'] {
  if (hasHighSeverity || warningCount >= 3) {
    return 'high';
  }

  if (warningCount > 0) {
    return 'medium';
  }

  return 'low';
}

function buildClientAssessment(
  deal: DealModel,
  model: ParticipantModel,
  warnings: ParticipantWarning[],
): ParticipantAssessment {
  const clientWarnings = warnings.filter((warning) => warning.code.startsWith('CLIENT_'));

  return {
    entityName: model.client.companyName,
    country: model.client.country,
    industry: model.client.industry,
    relationship: model.client.existingRelationship,
    rating: deal.client.internalRating,
    kycStatus: model.client.kycStatus,
    riskLevel: classifyAssessmentRisk(
      clientWarnings.length,
      clientWarnings.some((warning) => warning.severity === 'high' || warning.severity === 'critical'),
    ),
    highlights: [
      `Relationship status: ${model.client.existingRelationship}`,
      `Client internal rating: ${deal.client.internalRating}`,
      `KYC posture: ${model.client.kycStatus}`,
    ],
  };
}

function buildCounterpartyAssessment(
  deal: DealModel,
  model: ParticipantModel,
  warnings: ParticipantWarning[],
): ParticipantAssessment {
  const counterpartyWarnings = warnings.filter((warning) => warning.code.startsWith('COUNTERPARTY_'));

  return {
    entityName: model.counterparty.companyName,
    country: model.counterparty.country,
    industry: model.counterparty.industry,
    relationship: model.counterparty.existingRelationship,
    rating: deal.counterparty.internalRating,
    paymentTerms: deal.counterparty.paymentTerms,
    exposure: model.counterparty.existingExposure,
    riskLevel: classifyAssessmentRisk(
      counterpartyWarnings.length,
      counterpartyWarnings.some((warning) => warning.severity === 'high' || warning.severity === 'critical'),
    ),
    highlights: [
      `Payment terms: ${deal.counterparty.paymentTerms}`,
      `Counterparty rating: ${deal.counterparty.internalRating}`,
      `Current exposure reference: ${model.counterparty.existingExposure}`,
    ],
  };
}

function buildExposureAssessment(
  deal: DealModel,
  warnings: ParticipantWarning[],
): ParticipantExposureAssessment {
  const existingExposure = parseAmount(deal.counterparty.existingExposure);
  const creditLimit = parseAmount(deal.counterparty.creditLimit);
  const requestedFunding = deal.commercialStructure.requestedFunding;
  const projectedExposure = existingExposure + requestedFunding;
  const utilizationPercent =
    creditLimit > 0 ? Math.min(999, (projectedExposure / creditLimit) * 100) : 0;

  const concentrationRisk: ParticipantExposureAssessment['concentrationRisk'] =
    utilizationPercent >= 95
      ? 'high'
      : utilizationPercent >= 75 || warnings.some((warning) => warning.severity === 'high')
        ? 'medium'
        : 'low';

  const notes = [
    `Projected exposure after deployment: ${projectedExposure.toFixed(0)} ${deal.deal.currency}`,
    `Credit limit utilization: ${utilizationPercent.toFixed(1)}%`,
  ];

  if (creditLimit <= 0) {
    notes.push('Counterparty credit limit is unavailable and requires validation.');
  }

  if (projectedExposure > creditLimit && creditLimit > 0) {
    notes.push('Projected exposure exceeds counterparty credit limit.');
  }

  return {
    currency: deal.deal.currency,
    requestedFunding,
    existingExposure,
    creditLimit,
    projectedExposure,
    utilizationPercent,
    concentrationRisk,
    notes,
  };
}

function buildBlockers(
  warnings: ParticipantWarning[],
  exposureAssessment: ParticipantExposureAssessment,
): ParticipantBlocker[] {
  const blockers: ParticipantBlocker[] = warnings
    .filter((warning) => warning.severity === 'critical')
    .map((warning) => ({
      code: `BLOCKER_${warning.code}`,
      severity: 'critical',
      title: warning.code.replaceAll('_', ' '),
      message: warning.message,
      ownerRole: 'Relationship Manager',
      requiredResolution: 'Resolve missing critical participant data before credit decision.',
    }));

  if (exposureAssessment.creditLimit <= 0) {
    blockers.push({
      code: 'BLOCKER_CREDIT_LIMIT_UNAVAILABLE',
      severity: 'high',
      title: 'Credit Limit Validation Required',
      message: 'Counterparty credit limit is missing or invalid.',
      ownerRole: 'Credit Officer',
      requiredResolution: 'Confirm approved credit limit and update counterparty risk limits.',
    });
  } else if (exposureAssessment.projectedExposure > exposureAssessment.creditLimit) {
    blockers.push({
      code: 'BLOCKER_LIMIT_BREACH',
      severity: 'critical',
      title: 'Counterparty Limit Breach',
      message: 'Projected exposure exceeds approved counterparty limit.',
      ownerRole: 'Credit Committee',
      requiredResolution: 'Reduce requested funding or secure additional approved limit.',
    });
  }

  return blockers;
}

function buildRecommendation(warnings: ParticipantWarning[]): ParticipantRecommendation {
  if (warnings.some((warning) => warning.severity === 'critical')) {
    return 'Do Not Proceed';
  }

  if (warnings.some((warning) => warning.severity === 'high') || warnings.length > 2) {
    return 'Proceed with Conditions';
  }

  return 'Proceed';
}

function buildRequiredActions(warnings: ParticipantWarning[]): ParticipantRequiredAction[] {
  return warnings.slice(0, 3).map((warning, index) => ({
    id: `participant-action-${index + 1}`,
    action: warning.message,
    owner: warning.severity === 'critical' || warning.severity === 'high' ? 'Relationship Manager' : 'Operations Analyst',
  }));
}

function buildExecutiveNarrative(
  deal: DealModel,
  recommendation: ParticipantRecommendation,
  warnings: ParticipantWarning[],
  blockers: ParticipantBlocker[],
  exposureAssessment: ParticipantExposureAssessment,
): string {
  return [
    `Participant assessment for ${deal.deal.dealId} indicates ${recommendation.toLowerCase()} posture.`,
    `${warnings.length} warning(s) and ${blockers.length} blocker(s) identified across client, counterparty, and exposure dimensions.`,
    `Projected utilization is ${exposureAssessment.utilizationPercent.toFixed(1)}% of approved counterparty limit.`,
  ].join(' ');
}

function calculateReadinessScore(warnings: ParticipantWarning[]): number {
  const penaltyBySeverity: Record<ParticipantWarning['severity'], number> = {
    low: 5,
    medium: 10,
    high: 20,
    critical: 35,
  };

  const penalty = warnings.reduce((sum, warning) => sum + penaltyBySeverity[warning.severity], 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

export function evaluateParticipants(deal: DealModel): ParticipantResult {
  const model = buildParticipantModel(deal);
  const warnings = buildWarnings(model);
  const exposureAssessment = buildExposureAssessment(deal, warnings);
  const blockers = buildBlockers(warnings, exposureAssessment);
  const recommendation =
    blockers.length > 0 ? 'Do Not Proceed' : buildRecommendation(warnings);
  const readinessScore = calculateReadinessScore(warnings);
  const requiredActions = [
    ...buildRequiredActions(warnings),
    ...blockers.slice(0, 2).map((blocker, index) => ({
      id: `participant-blocker-action-${index + 1}`,
      action: blocker.requiredResolution,
      owner: blocker.ownerRole,
    })),
  ];
  const clientAssessment = buildClientAssessment(deal, model, warnings);
  const counterpartyAssessment = buildCounterpartyAssessment(deal, model, warnings);
  const executiveNarrative = buildExecutiveNarrative(
    deal,
    recommendation,
    warnings,
    blockers,
    exposureAssessment,
  );

  return {
    readiness: {
      score: readinessScore,
      status:
        recommendation === 'Proceed'
          ? 'Ready'
          : recommendation === 'Proceed with Conditions'
            ? 'Conditional'
            : 'Needs Review',
      isReady: recommendation === 'Proceed',
    },
    warnings,
    blockers,
    clientAssessment,
    counterpartyAssessment,
    exposureAssessment,
    recommendation,
    requiredActions,
    summary: {
      headline: `${recommendation} | Participant Readiness ${readinessScore}%`,
      narrative: executiveNarrative,
    },
  };
}

export const ParticipantEngine = {
  evaluateParticipants,
};
