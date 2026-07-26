import type { WorkflowAssignment } from "@/lib/workflow/WorkflowAssignment";
import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import type { WorkflowEvent } from "@/lib/workflow/WorkflowEvent";
import type { WorkflowMilestone } from "@/lib/workflow/WorkflowMilestone";
import type { WorkflowMetadata, WorkflowRevision, WorkflowTimestamp } from "@/lib/workflow/types";
import type { WorkflowPolicy } from "@/lib/workflow/WorkflowPolicy";
import type { WorkflowTask } from "@/lib/workflow/WorkflowTask";

export interface Workflow {
  readonly workflowId: string;
  readonly name: string;
  readonly description?: string;
  readonly currentStage: WorkflowStage;
  readonly previousStage?: WorkflowStage;
  readonly revision: WorkflowRevision;
  readonly tasks: readonly WorkflowTask[];
  readonly assignments: readonly WorkflowAssignment[];
  readonly milestones: readonly WorkflowMilestone[];
  readonly events: readonly WorkflowEvent[];
  readonly policy: WorkflowPolicy;
  readonly metadata?: WorkflowMetadata;
  readonly createdAt: WorkflowTimestamp;
  readonly updatedAt: WorkflowTimestamp;
  readonly completedAt?: WorkflowTimestamp;
  readonly cancelledAt?: WorkflowTimestamp;
}

export interface WorkflowInput {
  readonly workflowId: string;
  readonly name: string;
  readonly description?: string;
  readonly currentStage?: WorkflowStage;
  readonly previousStage?: WorkflowStage;
  readonly revision?: WorkflowRevision;
  readonly tasks?: readonly WorkflowTask[];
  readonly assignments?: readonly WorkflowAssignment[];
  readonly milestones?: readonly WorkflowMilestone[];
  readonly events?: readonly WorkflowEvent[];
  readonly policy: WorkflowPolicy;
  readonly metadata?: WorkflowMetadata;
  readonly createdAt?: WorkflowTimestamp;
  readonly updatedAt?: WorkflowTimestamp;
  readonly completedAt?: WorkflowTimestamp;
  readonly cancelledAt?: WorkflowTimestamp;
}

function copyList<T>(items: readonly T[] | undefined): readonly T[] {
  return [...(items ?? [])];
}

export function createWorkflow(input: WorkflowInput): Workflow {
  const createdAt = input.createdAt ?? input.updatedAt ?? new Date().toISOString();
  const updatedAt = input.updatedAt ?? createdAt;

  return {
    workflowId: input.workflowId,
    name: input.name,
    description: input.description,
    currentStage: input.currentStage ?? WorkflowStage.Draft,
    previousStage: input.previousStage,
    revision: input.revision ?? 0,
    tasks: copyList(input.tasks),
    assignments: copyList(input.assignments),
    milestones: copyList(input.milestones),
    events: copyList(input.events),
    policy: input.policy,
    metadata: input.metadata,
    createdAt,
    updatedAt,
    completedAt: input.completedAt,
    cancelledAt: input.cancelledAt,
  };
}

export function isWorkflowTerminal(workflow: Workflow): boolean {
  return workflow.currentStage === WorkflowStage.Completed || workflow.currentStage === WorkflowStage.Cancelled;
}

export function getWorkflowOpenTaskCount(workflow: Workflow): number {
  return workflow.tasks.filter((task) => task.status !== "completed" && task.status !== "cancelled").length;
}
