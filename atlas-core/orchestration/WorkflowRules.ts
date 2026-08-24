import type { DealModel } from '@/atlas-core/deals/DealModel';
import { evaluateCommercial } from '@/atlas-core/commercial/CommercialEngine';
import { evaluatePricing } from '@/atlas-core/evaluation/PricingEngine';
import { ParticipantEngine } from '@/atlas-core/participants/ParticipantEngine';
import { evaluateDealPolicy } from '@/atlas-core/policy/PolicyEngine';
import { EvidenceEngine } from '@/atlas-core/evidence/EvidenceEngine';
import { CreditMemoEngine } from '@/atlas-core/evaluation/CreditMemoEngine';
import { TermSheetGenerationEngine } from '@/atlas-core/evaluation/TermSheetGenerationEngine';
import { FinalTermSheetGenerationEngine } from '@/atlas-core/evaluation/FinalTermSheetGenerationEngine';
import { LegalDocumentationEngine } from '@/atlas-core/evaluation/LegalDocumentationEngine';
import { LegalAssemblyEngine } from '@/atlas-core/legal/LegalAssemblyEngine';
import { LegalDocumentGenerator } from '@/atlas-core/legal/LegalDocumentGenerator';
import { calculateRisk } from '@/atlas-core/engines/risk';

export type WorkflowStageStatus =
  | 'Waiting'
  | 'In Progress'
  | 'Pending Approval'
  | 'Completed'
  | 'Blocked'
  | 'Rejected'
  | 'Cancelled';

export interface StageDefinition {
  stageId: number;
  stageName: string;
  owner: string;
  department: string;
  targetDurationDays: number;
  dependencies: number[];
  requiredEngines: string[];
  requiredDocuments: string[];
  requiredApprovals: string[];
}

export interface OrchestrationInputs {
  deal: DealModel;
  commercial: ReturnType<typeof evaluateCommercial>;
  pricing: ReturnType<typeof evaluatePricing>;
  participants: ReturnType<typeof ParticipantEngine.evaluateParticipants>;
  policy: ReturnType<typeof evaluateDealPolicy>;
  evidence: ReturnType<typeof EvidenceEngine.evaluateEvidence>;
  creditMemo: ReturnType<typeof CreditMemoEngine.buildCreditMemo>;
  indicativeTermSheet: ReturnType<typeof TermSheetGenerationEngine.generateTermSheet>;
  finalTermSheet: ReturnType<typeof FinalTermSheetGenerationEngine.generateFinalTermSheet>;
  legalDocumentation: ReturnType<typeof LegalDocumentationEngine.generateLegalDocumentation>;
  legalAssembly: ReturnType<typeof LegalAssemblyEngine.assembleLegalRequirements>;
  legalPackage: ReturnType<typeof LegalDocumentGenerator.generateLegalPackage>;
  legacyRisk: ReturnType<typeof calculateRisk>;
}

export interface WorkflowSignals {
  draftReady: boolean;
  clientOnboarded: boolean;
  commercialReviewComplete: boolean;
  pricingComplete: boolean;
  riskAssessmentComplete: boolean;
  creditCommitteeCleared: boolean;
  indicativeTermSheetIssued: boolean;
  commercialNegotiationComplete: boolean;
  finalExecutableTermSheetApproved: boolean;
  legalDocumentationReady: boolean;
  legalReviewComplete: boolean;
  legalExecutionComplete: boolean;
  conditionsPrecedentComplete: boolean;
  fundingApprovalComplete: boolean;
  treasuryLiquidityConfirmed: boolean;
  settlementComplete: boolean;
  fundsDisbursed: boolean;
  liveMonitoringActive: boolean;
  collectionsComplete: boolean;
  zeroOutstanding: boolean;
  zeroClaims: boolean;
  zeroPendingCollections: boolean;
}

