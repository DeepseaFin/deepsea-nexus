import type { ApprovalGateResult } from '@/atlas-core/orchestration/ApprovalGateEngine';
import type { OrchestrationInputs } from '@/atlas-core/orchestration/WorkflowRules';
import type { WorkflowStageRuntime } from '@/atlas-core/orchestration/StageTransitionEngine';

export interface WorkflowTimelineEntry {
  stageId: number;
  stageName: string;
  status: WorkflowStageRuntime['status'];
  startDate: string;
  targetDate: string;
  owner: string;
}

export interface DependencyNode {
  stageId: number;
  stageName: string;
  status: WorkflowStageRuntime['status'];
}

export interface DependencyEdge {
  fromStageId: number;
  toStageId: number;
  blocked: boolean;
}

export interface WorkflowDependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface WorkflowAnalytics {
  timeline: WorkflowTimelineEntry[];
  dependencyGraph: WorkflowDependencyGraph;
  estimatedCompletionDate: string;
  criticalPath: number[];
  nextRecommendedAction: string;
  workflowHealthScore: number;
  dealCompletionPercentage: number;
  progressPercentage: number;
  overallWorkflowRisk: 'Low' | 'Medium' | 'High' | 'Critical';
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function addDays(baseDate: Date, days: number): Date {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildDependencyGraph(stages: WorkflowStageRuntime[]): WorkflowDependencyGraph {
  const nodes: DependencyNode[] = stages.map((stage) => ({
    stageId: stage.stageId,
    stageName: stage.stageName,
    status: stage.status,
  }));

  const stageByName = new Map(stages.map((stage) => [stage.stageName, stage]));

  const edges: DependencyEdge[] = stages.flatMap((stage) =>
    stage.dependencies.map((dependencyName) => {
      const source = stageByName.get(dependencyName);
      if (!source) {
        return {
          fromStageId: -1,
          toStageId: stage.stageId,
          blocked: true,
        };
      }

      return {
        fromStageId: source.stageId,
        toStageId: stage.stageId,
        blocked: source.status !== 'Completed',
      };
    }),
  );

  return { nodes, edges };
}

function stageDurationDays(stage: WorkflowStageRuntime): number {
  const start = new Date(stage.startDate);
  const target = new Date(stage.targetDate);
  const ms = target.getTime() - start.getTime();
  if (Number.isNaN(ms)) {
    return 1;
  }

  const days = Math.max(Math.round(ms / (1000 * 60 * 60 * 24)), 1);
  return days;
}

function computeCriticalPath(stages: WorkflowStageRuntime[]): number[] {
  if (stages.length === 0) {
    return [];
  }

  // Stages are already ordered and dependency-safe in this lifecycle; the critical path
  // is the longest remaining chain of not-completed stages by planned duration.
  const firstOpenIndex = stages.findIndex((stage) => stage.status !== 'Completed');
  if (firstOpenIndex < 0) {
    return [stages[stages.length - 1].stageId];
  }

  return stages
    .slice(firstOpenIndex)
    .sort((left, right) => right.stageId - left.stageId)
    .sort((left, right) => stageDurationDays(right) - stageDurationDays(left))
    .map((stage) => stage.stageId);
}

function buildNextRecommendedAction(
  stages: WorkflowStageRuntime[],
  gates: ApprovalGateResult[],
): string {
  const firstBlocked = stages.find((stage) => stage.status === 'Blocked');
  if (firstBlocked) {
    const firstIssue = firstBlocked.blockingIssues[0] ?? 'Resolve blocking issue.';
    return `Resolve blocker in ${firstBlocked.stageName}: ${firstIssue}`;
  }

  const firstPendingApproval = gates.find((gate) => gate.pendingApprovals.length > 0);
  if (firstPendingApproval) {
    return `Obtain pending approval for ${firstPendingApproval.stageName}: ${firstPendingApproval.pendingApprovals[0]}`;
  }

  const firstWaiting = stages.find((stage) => stage.status === 'Waiting');
  if (firstWaiting) {
    return `Prepare prerequisites for ${firstWaiting.stageName}.`;
  }

  const current = stages.find((stage) => stage.status === 'In Progress');
  if (current) {
    return `Advance ${current.stageName} to completion.`;
  }

  return 'Workflow is complete. Proceed with archival and post-mortem checks.';
}

function computeRiskLabel(score: number): WorkflowAnalytics['overallWorkflowRisk'] {
  if (score >= 80) return 'Low';
  if (score >= 60) return 'Medium';
  if (score >= 40) return 'High';
  return 'Critical';
}

function computeWorkflowHealth(args: {
  progress: number;
  blockers: number;
  pendingApprovals: number;
  riskReadiness: number;
  policyReadiness: number;
  evidenceReadiness: number;
  legalReadiness: number;
}): number {
  const blockerPenalty = args.blockers * 6;
  const approvalPenalty = args.pendingApprovals * 4;
  const operationalReadiness = average([
    args.riskReadiness,
    args.policyReadiness,
    args.evidenceReadiness,
    args.legalReadiness,
  ]);

  return clamp(
    Math.round(args.progress * 0.45 + operationalReadiness * 0.55 - blockerPenalty - approvalPenalty),
    0,
    100,
  );
}

function computeEstimatedCompletionDate(stages: WorkflowStageRuntime[]): string {
  const remainingDays = stages
    .filter((stage) => stage.status !== 'Completed')
    .reduce((sum, stage) => sum + stageDurationDays(stage), 0);

  return toIsoDate(addDays(new Date(), remainingDays));
}

export function buildWorkflowAnalytics(
  stages: WorkflowStageRuntime[],
  gates: ApprovalGateResult[],
  inputs: OrchestrationInputs,
): WorkflowAnalytics {
  const timeline: WorkflowTimelineEntry[] = stages.map((stage) => ({
    stageId: stage.stageId,
    stageName: stage.stageName,
    status: stage.status,
    startDate: stage.startDate,
    targetDate: stage.targetDate,
    owner: stage.owner,
  }));

  const progressPercentage = clamp(
    Math.round(average(stages.map((stage) => stage.completionPercent))),
    0,
    100,
  );
  const blockers = stages.reduce((sum, stage) => sum + stage.blockingIssues.length, 0);
  const pendingApprovals = gates.reduce((sum, gate) => sum + gate.pendingApprovals.length, 0);

  const workflowHealthScore = computeWorkflowHealth({
    progress: progressPercentage,
    blockers,
    pendingApprovals,
    riskReadiness: inputs.participants.readiness.score,
    policyReadiness: inputs.policy.executiveSummary.policyReadiness,
    evidenceReadiness: inputs.evidence.readiness,
    legalReadiness: inputs.legalDocumentation.executiveSummary.overallLegalReadiness,
  });

  return {
    timeline,
    dependencyGraph: buildDependencyGraph(stages),
    estimatedCompletionDate: computeEstimatedCompletionDate(stages),
    criticalPath: computeCriticalPath(stages),
    nextRecommendedAction: buildNextRecommendedAction(stages, gates),
    workflowHealthScore,
    dealCompletionPercentage: progressPercentage,
    progressPercentage,
    overallWorkflowRisk: computeRiskLabel(workflowHealthScore),
  };
}

export const WorkflowEngine = {
  buildWorkflowAnalytics,
};
