import {
  buildWorkflowSignals,
  getStageCompletionMap,
  getStageDefinition,
  type OrchestrationInputs,
  type WorkflowStageStatus,
  WORKFLOW_STAGE_DEFINITIONS,
} from '@/atlas-core/orchestration/WorkflowRules';

export interface ApprovalGateResult {
  stageId: number;
  stageName: string;
  gateStatus: 'Open' | 'Passed' | 'Pending Approval' | 'Blocked' | 'Rejected';
  requiredApprovals: string[];
  pendingApprovals: string[];
  blockingIssues: string[];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function hasAnyKeyword(value: string, keywords: string[]): boolean {
  const normalized = normalize(value);
  return keywords.some((keyword) => normalized.includes(keyword));
}

function isDealRejected(inputs: OrchestrationInputs): boolean {
  const statuses = [
    inputs.deal.deal.status,
    inputs.deal.approval.status,
    inputs.creditMemo.executiveDecisionSummary.overallRecommendation,
    inputs.participants.recommendation,
    inputs.evidence.recommendation,
  ].join(' ');

  return hasAnyKeyword(statuses, ['reject', 'decline', 'do not proceed', 'cancel']);
}

function collectRuleBlockers(stageId: number, completed: Record<number, boolean>, inputs: OrchestrationInputs): string[] {
  const blockers: string[] = [];

  if (stageId === 10 && !completed[9]) {
    blockers.push('Legal Documentation cannot begin until Final Executable Term Sheet is approved.');
  }

  if ((stageId === 14 || stageId === 15) && !completed[12]) {
    blockers.push('Funding cannot begin until Legal Execution is complete.');
  }

  if (stageId === 16 && !completed[15]) {
    blockers.push('Settlement cannot begin until Treasury confirms liquidity.');
  }

  if (stageId === 18 && !completed[15]) {
    blockers.push('Collections cannot begin until funds have been disbursed.');
  }

  if (stageId === 19) {
    const zeroOutstanding = completed[19] || inputs.deal.tasks.some((task) => normalize(task.title).includes('zero outstanding'));
    const zeroClaims = completed[19] || inputs.deal.timeline.some((entry) => normalize(entry.description).includes('zero claims'));
    const zeroPendingCollections = completed[19] || inputs.deal.tasks.some((task) => normalize(task.title).includes('zero pending collections'));

    if (!zeroOutstanding) {
      blockers.push('Facility Close requires Zero Outstanding.');
    }

    if (!zeroClaims) {
      blockers.push('Facility Close requires Zero Claims.');
    }

    if (!zeroPendingCollections) {
      blockers.push('Facility Close requires Zero Pending Collections.');
    }
  }

  return blockers;
}

function collectPendingApprovals(
  stageId: number,
  requiredApprovals: string[],
  completed: Record<number, boolean>,
  inputs: OrchestrationInputs,
): string[] {
  if (requiredApprovals.length === 0 || completed[stageId]) {
    return [];
  }

  const approvalStatus = normalize(inputs.deal.approval.status);

  return requiredApprovals.filter((approval) => {
    const normalizedApproval = normalize(approval);
    if (approvalStatus.includes('approved') && approvalStatus.includes(normalizedApproval.split(' ')[0])) {
      return false;
    }

    if (stageId === 6 && inputs.creditMemo.executiveDecisionSummary.overallRecommendation !== 'Do Not Proceed') {
      return false;
    }

    if (stageId === 9 && completed[9]) {
      return false;
    }

    if (stageId === 12 && (inputs.finalTermSheet.executionStatus.current === 'Signed by Client' || inputs.finalTermSheet.executionStatus.current === 'Fully Executed')) {
      return false;
    }

    return true;
  });
}

function toGateStatus(args: {
  stageCompleted: boolean;
  rejected: boolean;
  blockers: string[];
  pendingApprovals: string[];
}): ApprovalGateResult['gateStatus'] {
  if (args.rejected) {
    return 'Rejected';
  }

  if (args.stageCompleted) {
    return 'Passed';
  }

  if (args.blockers.length > 0) {
    return 'Blocked';
  }

  if (args.pendingApprovals.length > 0) {
    return 'Pending Approval';
  }

  return 'Open';
}

export function evaluateApprovalGates(inputs: OrchestrationInputs): ApprovalGateResult[] {
  const signals = buildWorkflowSignals(inputs);
  const completed = getStageCompletionMap(signals);
  const rejected = isDealRejected(inputs);

  return WORKFLOW_STAGE_DEFINITIONS.map((stage) => {
    const dependencyBlockers = stage.dependencies
      .filter((dependencyId) => !completed[dependencyId])
      .map((dependencyId) => `Dependency incomplete: ${getStageDefinition(dependencyId).stageName}.`);

    const ruleBlockers = collectRuleBlockers(stage.stageId, completed, inputs);
    const stageBlockers = stage.stageId === 5
      ? inputs.participants.blockers.map((blocker) => blocker.message)
      : stage.stageId === 10 || stage.stageId === 11
        ? inputs.legalDocumentation.missingInformation
        : stage.stageId === 13
          ? inputs.finalTermSheet.conditionsPrecedent
              .filter((row) => row.status !== 'Satisfied' && row.status !== 'Waived')
              .map((row) => `Condition precedent pending: ${row.condition}`)
          : [];

    const blockers = [...dependencyBlockers, ...ruleBlockers, ...stageBlockers];
    const pendingApprovals = collectPendingApprovals(
      stage.stageId,
      stage.requiredApprovals,
      completed,
      inputs,
    );

    return {
      stageId: stage.stageId,
      stageName: stage.stageName,
      gateStatus: toGateStatus({
        stageCompleted: completed[stage.stageId],
        rejected,
        blockers,
        pendingApprovals,
      }),
      requiredApprovals: stage.requiredApprovals,
      pendingApprovals,
      blockingIssues: blockers,
    } satisfies ApprovalGateResult;
  });
}

export function gateStatusToStageStatus(status: ApprovalGateResult['gateStatus']): WorkflowStageStatus {
  if (status === 'Passed') return 'Completed';
  if (status === 'Pending Approval') return 'Pending Approval';
  if (status === 'Blocked') return 'Blocked';
  if (status === 'Rejected') return 'Rejected';
  return 'Waiting';
}

export const ApprovalGateEngine = {
  evaluateApprovalGates,
};
