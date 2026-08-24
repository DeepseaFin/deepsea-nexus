import type { DealModel } from '@/atlas-core/deals/DealModel';
import { evaluateCommercial } from '@/atlas-core/commercial/CommercialEngine';
import { ParticipantEngine } from '@/atlas-core/participants/ParticipantEngine';
import { evaluateDealPolicy } from '@/atlas-core/policy/PolicyEngine';
import { EvidenceEngine } from '@/atlas-core/evidence/EvidenceEngine';

export interface CreditMemoApprovalStatus {
  role: 'Relationship Manager' | 'Credit Analyst' | 'Investment Committee' | 'Operations';
  status: 'Pending';
  note: string;
}

export interface CreditMemoDecisionHistoryItem {
  id: string;
  event: string;
  detail: string;
  status: 'placeholder';
}

export interface CreditMemoResult {
  commercial: ReturnType<typeof evaluateCommercial>;
  risk: ReturnType<typeof ParticipantEngine.evaluateParticipants>;
  policy: ReturnType<typeof evaluateDealPolicy>;
  evidence: ReturnType<typeof EvidenceEngine.evaluateEvidence>;
  executiveDecisionSummary: {
    overallRecommendation: 'Proceed' | 'Proceed with Conditions' | 'Do Not Proceed';
    commercialReadiness: number;
    riskReadiness: number;
    policyReadiness: number;
    evidenceReadiness: number;
    overallReadiness: number;
  };
  investmentCommitteeDecision: {
    recommendation: 'Proceed' | 'Proceed with Conditions' | 'Do Not Proceed';
    conditions: string[];
    keyRisks: string[];
    requiredActions: string[];
  };
  approvalMatrix: CreditMemoApprovalStatus[];
  decisionHistory: CreditMemoDecisionHistoryItem[];
}

function recommendationRank(value: string): number {
  if (value === 'Proceed') return 2;
  if (value === 'Proceed with Conditions' || value === 'Review Required') return 1;
  return 0;
}

function recommendationFromRank(rank: number): 'Proceed' | 'Proceed with Conditions' | 'Do Not Proceed' {
  if (rank >= 2) return 'Proceed';
  if (rank === 1) return 'Proceed with Conditions';
  return 'Do Not Proceed';
}

function uniqueNonEmpty(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)));
}

function toOverallReadiness(scores: number[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, value) => sum + value, 0);
  return Math.round(total / scores.length);
}

export function buildCreditMemo(deal: DealModel): CreditMemoResult {
  const commercial = evaluateCommercial({
    invoiceAmount: deal.commercialStructure.invoiceAmount,
    requestedFunding: deal.commercialStructure.requestedFunding,
    advanceRatePercent: deal.commercialStructure.advanceRate,
    tenorDays: deal.commercialStructure.tenorDays,
    discountRatePercent: deal.commercialStructure.discountRatePercent,
    fees: {
      processingFee: deal.commercialStructure.processingFee,
      legalFee: deal.commercialStructure.legalFee,
      otherCharges: deal.commercialStructure.otherCharges,
    },
    currency: deal.commercialStructure.currency,
    recourseType: deal.commercialStructure.recourseType,
  });

  const risk = ParticipantEngine.evaluateParticipants(deal);
  const policy = evaluateDealPolicy(deal);
  const evidence = EvidenceEngine.evaluateEvidence({
    deal,
    uploads: deal.documents.uploadedDocuments.map((name) => ({
      name,
      confidence: 100,
    })),
  });

  const recommendationRankValue = Math.min(
    recommendationRank(commercial.evaluationFindings.recommendation),
    recommendationRank(risk.recommendation),
    recommendationRank(policy.executiveSummary.recommendationLabel),
    recommendationRank(evidence.recommendation),
  );

  const overallRecommendation = recommendationFromRank(recommendationRankValue);
  const commercialReadiness = commercial.evaluationFindings.readiness.score;
  const riskReadiness = risk.readiness.score;
  const policyReadiness = policy.executiveSummary.policyReadiness;
  const evidenceReadiness = evidence.readiness;
  const overallReadiness = toOverallReadiness([
    commercialReadiness,
    riskReadiness,
    policyReadiness,
    evidenceReadiness,
  ]);

  const conditions = uniqueNonEmpty([
    ...commercial.evaluationFindings.recommendedActions.map((action) => action.action),
    ...risk.requiredActions.map((action) => action.action),
    ...policy.evaluation.nextActions.map((action) => action.title),
    ...evidence.requiredActions.map((action) => action.action),
  ]).slice(0, 8);

  const keyRisks = uniqueNonEmpty([
    ...commercial.evaluationFindings.blockers.map((blocker) => blocker.message),
    ...risk.blockers.map((blocker) => blocker.message),
    ...policy.evaluation.blockers.map((blocker) => blocker.message),
    ...evidence.criticalBlockers.map((blocker) => blocker.message),
  ]).slice(0, 8);

  const requiredActions = uniqueNonEmpty([
    ...commercial.evaluationFindings.recommendedActions.map((action) => action.action),
    ...risk.requiredActions.map((action) => action.action),
    ...policy.evaluation.nextActions.map((action) => action.title),
    ...evidence.requiredActions.map((action) => action.action),
  ]).slice(0, 10);

  return {
    commercial,
    risk,
    policy,
    evidence,
    executiveDecisionSummary: {
      overallRecommendation,
      commercialReadiness,
      riskReadiness,
      policyReadiness,
      evidenceReadiness,
      overallReadiness,
    },
    investmentCommitteeDecision: {
      recommendation: overallRecommendation,
      conditions,
      keyRisks,
      requiredActions,
    },
    approvalMatrix: [
      {
        role: 'Relationship Manager',
        status: 'Pending',
        note: 'Placeholder status',
      },
      {
        role: 'Credit Analyst',
        status: 'Pending',
        note: 'Placeholder status',
      },
      {
        role: 'Investment Committee',
        status: 'Pending',
        note: 'Placeholder status',
      },
      {
        role: 'Operations',
        status: 'Pending',
        note: 'Placeholder status',
      },
    ],
    decisionHistory: [
      {
        id: 'decision-history-1',
        event: 'Memo Initialized',
        detail: 'Credit memo generated from current engine outputs.',
        status: 'placeholder',
      },
      {
        id: 'decision-history-2',
        event: 'Committee Review Queue',
        detail: 'Awaiting committee review and approval actions.',
        status: 'placeholder',
      },
    ],
  };
}

export const CreditMemoEngine = {
  buildCreditMemo,
};