export const WORKFLOW_STAGE_DEFINITIONS: StageDefinition[] = [
  {
    stageId: 1,
    stageName: 'Draft',
    owner: 'Relationship Manager',
    department: 'Origination',
    targetDurationDays: 1,
    dependencies: [],
    requiredEngines: ['DealModel'],
    requiredDocuments: ['Initial Deal Intake'],
    requiredApprovals: [],
  },
  {
    stageId: 2,
    stageName: 'Client Onboarding',
    owner: 'Relationship Manager',
    department: 'Origination',
    targetDurationDays: 2,
    dependencies: [1],
    requiredEngines: ['ParticipantEngine', 'EvidenceEngine'],
    requiredDocuments: ['Trade Licence', 'Passport', 'Emirates ID'],
    requiredApprovals: ['KYC Validation'],
  },
  {
    stageId: 3,
    stageName: 'Commercial Review',
    owner: 'Structuring Lead',
    department: 'Commercial',
    targetDurationDays: 2,
    dependencies: [2],
    requiredEngines: ['CommercialEngine'],
    requiredDocuments: ['Commercial Structure Inputs'],
    requiredApprovals: ['Structuring Sign-Off'],
  },
  {
    stageId: 4,
    stageName: 'Pricing Complete',
    owner: 'Pricing Analyst',
    department: 'Commercial',
    targetDurationDays: 1,
    dependencies: [3],
    requiredEngines: ['PricingEngine'],
    requiredDocuments: ['Pricing Snapshot'],
    requiredApprovals: ['Pricing Sign-Off'],
  },
  {
    stageId: 5,
    stageName: 'Risk Assessment',
    owner: 'Risk Analyst',
    department: 'Risk',
    targetDurationDays: 2,
    dependencies: [4],
    requiredEngines: ['ParticipantEngine', 'PolicyEngine', 'risk'],
    requiredDocuments: ['Risk Pack', 'Policy Exception Register'],
    requiredApprovals: ['Risk Sign-Off'],
  },
  {
    stageId: 6,
    stageName: 'Credit Committee',
    owner: 'Credit Committee Chair',
    department: 'Credit',
    targetDurationDays: 2,
    dependencies: [5],
    requiredEngines: ['CreditMemoEngine'],
    requiredDocuments: ['Credit Memo'],
    requiredApprovals: ['Credit Committee Approval'],
  },
  {
    stageId: 7,
    stageName: 'Indicative Term Sheet',
    owner: 'Relationship Manager',
    department: 'Commercial',
    targetDurationDays: 1,
    dependencies: [6],
    requiredEngines: ['TermSheetGenerationEngine'],
    requiredDocuments: ['Indicative Term Sheet'],
    requiredApprovals: ['Commercial Distribution Approval'],
  },
  {
    stageId: 8,
    stageName: 'Commercial Negotiation',
    owner: 'Relationship Manager',
    department: 'Commercial',
    targetDurationDays: 3,
    dependencies: [7],
    requiredEngines: ['TermSheetGenerationEngine'],
    requiredDocuments: ['Negotiation Matrix'],
    requiredApprovals: ['Negotiation Outcome Approval'],
  },
  {
    stageId: 9,
    stageName: 'Final Executable Term Sheet',
    owner: 'Credit Committee Chair',
    department: 'Credit',
    targetDurationDays: 1,
    dependencies: [8],
    requiredEngines: ['FinalTermSheetGenerationEngine'],
    requiredDocuments: ['Final Executable Term Sheet'],
    requiredApprovals: ['Final Term Sheet Approval'],
  },
  {
    stageId: 10,
    stageName: 'Legal Documentation',
    owner: 'Legal Counsel',
    department: 'Legal',
    targetDurationDays: 3,
    dependencies: [9],
    requiredEngines: ['LegalDocumentationEngine', 'LegalDocumentGenerator'],
    requiredDocuments: ['Legal Documentation Package'],
    requiredApprovals: ['Legal Draft Approval'],
  },
  {
    stageId: 11,
    stageName: 'Legal Review',
    owner: 'Legal Counsel',
    department: 'Legal',
    targetDurationDays: 2,
    dependencies: [10],
    requiredEngines: ['LegalAssemblyEngine'],
    requiredDocuments: ['Legal Review Checklist'],
    requiredApprovals: ['Legal Review Approval'],
  },
  {
    stageId: 12,
    stageName: 'Signatures',
    owner: 'Legal Operations',
    department: 'Legal',
    targetDurationDays: 2,
    dependencies: [11],
    requiredEngines: ['FinalTermSheetGenerationEngine', 'LegalDocumentGenerator'],
    requiredDocuments: ['Execution Package'],
    requiredApprovals: ['Execution Sign-Off'],
  },
  {
    stageId: 13,
    stageName: 'Conditions Precedent',
    owner: 'Credit Operations',
    department: 'Operations',
    targetDurationDays: 2,
    dependencies: [12],
    requiredEngines: ['FinalTermSheetGenerationEngine', 'EvidenceEngine'],
    requiredDocuments: ['CP Checklist'],
    requiredApprovals: ['CP Completion Approval'],
  },
  {
    stageId: 14,
    stageName: 'Funding Approval',
    owner: 'Credit Committee Chair',
    department: 'Credit',
    targetDurationDays: 1,
    dependencies: [13],
    requiredEngines: ['CreditMemoEngine', 'PolicyEngine'],
    requiredDocuments: ['Funding Approval Note'],
    requiredApprovals: ['Funding Approval'],
  },
  {
    stageId: 15,
    stageName: 'Treasury Funding',
    owner: 'Treasury Manager',
    department: 'Treasury',
    targetDurationDays: 1,
    dependencies: [14],
    requiredEngines: ['DealModel'],
    requiredDocuments: ['Liquidity Confirmation', 'Funding Instruction'],
    requiredApprovals: ['Treasury Liquidity Confirmation'],
  },
  {
    stageId: 16,
    stageName: 'Settlement',
    owner: 'Operations Manager',
    department: 'Operations',
    targetDurationDays: 1,
    dependencies: [15],
    requiredEngines: ['DealModel'],
    requiredDocuments: ['Settlement Confirmation'],
    requiredApprovals: ['Settlement Approval'],
  },
  {
    stageId: 17,
    stageName: 'Live Monitoring',
    owner: 'Portfolio Manager',
    department: 'Monitoring',
    targetDurationDays: 30,
    dependencies: [16],
    requiredEngines: ['ParticipantEngine', 'PolicyEngine'],
    requiredDocuments: ['Monitoring Baseline'],
    requiredApprovals: ['Monitoring Activation'],
  },
  {
    stageId: 18,
    stageName: 'Collections',
    owner: 'Collections Lead',
    department: 'Collections',
    targetDurationDays: 30,
    dependencies: [17],
    requiredEngines: ['DealModel'],
    requiredDocuments: ['Collections Ledger'],
    requiredApprovals: ['Collections Start Approval'],
  },
  {
    stageId: 19,
    stageName: 'Facility Closed',
    owner: 'Portfolio Manager',
    department: 'Monitoring',
    targetDurationDays: 1,
    dependencies: [18],
    requiredEngines: ['DealModel'],
    requiredDocuments: ['Facility Closure Note'],
    requiredApprovals: ['Facility Closure Approval'],
  },
];

