import type { WorkflowSummaryViewModel, WorkflowViewModel } from "@/lib/workflow/application/WorkflowViewModel";
import type {
  WorkflowPresentationFormatOptions,
  WorkflowSummaryMetricPresentationModel,
  WorkflowSummaryPresentationModel,
} from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowSummaryPresenter {
  present(viewModel: WorkflowViewModel, options?: WorkflowPresentationFormatOptions): WorkflowSummaryPresentationModel;
}

function percentLabel(value: number): string {
  return `${value}%`;
}

function metric(
  metricKey: string,
  label: string,
  value: number,
  tone: "neutral" | "info" | "success" | "warning" | "danger",
): WorkflowSummaryMetricPresentationModel {
  return {
    metricKey,
    label,
    value: `${value}`,
    tone,
  };
}

function summaryMetrics(summary: WorkflowSummaryViewModel): readonly WorkflowSummaryMetricPresentationModel[] {
  return [
    metric("pendingTasks", "Pending Tasks", summary.pendingTasks, "neutral"),
    metric("inProgressTasks", "In Progress Tasks", summary.inProgressTasks, "info"),
    metric("blockedTasks", "Blocked Tasks", summary.blockedTasks, summary.blockedTasks > 0 ? "warning" : "success"),
    metric("completedTasks", "Completed Tasks", summary.completedTasks, "success"),
    metric("cancelledTasks", "Cancelled Tasks", summary.cancelledTasks, summary.cancelledTasks > 0 ? "danger" : "neutral"),
    metric("achievedMilestones", "Achieved Milestones", summary.achievedMilestones, "success"),
    metric("overdueMilestones", "Overdue Milestones", summary.overdueMilestones, summary.overdueMilestones > 0 ? "warning" : "neutral"),
  ];
}

export function createWorkflowSummaryPresenter(): WorkflowSummaryPresenter {
  return {
    present(viewModel: WorkflowViewModel): WorkflowSummaryPresentationModel {
      const summary = viewModel.summary;
      return {
        completionPercent: summary.completionPercent,
        completionPercentLabel: percentLabel(summary.completionPercent),
        openTaskPercent: summary.openTaskPercent,
        openTaskPercentLabel: percentLabel(summary.openTaskPercent),
        totalTasksLabel: `${summary.totalTasks} total task(s)`,
        totalMilestonesLabel: `${summary.totalMilestones} total milestone(s)`,
        terminalLabel: summary.isTerminal ? "Terminal" : "Active",
        metrics: summaryMetrics(summary),
      };
    },
  };
}
