import {
  buildWorkflowSignals,
  getStageCompletionMap,
  getStageDefinition,
  type OrchestrationInputs,
  type WorkflowStageStatus,
  WORKFLOW_STAGE_DEFINITIONS,
} from '@/atlas-core/orchestration/WorkflowRules';
import {
  evaluateApprovalGates,
  gateStatusToStageStatus,
  type ApprovalGateResult,
} from '@/atlas-core/orchestration/ApprovalGateEngine';

export interface WorkflowStageRuntime {
  stageId: number;
  stageName: string;
  status: WorkflowStageStatus;
  owner: string;
  department: string;
  startDate: string;
  targetDate: string;
  completionPercent: number;
  dependencies: string[];
  requiredEngines: string[];
  requiredDocuments: string[];
  requiredApprovals: string[];
  blockingIssues: string[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function earliestReferenceDate(inputs: OrchestrationInputs): Date {
  const timelineDate = inputs.deal.timeline
    .map((entry) => new Date(entry.time))
    .find((value) => !Number.isNaN(value.getTime()));

  if (timelineDate) {
    return timelineDate;
  }

  const workflowDate = new Date(inputs.deal.workflow.lastUpdated);
  if (!Number.isNaN(workflowDate.getTime())) {
    return workflowDate;
  }

  return new Date();
}

function stageProgressScore(stageId: number, inputs: OrchestrationInputs): number {
  switch (stageId) {
    case 1:
      return inputs.deal.deal.dealName.trim().length > 0 ? 100 : 35;
    case 2:
      return clamp(inputs.evidence.readiness, 0, 100);
    case 3:
      return clamp(inputs.commercial.evaluationFindings.readiness.score, 0, 100);
    case 4:
      return clamp(Math.round((inputs.pricing.approvedFunding / Math.max(inputs.pricing.requestedFunding, 1)) * 100), 0, 100);
    case 5:
      return clamp(
        Math.round((inputs.participants.readiness.score + inputs.policy.executiveSummary.policyReadiness + inputs.legacyRisk.score) / 3),
        0,
        100,
      );
    case 6:
      return clamp(inputs.creditMemo.executiveDecisionSummary.overallReadiness, 0, 100);
    case 7:
      return inputs.indicativeTermSheet.commercialStatus === 'Draft'
        ? 40
        : inputs.indicativeTermSheet.commercialStatus === 'Under Negotiation'
          ? 75
          : 100;
    case 8:
      return inputs.indicativeTermSheet.commercialStatus === 'Commercially Agreed' ? 100 : 65;
    case 9:
      return inputs.finalTermSheet.executionStatus.current === 'Draft'
        ? 45
        : inputs.finalTermSheet.executionStatus.current === 'Ready for Execution'
          ? 85
          : 100;
    case 10:
      return clamp(inputs.legalDocumentation.executiveSummary.overallLegalReadiness, 0, 100);
    case 11:
      return clamp(inputs.legalAssembly.legalReadinessScore, 0, 100);
    case 12:
      return inputs.finalTermSheet.executionStatus.current === 'Fully Executed'
        ? 100
        : inputs.finalTermSheet.executionStatus.current === 'Signed by Client' || inputs.finalTermSheet.executionStatus.current === 'Signed by Deepsea'
          ? 70
          : 35;
    case 13:
      return clamp(
        Math.round(
          (inputs.finalTermSheet.conditionsPrecedent.filter((row) => row.status === 'Satisfied' || row.status === 'Waived').length /
            Math.max(inputs.finalTermSheet.conditionsPrecedent.length, 1)) * 100,
        ),
        0,
        100,
      );
    case 14:
      return inputs.deal.approval.status.toLowerCase().includes('approved') ? 100 : 45;
    case 15:
      return inputs.deal.funding.fundingStatus.toLowerCase().includes('funded') ||
        inputs.deal.funding.fundingStatus.toLowerCase().includes('disbursed')
        ? 100
        : 35;
    case 16:
      return inputs.deal.funding.fundingStatus.toLowerCase().includes('settled') ? 100 : 30;
    case 17:
      return inputs.deal.deal.status.toLowerCase().includes('live') ? 100 : 20;
    case 18:
      return inputs.deal.deal.stage.toLowerCase().includes('collection') ? 70 : 20;
    case 19:
      return inputs.deal.deal.status.toLowerCase().includes('closed') ? 100 : 0;
    default:
      return 0;
  }
}

function resolveStageStatus(args: {
  stageId: number;
  firstIncompleteStageId: number | null;
  completedMap: Record<number, boolean>;
  gate: ApprovalGateResult;
  inputs: OrchestrationInputs;
}): WorkflowStageStatus {
  const dealStatus = args.inputs.deal.deal.status.toLowerCase();

  if (dealStatus.includes('cancelled')) {
    return 'Cancelled';
  }

  if (args.completedMap[args.stageId]) {
    return 'Completed';
  }

  if (dealStatus.includes('rejected') || args.gate.gateStatus === 'Rejected') {
    return 'Rejected';
  }

  if (args.gate.gateStatus === 'Blocked') {
    return 'Blocked';
  }

  if (args.gate.gateStatus === 'Pending Approval') {
    return 'Pending Approval';
  }

  if (args.firstIncompleteStageId === args.stageId) {
    return 'In Progress';
  }

  return gateStatusToStageStatus(args.gate.gateStatus);
}

export function evaluateStageTransitions(
  inputs: OrchestrationInputs,
  providedGates?: ApprovalGateResult[],
): WorkflowStageRuntime[] {
  const gates = providedGates ?? evaluateApprovalGates(inputs);
  const gateByStageId = new Map(gates.map((gate) => [gate.stageId, gate]));

  const signals = buildWorkflowSignals(inputs);
  const completedMap = getStageCompletionMap(signals);
  const firstIncompleteStage = WORKFLOW_STAGE_DEFINITIONS.find((stage) => !completedMap[stage.stageId]);
  const firstIncompleteStageId = firstIncompleteStage?.stageId ?? null;

  const baseDate = earliestReferenceDate(inputs);
  let offsetDays = 0;

  return WORKFLOW_STAGE_DEFINITIONS.map((stage) => {
    const definition = getStageDefinition(stage.stageId);
    const plannedStart = addDays(baseDate, offsetDays);
    const plannedTarget = addDays(plannedStart, definition.targetDurationDays);
    offsetDays += definition.targetDurationDays;

    const gate = gateByStageId.get(stage.stageId);
    if (!gate) {
      throw new Error(`Missing gate evaluation for stage ${stage.stageId}`);
    }

    const status = resolveStageStatus({
      stageId: stage.stageId,
      firstIncompleteStageId,
      completedMap,
      gate,
      inputs,
    });

    const completionPercent = status === 'Completed' ? 100 : stageProgressScore(stage.stageId, inputs);

    return {
      stageId: stage.stageId,
      stageName: stage.stageName,
      status,
      owner: definition.owner,
      department: definition.department,
      startDate: toIsoDate(plannedStart),
      targetDate: toIsoDate(plannedTarget),
      completionPercent,
      dependencies: definition.dependencies.map((dependencyId) => getStageDefinition(dependencyId).stageName),
      requiredEngines: definition.requiredEngines,
      requiredDocuments: definition.requiredDocuments,
      requiredApprovals: definition.requiredApprovals,
      blockingIssues: gate.blockingIssues,
    } satisfies WorkflowStageRuntime;
  });
}

export const StageTransitionEngine = {
  evaluateStageTransitions,
};
