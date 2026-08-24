import { WORKFLOW_STAGE_LABELS } from "@/lib/workflow/constants";
import type { Workflow } from "@/lib/workflow/Workflow";
import { WorkflowEventType, type WorkflowEvent } from "@/lib/workflow/WorkflowEvent";
import type { WorkflowTimelineEntryViewModel } from "@/lib/workflow/application/WorkflowViewModel";

export interface WorkflowTimelineAssembler {
  assemble(workflow: Workflow): readonly WorkflowTimelineEntryViewModel[];
}

function toLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (fragment) => fragment.toUpperCase());
}

function eventTypeLabel(type: WorkflowEventType): string {
  return toLabel(type);
}

function compareChronological(left: WorkflowEvent, right: WorkflowEvent): number {
  const leftAt = Date.parse(left.occurredAt);
  const rightAt = Date.parse(right.occurredAt);

  if (Number.isNaN(leftAt) || Number.isNaN(rightAt)) {
    return left.eventId.localeCompare(right.eventId);
  }

  return leftAt - rightAt;
}

export function createWorkflowTimelineAssembler(): WorkflowTimelineAssembler {
  return {
    assemble(workflow: Workflow): readonly WorkflowTimelineEntryViewModel[] {
      const events = [...workflow.events].sort(compareChronological);

      return events.map((event) => ({
        eventId: event.eventId,
        type: event.type,
        typeLabel: eventTypeLabel(event.type),
        occurredAt: event.occurredAt,
        actorId: event.actorId,
        message: event.message,
        fromStage: event.fromStage,
        toStage: event.toStage,
        fromStageLabel: event.fromStage ? WORKFLOW_STAGE_LABELS[event.fromStage] : undefined,
        toStageLabel: event.toStage ? WORKFLOW_STAGE_LABELS[event.toStage] : undefined,
        taskId: event.taskId,
        milestoneId: event.milestoneId,
        assignmentId: event.assignmentId,
      }));
    },
  };
}
