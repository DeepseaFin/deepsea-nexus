import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export enum WorkflowRunState {
  Pending = "pending",
  Running = "running",
  Completed = "completed",
  Failed = "failed",
}

export interface WorkflowExecutionState {
  readonly workflowId: string;
  readonly executionId: string;
  readonly runState: WorkflowRunState;
  readonly currentStep: WorkflowStep;
  readonly completedSteps: readonly WorkflowStep[];
  readonly pendingSteps: readonly WorkflowStep[];
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly lastEventAt: string | null;
}
