import type { DealModel } from '@/atlas-core/deals/DealModel';
import type { EvaluationEngine } from '@/atlas-core/evaluation/EvaluationEngine';
import type { EvaluationAction } from '@/atlas-core/evaluation/EvaluationAction';
import type { EvaluationBlocker } from '@/atlas-core/evaluation/EvaluationBlocker';
import type { EvaluationRecommendation, EvaluationResult } from '@/atlas-core/evaluation/EvaluationResult';
import type { EvaluationWarning } from '@/atlas-core/evaluation/EvaluationWarning';
import type { PolicyResult, PolicyStatus } from '@/atlas-core/policy/PolicyResult';
import type { PolicyEvaluationInput, PolicyEvaluationModel, PolicyEvaluationRuleModel } from '@/atlas-core/policy/PolicyEvaluationModel';
import type { PolicyCriticalViolation, PolicyEvaluationResult, PolicyException } from '@/atlas-core/policy/PolicyEvaluationResult';

const POLICY_RULES: PolicyEvaluationRuleModel[] = [
  {
    id: 'POL-COMMERCIAL-01',
    name: 'Commercial structure completeness',
    area: 'Commercial Policy',
    description: 'Commercial structure data should be present for evaluation.',
    policyReference: 'DSP-COMMERCIAL-PLACEHOLDER',
  },
  {
    id: 'POL-PARTICIPANT-01',
    name: 'Participant profile completeness',
    area: 'Participant Policy',
    description: 'Client and counterparty profiles should be present for evaluation.',
    policyReference: 'DSP-PARTICIPANT-PLACEHOLDER',
  },
  {
    id: 'POL-DOCS-01',
    name: 'Documentation completeness',
    area: 'Documentation Policy',
    description: 'Mandatory documents should be present before policy completion.',
    policyReference: 'DSP-DOCUMENTATION-PLACEHOLDER',
  },
  {
    id: 'POL-EXPOSURE-01',
    name: 'Exposure data availability',
    area: 'Exposure Policy',
    description: 'Exposure details should be available for participant review.',
    policyReference: 'DSP-EXPOSURE-PLACEHOLDER',
  },
  {
    id: 'POL-COUNTRY-01',
    name: 'Country profile availability',
    area: 'Country Policy',
    description: 'Country details should be available for both parties.',
    policyReference: 'DSP-COUNTRY-PLACEHOLDER',
  },
  {
    id: 'POL-APPROVAL-01',
    name: 'Approval governance readiness',
    area: 'Approval Policy',
    description: 'Approval metadata should be present for escalation workflow.',
    policyReference: 'DSP-APPROVAL-PLACEHOLDER',
  },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function isMissing(value: string): boolean {
  const normalized = normalize(value);
  return normalized.length === 0 || normalized === 'placeholder' || normalized === 'pending';
}

function createModel(input: PolicyEvaluationInput): PolicyEvaluationModel {
  return {
    input,
    rules: POLICY_RULES,
  };
}

function toPolicyStatus(passed: boolean, partial: boolean): PolicyStatus {
  if (passed) {
    return 'pass';
  }

  if (partial) {
    return 'conditional';
  }

  return 'fail';
}

function evaluateRule(deal: DealModel, rule: PolicyEvaluationRuleModel): PolicyResult {
  if (rule.area === 'Commercial Policy') {
    const hasCommercial =
      deal.commercialStructure.invoiceAmount > 0
      && deal.commercialStructure.requestedFunding > 0
      && !isMissing(deal.commercialStructure.currency);
    const hasPartialCommercial =
      deal.commercialStructure.invoiceAmount > 0 || deal.commercialStructure.requestedFunding > 0;

    const status = toPolicyStatus(hasCommercial, hasPartialCommercial);

    return {
      ruleId: rule.id,
      category: 'commercial',
      status,
      reason: hasCommercial
        ? 'Commercial policy data is available.'
        : hasPartialCommercial
          ? 'Commercial policy data is partially available.'
          : 'Commercial policy data is missing.',
      severity: status === 'fail' ? 'high' : status === 'conditional' ? 'medium' : 'low',
      recommendedAction: 'Complete commercial structure data for policy evaluation.',
      policyReference: rule.policyReference,
    };
  }

  if (rule.area === 'Participant Policy') {
    const hasParticipant =
      !isMissing(deal.client.legalName)
      && !isMissing(deal.counterparty.name)
      && !isMissing(deal.client.country)
      && !isMissing(deal.counterparty.country);
    const hasPartialParticipant = !isMissing(deal.client.legalName) || !isMissing(deal.counterparty.name);
    const status = toPolicyStatus(hasParticipant, hasPartialParticipant);

    return {
      ruleId: rule.id,
      category: 'counterparty',
      status,
      reason: hasParticipant
        ? 'Participant policy data is available.'
        : hasPartialParticipant
          ? 'Participant policy data is partially available.'
          : 'Participant policy data is missing.',
      severity: status === 'fail' ? 'high' : status === 'conditional' ? 'medium' : 'low',
      recommendedAction: 'Complete participant profile data for client and counterparty.',
      policyReference: rule.policyReference,
    };
  }

  if (rule.area === 'Documentation Policy') {
    const hasMissingMandatory = deal.documents.missingDocuments.length > 0;

    return {
      ruleId: rule.id,
      category: 'documentation',
      status: hasMissingMandatory ? 'conditional' : 'pass',
      reason: hasMissingMandatory
        ? 'Mandatory documentation has outstanding items.'
        : 'Mandatory documentation is complete for current scope.',
      severity: hasMissingMandatory ? 'high' : 'low',
      recommendedAction: 'Close mandatory document checklist and attach evidence.',
      policyReference: rule.policyReference,
    };
  }

  if (rule.area === 'Exposure Policy') {
    const hasExposure = !isMissing(deal.counterparty.existingExposure);

    return {
      ruleId: rule.id,
      category: 'exposure',
      status: hasExposure ? 'pass' : 'conditional',
      reason: hasExposure
        ? 'Exposure data is available.'
        : 'Exposure data is placeholder and requires integration updates.',
      severity: hasExposure ? 'low' : 'medium',
      recommendedAction: 'Populate exposure details from future exposure connector.',
      policyReference: rule.policyReference,
    };
  }

  if (rule.area === 'Country Policy') {
    const hasCountry = !isMissing(deal.client.country) && !isMissing(deal.counterparty.country);

    return {
      ruleId: rule.id,
      category: 'country',
      status: hasCountry ? 'pass' : 'fail',
      reason: hasCountry
        ? 'Country policy data is available.'
        : 'Country policy data is missing for one or more parties.',
      severity: hasCountry ? 'low' : 'critical',
      recommendedAction: 'Provide complete country profile for all participants.',
      policyReference: rule.policyReference,
    };
  }

  const hasApprovalContext = !isMissing(deal.approval.status) && !isMissing(deal.approval.approver);

  return {
    ruleId: rule.id,
    category: 'approval',
    status: hasApprovalContext ? 'pass' : 'conditional',
    reason: hasApprovalContext
      ? 'Approval governance metadata is available.'
      : 'Approval governance metadata is incomplete for escalation.',
    severity: hasApprovalContext ? 'low' : 'high',
    recommendedAction: 'Assign approval owner and status for escalation routing.',
    policyReference: rule.policyReference,
  };
}

function toException(rule: PolicyEvaluationRuleModel, result: PolicyResult): PolicyException | null {
  if (result.status === 'pass') {
    return null;
  }

  return {
    ruleId: rule.id,
    policyArea: rule.area,
    reason: result.reason,
    severity: result.severity,
    policyReference: result.policyReference,
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

function buildWarnings(exceptions: PolicyException[]): EvaluationWarning[] {
  return exceptions.map((exception) => ({
    code: exception.ruleId,
    title: `${exception.policyArea} exception`,
    message: exception.reason,
    severity: exception.severity === 'critical' ? 'high' : exception.severity,
    sourceEngine: 'PolicyEvaluationEngine',
  }));
}

function buildBlockers(violations: PolicyCriticalViolation[]): EvaluationBlocker[] {
  return violations.map((violation) => ({
    code: violation.ruleId,
    title: 'Critical Policy Violation',
    message: violation.reason,
    severity: 'critical',
    sourceEngine: 'PolicyEvaluationEngine',
    requiredResolution: `Resolve policy exception under ${violation.policyReference}`,
    ownerRole: 'Relationship Manager',
  }));
}

function toRecommendation(
  violations: PolicyCriticalViolation[],
  exceptions: PolicyException[],
): EvaluationRecommendation {
  if (violations.length > 0) {
    return 'decline';
  }

  if (exceptions.length > 0) {
    return 'review_required';
  }

  return 'proceed';
}

function toApprovalRequirements(exceptions: PolicyException[]): string[] {
  return exceptions
    .filter((exception) => exception.policyArea === 'Approval Policy' || exception.severity === 'critical')
    .map((exception) => `Escalate ${exception.policyArea}: ${exception.reason}`);
}

function toNextActions(exceptions: PolicyException[]): string[] {
  if (exceptions.length === 0) {
    return ['Proceed to decision workflow with current policy state.'];
  }

  return exceptions.map((exception) => `Resolve ${exception.policyArea}: ${exception.reason}`);
}

function buildEvaluationActions(nextActions: string[]): EvaluationAction[] {
  return nextActions.map((action, index) => ({
    id: `policy-next-action-${index + 1}`,
    title: action,
    description: 'Generated by PolicyEvaluationEngine.',
    ownerRole: 'Relationship Manager',
  }));
}

function toReadinessPercent(totalRules: number, exceptionCount: number): number {
  if (totalRules === 0) {
    return 0;
  }

  return Math.round(((totalRules - exceptionCount) / totalRules) * 100);
}

export function evaluatePolicyEvaluation(input: PolicyEvaluationInput): PolicyEvaluationResult {
  const model = createModel(input);
  const policyResults = model.rules.map((rule) => ({
    rule,
    result: evaluateRule(model.input.deal, rule),
  }));

  const policyExceptions = policyResults
    .map(({ rule, result }) => toException(rule, result))
    .filter((item): item is PolicyException => item !== null);

  const criticalViolations = policyExceptions
    .map((exception) => toCriticalViolation(exception))
    .filter((item): item is PolicyCriticalViolation => item !== null);

  const policyReadiness = toReadinessPercent(model.rules.length, policyExceptions.length);
  const warnings = buildWarnings(policyExceptions);
  const blockers = buildBlockers(criticalViolations);
  const recommendation = toRecommendation(criticalViolations, policyExceptions);
  const approvalRequirements = toApprovalRequirements(policyExceptions);
  const nextRequiredActions = toNextActions(policyExceptions);

  const evaluation: EvaluationResult = {
    score: policyReadiness,
    readiness: {
      isReady: criticalViolations.length === 0,
      percent: policyReadiness,
      missingFields: [],
      missingDocuments: model.input.deal.documents.missingDocuments,
      notes: ['Policy checks currently use placeholder policy definitions pending configurable policy connectors.'],
    },
    warnings,
    blockers,
    recommendation,
    nextActions: buildEvaluationActions(nextRequiredActions),
    evidenceSummary: {
      totalEvidenceItems: model.input.deal.documents.uploadedDocuments.length + model.input.deal.documents.missingDocuments.length,
      verifiedEvidenceItems: 0,
      missingEvidenceItems: model.input.deal.documents.missingDocuments.length,
      notes: ['Verification counts are placeholder-only in current policy evaluation scope.'],
    },
    evaluatedAt: new Date().toISOString(),
    decisionRecord: {
      finding: recommendation === 'proceed' ? 'Policy checks passed for current placeholder scope.' : 'Policy exceptions require review before progression.',
      rationale: `${policyExceptions.length} policy exception(s), ${criticalViolations.length} critical violation(s).`,
      policyReference: policyExceptions.map((exception) => exception.policyReference),
      supportingEvidence: model.input.deal.documents.uploadedDocuments,
      confidence: policyReadiness,
    },
  };

  return {
    evaluation,
    policyReadiness,
    policyExceptions,
    criticalViolations,
    approvalRequirements,
    policySummary: {
      headline: `Policy readiness ${policyReadiness}%`,
      narrative: `Detected ${policyExceptions.length} policy exception(s) and ${criticalViolations.length} critical violation(s) across ${model.rules.length} policy areas.`,
    },
    nextRequiredActions,
  };
}

export class PolicyEvaluationEngine implements EvaluationEngine {
  evaluate(deal: DealModel): EvaluationResult {
    return evaluatePolicyEvaluation({ deal }).evaluation;
  }
}
