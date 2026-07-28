import type { Workflow } from "@/lib/workflow/Workflow";
import { isWorkflowTerminal } from "@/lib/workflow/Workflow";
import { WorkflowMilestoneStatus } from "@/lib/workflow/WorkflowMilestone";
import { WorkflowTaskStatus } from "@/lib/workflow/WorkflowTask";
import type { WorkflowSummaryViewModel } from "@/lib/workflow/application/WorkflowViewModel";

export interface WorkflowSummaryAssembler {
  assemble(workflow: Workflow): WorkflowSummaryViewModel;
}

function percent(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

export function createWorkflowSummaryAssembler(): WorkflowSummaryAssembler {
  return {
    assemble(workflow: Workflow): WorkflowSummaryViewModel {
      const pendingTasks = workflow.tasks.filter((task) => task.status === WorkflowTaskStatus.Pending).length;
      const inProgressTasks = workflow.tasks.filter((task) => task.status === WorkflowTaskStatus.InProgress).length;
      const blockedTasks = workflow.tasks.filter((task) => task.status === WorkflowTaskStatus.Blocked).length;
      const completedTasks = workflow.tasks.filter((task) => task.status === WorkflowTaskStatus.Completed).length;
      const cancelledTasks = workflow.tasks.filter((task) => task.status === WorkflowTaskStatus.Cancelled).length;

      const achievedMilestones = workflow.milestones.filter(
        (milestone) => milestone.status === WorkflowMilestoneStatus.Achieved,
      ).length;
      const overdueMilestones = workflow.milestones.filter(
        (milestone) => milestone.status === WorkflowMilestoneStatus.Overdue,
      ).length;

      const totalTasks = workflow.tasks.length;
      const totalMilestones = workflow.milestones.length;
      const openTasks = pendingTasks + inProgressTasks + blockedTasks;

      return {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        blockedTasks,
        completedTasks,
        cancelledTasks,
        totalMilestones,
        achievedMilestones,
        overdueMilestones,
        completionPercent: percent(completedTasks + cancelledTasks, totalTasks),
        openTaskPercent: percent(openTasks, totalTasks),
        isTerminal: isWorkflowTerminal(workflow),
        lastUpdatedAt: workflow.updatedAt,
      };
    },
  };
}
