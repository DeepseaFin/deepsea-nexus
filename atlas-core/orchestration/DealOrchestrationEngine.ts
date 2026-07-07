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
import {
  type OrchestrationInputs,
  WORKFLOW_STAGE_DEFINITIONS,
} from '@/atlas-core/orchestration/WorkflowRules';
import {
  ApprovalGateEngine,
  type ApprovalGateResult,
} from '@/atlas-core/orchestration/ApprovalGateEngine';
import {
  StageTransitionEngine,
  type WorkflowStageRuntime,
} from '@/atlas-core/orchestration/StageTransitionEngine';
import {
  DealStateMachine,
  type DealStateSnapshot,
} from '@/atlas-core/orchestration/DealStateMachine';
import {
  WorkflowEngine,
  type WorkflowAnalytics,
} from '@/atlas-core/orchestration/WorkflowEngine';

export interface DealOrchestrationResult {
  generatedAt: string;
  dealId: string;
  dealName: string;
  stages: WorkflowStageRuntime[];
  gates: ApprovalGateResult[];
  stateMachine: DealStateSnapshot;
  analytics: WorkflowAnalytics;
  engineSnapshot: {
    commercialReadiness: number;
    riskReadiness: number;
    policyReadiness: number;
    evidenceReadiness: number;
    creditMemoReadiness: number;
    legalReadiness: number;
    legalAssemblyReadiness: number;
    legalPackageReadiness: number;
  };
}

function toEvidenceUploads(deal: DealModel): Array<{ name: string; confidence: number; documentType: string }> {
  return deal.documents.uploadedDocuments.map((name) => ({
    name,
    confidence: 100,
    documentType: name,
  }));
}

function buildInputs(deal: DealModel): OrchestrationInputs {
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

  const pricing = evaluatePricing(deal);
  const participants = ParticipantEngine.evaluateParticipants(deal);
  const policy = evaluateDealPolicy(deal);
  const evidence = EvidenceEngine.evaluateEvidence({
    deal,
    uploads: toEvidenceUploads(deal),
  });
  const creditMemo = CreditMemoEngine.buildCreditMemo(deal);
  const indicativeTermSheet = TermSheetGenerationEngine.generateTermSheet(deal);
  const finalTermSheet = FinalTermSheetGenerationEngine.generateFinalTermSheet(deal);
  const legalDocumentation = LegalDocumentationEngine.generateLegalDocumentation(deal);
  const legalAssembly = LegalAssemblyEngine.assembleLegalRequirements(deal);
  const legalPackage = LegalDocumentGenerator.generateLegalPackage(deal, legalAssembly);
  const legacyRisk = calculateRisk(deal);

  return {
    deal,
    commercial,
    pricing,
    participants,
    policy,
    evidence,
    creditMemo,
    indicativeTermSheet,
    finalTermSheet,
    legalDocumentation,
    legalAssembly,
    legalPackage,
    legacyRisk,
  };
}

export function orchestrateDealWorkflow(deal: DealModel): DealOrchestrationResult {
  const inputs = buildInputs(deal);
  const gates = ApprovalGateEngine.evaluateApprovalGates(inputs);
  const stages = StageTransitionEngine.evaluateStageTransitions(inputs, gates);
  const stateMachine = DealStateMachine.buildDealStateSnapshot(stages, gates);
  const analytics = WorkflowEngine.buildWorkflowAnalytics(stages, gates, inputs);

  return {
    generatedAt: new Date().toISOString(),
    dealId: deal.deal.dealId,
    dealName: deal.deal.dealName,
    stages,
    gates,
    stateMachine,
    analytics,
    engineSnapshot: {
      commercialReadiness: inputs.commercial.evaluationFindings.readiness.score,
      riskReadiness: inputs.participants.readiness.score,
      policyReadiness: inputs.policy.executiveSummary.policyReadiness,
      evidenceReadiness: inputs.evidence.readiness,
      creditMemoReadiness: inputs.creditMemo.executiveDecisionSummary.overallReadiness,
      legalReadiness: inputs.legalDocumentation.executiveSummary.overallLegalReadiness,
      legalAssemblyReadiness: inputs.legalAssembly.legalReadinessScore,
      legalPackageReadiness: inputs.legalPackage.overallReadiness,
    },
  };
}

export const DealOrchestrationEngine = {
  orchestrateDealWorkflow,
  stageDefinitions: WORKFLOW_STAGE_DEFINITIONS,
};
