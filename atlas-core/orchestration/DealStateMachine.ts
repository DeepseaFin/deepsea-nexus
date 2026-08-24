import type { ApprovalGateResult } from '@/atlas-core/orchestration/ApprovalGateEngine';
import type { WorkflowStageRuntime } from '@/atlas-core/orchestration/StageTransitionEngine';

export interface StageTransitionEligibility {
  fromStageId: number;
  toStageId: number;
  allowed: boolean;
  reasons: string[];
}

export interface DealStateSnapshot {
  currentStageId: number;
  currentStageName: string;
  previousStageId: number | null;
  nextStageId: number | null;
  completedStageIds: number[];
  completionPercent: number;
  transitionOptions: StageTransitionEligibility[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function findCurrentStage(stages: WorkflowStageRuntime[]): WorkflowStageRuntime {
  const inProgress = stages.find(
    (stage) =>
      stage.status === 'In Progress' ||
      stage.status === 'Pending Approval' ||
      stage.status === 'Blocked',
  );

  if (inProgress) {
    return inProgress;
  }

  const firstWaiting = stages.find((stage) => stage.status === 'Waiting');
  if (firstWaiting) {
    return firstWaiting;
  }

  return stages[stages.length - 1];
}

function evaluateTransition(
  fromStage: WorkflowStageRuntime,
  toStage: WorkflowStageRuntime,
  gateByStageId: Map<number, ApprovalGateResult>,
): StageTransitionEligibility {
  const reasons: string[] = [];
  const gate = gateByStageId.get(toStage.stageId);

  if (toStage.stageId !== fromStage.stageId + 1) {
    reasons.push('Transitions are only allowed to the next sequential stage.');
  }

  if (fromStage.status !== 'Completed') {
    reasons.push(`Current stage ${fromStage.stageName} must be completed before transition.`);
  }

  if (gate?.blockingIssues && gate.blockingIssues.length > 0) {
    reasons.push(...gate.blockingIssues);
  }

  if (gate?.pendingApprovals && gate.pendingApprovals.length > 0) {
    reasons.push(
      ...gate.pendingApprovals.map((approval) => `Pending approval: ${approval}.`),
    );
  }

  if (toStage.status === 'Rejected' || toStage.status === 'Cancelled') {
    reasons.push(`Target stage ${toStage.stageName} is ${toStage.status.toLowerCase()}.`);
  }

  return {
    fromStageId: fromStage.stageId,
    toStageId: toStage.stageId,
    allowed: reasons.length === 0,
    reasons,
  };
}

export function buildDealStateSnapshot(
  stages: WorkflowStageRuntime[],
  gates: ApprovalGateResult[],
): DealStateSnapshot {
  if (stages.length === 0) {
    throw new Error('Cannot build state machine snapshot without stages.');
  }

  const currentStage = findCurrentStage(stages);
  const previousStage = stages.find((stage) => stage.stageId === currentStage.stageId - 1) ?? null;
  const nextStage = stages.find((stage) => stage.stageId === currentStage.stageId + 1) ?? null;
  const gateByStageId = new Map(gates.map((gate) => [gate.stageId, gate]));

  const transitionOptions = nextStage
    ? [evaluateTransition(currentStage, nextStage, gateByStageId)]
    : [];

  return {
    currentStageId: currentStage.stageId,
    currentStageName: currentStage.stageName,
    previousStageId: previousStage?.stageId ?? null,
    nextStageId: nextStage?.stageId ?? null,
    completedStageIds: stages
      .filter((stage) => stage.status === 'Completed')
      .map((stage) => stage.stageId),
    completionPercent: clamp(
      Math.round(average(stages.map((stage) => stage.completionPercent))),
      0,
      100,
    ),
    transitionOptions,
  };
}

export const DealStateMachine = {
  buildDealStateSnapshot,
};
