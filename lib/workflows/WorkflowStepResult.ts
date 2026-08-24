import type { WorkflowStageResults } from "@/lib/workflows/WorkflowExecutionResult";
import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export enum WorkflowStepStatus {
  Pending = "pending",
  Running = "running",
  Completed = "completed",
  Failed = "failed",
  Skipped = "skipped",
}

export interface WorkflowStepResult {
  readonly workflowId: string;
  readonly executionId: string;
  readonly step: WorkflowStep;
  readonly status: WorkflowStepStatus;
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly outputs: Partial<WorkflowStageResults>;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}
