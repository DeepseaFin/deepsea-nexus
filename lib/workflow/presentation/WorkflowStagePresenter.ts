import type { WorkflowViewModel } from "@/lib/workflow/application/WorkflowViewModel";
import type {
  WorkflowPresentationFormatOptions,
  WorkflowStagePresentationModel,
  WorkflowStageTransitionPresentationModel,
} from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowStagePresenter {
  present(viewModel: WorkflowViewModel, options?: WorkflowPresentationFormatOptions): WorkflowStagePresentationModel;
}

function formatTimestamp(value: string | undefined, options?: WorkflowPresentationFormatOptions): string | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat(options?.locale ?? "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: options?.timeZone,
  }).format(new Date(parsed));
}

function stageTone(stageKey: string): "neutral" | "info" | "success" | "warning" | "danger" {
  if (stageKey === "completed") {
    return "success";
  }

  if (stageKey === "cancelled") {
    return "danger";
  }

  if (stageKey === "approval" || stageKey === "review") {
    return "warning";
  }

  if (stageKey === "execution" || stageKey === "assessment") {
    return "info";
  }

  return "neutral";
}

function buildRequirementSummary(requiredTaskIds: readonly string[], requiredMilestoneIds: readonly string[]): string {
  const taskCount = requiredTaskIds.length;
  const milestoneCount = requiredMilestoneIds.length;

  if (taskCount === 0 && milestoneCount === 0) {
    return "No prerequisites";
  }

  if (taskCount > 0 && milestoneCount > 0) {
    return `${taskCount} task prerequisite(s), ${milestoneCount} milestone prerequisite(s)`;
  }

  if (taskCount > 0) {
    return `${taskCount} task prerequisite(s)`;
  }

  return `${milestoneCount} milestone prerequisite(s)`;
}

function mapTransition(transition: WorkflowViewModel["availableTransitions"][number]): WorkflowStageTransitionPresentationModel {
  return {
    transitionId: transition.transitionId,
    toStageKey: transition.toStage,
    toStageLabel: transition.toStageLabel,
    requirementSummary: buildRequirementSummary(transition.requiredTaskIds, transition.requiredMilestoneIds),
    conditionCountLabel: `${transition.conditionCount} condition(s)`,
  };
}

export function createWorkflowStagePresenter(): WorkflowStagePresenter {
  return {
    present(viewModel: WorkflowViewModel, options?: WorkflowPresentationFormatOptions): WorkflowStagePresentationModel {
      return {
        currentStageKey: viewModel.currentStage,
        currentStageLabel: viewModel.currentStageLabel,
        currentStageTone: stageTone(viewModel.currentStage),
        previousStageKey: viewModel.previousStage,
        previousStageLabel: viewModel.previousStageLabel,
        updatedAtIso: viewModel.updatedAt,
        updatedAtDisplay: formatTimestamp(viewModel.updatedAt, options) ?? viewModel.updatedAt,
        completedAtIso: viewModel.completedAt,
        completedAtDisplay: formatTimestamp(viewModel.completedAt, options),
        cancelledAtIso: viewModel.cancelledAt,
        cancelledAtDisplay: formatTimestamp(viewModel.cancelledAt, options),
        nextTransitions: viewModel.availableTransitions.map(mapTransition),
      };
    },
  };
}
