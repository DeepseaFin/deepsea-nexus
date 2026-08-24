import type { CustomerLifecycleOrchestrationModel } from "@/lib/application/CustomerLifecycleOrchestrator";
import type { OnboardingProgressModel } from "@/lib/application/OnboardingProgress";
import type {
  RelationshipManagerWorkbenchModel,
  RelationshipManagerWorkItem,
} from "@/lib/application/RelationshipManagerWorkbench";
import type { NextBestActionModel, WorkflowPriority } from "@/lib/customer/workflow/workflow.types";

export interface OnboardingWorkflowTask {
  readonly id: string;
  readonly title: string;
  readonly priority: WorkflowPriority;
  readonly context: string;
  readonly action: NextBestActionModel;
  readonly blocked: boolean;
}

export interface OnboardingWorkflowModel {
  readonly completionPercentage: number;
  readonly currentLifecycleStage: CustomerLifecycleOrchestrationModel["phase"];
  readonly fundingReadiness: string;
  readonly blockers: readonly OnboardingWorkflowTask[];
  readonly informationalItems: readonly OnboardingWorkflowTask[];
  readonly highestPriorityTask: NextBestActionModel | null;
}

export interface OnboardingWorkflowSource {
  readonly lifecycle: CustomerLifecycleOrchestrationModel;
  readonly onboardingProgress: OnboardingProgressModel;
  readonly workbench: RelationshipManagerWorkbenchModel;
}

const priorityWeight: Readonly<Record<WorkflowPriority, number>> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function isBlockingItem(item: RelationshipManagerWorkItem): boolean {
  if (item.sourceType !== "lifecycle") {
    return false;
  }

  return item.dueStatus === "overdue" || item.dueStatus === "due-soon";
}

function toTask(item: RelationshipManagerWorkItem, blocked: boolean): OnboardingWorkflowTask {
  return {
    id: item.id,
    title: item.action.title,
    priority: item.priority,
    context: item.context,
    action: item.action,
    blocked,
  };
}

function sortTasks(tasks: readonly OnboardingWorkflowTask[]): readonly OnboardingWorkflowTask[] {
  return [...tasks].sort((left, right) => {
    const priorityDelta = priorityWeight[right.priority] - priorityWeight[left.priority];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return left.id.localeCompare(right.id);
  });
}

export function composeOnboardingWorkflow(source: OnboardingWorkflowSource): OnboardingWorkflowModel {
  const blockers = sortTasks(
    source.workbench.items
      .filter((item) => isBlockingItem(item))
      .map((item) => toTask(item, true)),
  );

  const informationalItems = sortTasks(
    source.workbench.items
      .filter((item) => !isBlockingItem(item))
      .map((item) => toTask(item, false)),
  );

  const highestPriorityTask =
    blockers[0]?.action ??
    source.onboardingProgress.recommendedAction ??
    source.workbench.recommendedWorkItem?.action ??
    null;

  return {
    completionPercentage: source.onboardingProgress.overallCompletionPercent,
    currentLifecycleStage: source.lifecycle.phase,
    fundingReadiness: source.lifecycle.funding.readiness ?? source.lifecycle.funding.state,
    blockers,
    informationalItems,
    highestPriorityTask,
  };
}
