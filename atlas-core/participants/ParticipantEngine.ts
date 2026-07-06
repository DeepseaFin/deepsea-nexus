import type { DealModel } from '@/atlas-core/deals/DealModel';
import {
  buildParticipantModel,
  type ParticipantModel,
} from '@/atlas-core/participants/ParticipantModel';
import {
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
  const recommendation = buildRecommendation(warnings);
  const readinessScore = calculateReadinessScore(warnings);
  const requiredActions = buildRequiredActions(warnings);

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
    recommendation,
    requiredActions,
    summary: {
      headline: `${recommendation} | Participant Readiness ${readinessScore}%`,
      narrative: `Client ${model.client.companyName} and counterparty ${model.counterparty.companyName} assessed with ${warnings.length} participant warning(s).`,
    },
  };
}

export const ParticipantEngine = {
  evaluateParticipants,
};