const STAGE_BY_ID = new Map<number, StageDefinition>(
  WORKFLOW_STAGE_DEFINITIONS.map((stage) => [stage.stageId, stage]),
);

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function hasAnyKeyword(value: string, keywords: string[]): boolean {
  const normalized = normalize(value);
  return keywords.some((keyword) => normalized.includes(keyword));
}

function inferFundingDisbursedStatus(deal: DealModel): boolean {
  return hasAnyKeyword(deal.funding.fundingStatus, [
    'disbursed',
    'funded',
    'settled',
    'live',
  ]);
}

function inferCollectionsCompleteStatus(deal: DealModel): boolean {
  const timelineText = (deal.timeline ?? [])
    .map((entry) => `${entry.title} ${entry.description} ${entry.status}`)
    .join(' ');

  return hasAnyKeyword(`${deal.funding.fundingStatus} ${timelineText}`, [
    'collections complete',
    'fully collected',
    'closed',
    'repaid',
  ]);
}

function inferZeroOutstanding(deal: DealModel): boolean {
  const tasks = (deal.tasks ?? []).map((task) => `${task.title} ${task.description} ${task.status}`).join(' ');
  return hasAnyKeyword(tasks, ['zero outstanding', 'fully reconciled', 'no dues']);
}

function inferZeroClaims(deal: DealModel): boolean {
  const timelineText = (deal.timeline ?? [])
    .map((entry) => `${entry.title} ${entry.description}`)
    .join(' ');
  return hasAnyKeyword(timelineText, ['zero claims', 'claims closed', 'no claims']);
}

function inferZeroPendingCollections(deal: DealModel): boolean {
  const tasks = (deal.tasks ?? [])
    .map((task) => `${task.title} ${task.description} ${task.status}`)
    .join(' ');
  return hasAnyKeyword(tasks, ['zero pending collections', 'collections cleared']);
}

export function buildWorkflowSignals(inputs: OrchestrationInputs): WorkflowSignals {
  const cpComplete = inputs.finalTermSheet.conditionsPrecedent.every(
    (row) => row.status === 'Satisfied' || row.status === 'Waived',
  );
  const signaturesComplete = inputs.finalTermSheet.executionStatus.current === 'Fully Executed';
  const readyForExecution =
    inputs.finalTermSheet.executionStatus.current === 'Ready for Execution' ||
    inputs.finalTermSheet.executionStatus.current === 'Signed by Deepsea' ||
    inputs.finalTermSheet.executionStatus.current === 'Signed by Client' ||
    signaturesComplete;

  const legalDocsReady =
    inputs.legalDocumentation.executiveSummary.overallLegalReadiness >= 70 &&
    inputs.legalDocumentation.executiveSummary.missingMandatoryInputs === 0;

  const legalReviewDone =
    inputs.legalAssembly.legalReadinessScore >= 70 &&
    inputs.legalAssembly.conditionalDocuments.length === 0;

  const treasuryLiquidityConfirmed = hasAnyKeyword(inputs.deal.funding.fundingStatus, [
    'liquidity confirmed',
    'liquidity available',
    'funded',
    'disbursed',
    'settled',
  ]);

  const fundingApprovalComplete =
    hasAnyKeyword(inputs.deal.approval.status, ['approved', 'complete']) &&
    !hasAnyKeyword(inputs.deal.approval.status, ['pending', 'reject', 'decline']);

  const fundsDisbursed = inferFundingDisbursedStatus(inputs.deal);
  const settlementComplete = hasAnyKeyword(inputs.deal.funding.fundingStatus, ['settled', 'reconciled']);

  const liveMonitoringActive = hasAnyKeyword(inputs.deal.deal.status, ['live', 'monitor']) ||
    hasAnyKeyword(inputs.deal.deal.stage, ['monitor']) ||
    settlementComplete;

  const collectionsComplete = inferCollectionsCompleteStatus(inputs.deal);
  const zeroOutstanding = inferZeroOutstanding(inputs.deal);
  const zeroClaims = inferZeroClaims(inputs.deal);
  const zeroPendingCollections = inferZeroPendingCollections(inputs.deal);

  return {
    draftReady:
      inputs.deal.deal.dealId.trim().length > 0 &&
      inputs.deal.deal.dealName.trim().length > 0 &&
      inputs.deal.deal.amount > 0,
    clientOnboarded:
      inputs.deal.client.legalName.trim().length > 0 &&
      inputs.deal.client.country.trim().length > 0 &&
      inputs.deal.client.relationshipManager.trim().length > 0 &&
      inputs.evidence.criticalDocumentsPending === 0,
    commercialReviewComplete:
      inputs.commercial.evaluationFindings.readiness.score >= 65 &&
      inputs.commercial.evaluationFindings.recommendation !== 'Do Not Proceed',
    pricingComplete:
      inputs.pricing.approvedFunding > 0 &&
      inputs.pricing.requestedFunding > 0 &&
      inputs.pricing.discountRatePercent > 0,
    riskAssessmentComplete:
      inputs.participants.readiness.score >= 60 &&
      inputs.participants.blockers.length === 0 &&
      inputs.policy.executiveSummary.policyReadiness >= 60,
    creditCommitteeCleared:
      inputs.creditMemo.executiveDecisionSummary.overallReadiness >= 65 &&
      inputs.creditMemo.executiveDecisionSummary.overallRecommendation !== 'Do Not Proceed',
    indicativeTermSheetIssued:
      inputs.indicativeTermSheet.commercialStatus === 'Under Negotiation' ||
      inputs.indicativeTermSheet.commercialStatus === 'Commercially Agreed',
    commercialNegotiationComplete:
      inputs.indicativeTermSheet.commercialStatus === 'Commercially Agreed',
    finalExecutableTermSheetApproved: readyForExecution,
    legalDocumentationReady: legalDocsReady,
    legalReviewComplete: legalReviewDone,
    legalExecutionComplete: signaturesComplete,
    conditionsPrecedentComplete: cpComplete,
    fundingApprovalComplete,
    treasuryLiquidityConfirmed,
    settlementComplete,
    fundsDisbursed,
    liveMonitoringActive,
    collectionsComplete,
    zeroOutstanding,
    zeroClaims,
    zeroPendingCollections,
  };
}

export function getStageDefinition(stageId: number): StageDefinition {
  const stage = STAGE_BY_ID.get(stageId);
  if (!stage) {
    throw new Error(`Unknown stage id: ${stageId}`);
  }
  return stage;
}

export function getStageCompletionMap(signals: WorkflowSignals): Record<number, boolean> {
  return {
    1: signals.draftReady,
    2: signals.clientOnboarded,
    3: signals.commercialReviewComplete,
    4: signals.pricingComplete,
    5: signals.riskAssessmentComplete,
    6: signals.creditCommitteeCleared,
    7: signals.indicativeTermSheetIssued,
    8: signals.commercialNegotiationComplete,
    9: signals.finalExecutableTermSheetApproved,
    10: signals.legalDocumentationReady,
    11: signals.legalReviewComplete,
    12: signals.legalExecutionComplete,
    13: signals.conditionsPrecedentComplete,
    14: signals.fundingApprovalComplete,
    15: signals.treasuryLiquidityConfirmed,
    16: signals.settlementComplete,
    17: signals.liveMonitoringActive,
    18: signals.collectionsComplete,
    19: signals.zeroOutstanding && signals.zeroClaims && signals.zeroPendingCollections,
  };
}
