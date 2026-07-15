import type { WorkflowRunState } from "@/lib/workflows/WorkflowExecutionState";
import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export interface WorkflowSummary {
  readonly workflowId: string;
  readonly executionId: string;
  readonly state: WorkflowRunState;
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly completedSteps: readonly WorkflowStep[];
  readonly pendingSteps: readonly WorkflowStep[];
  readonly warningCount: number;
  readonly errorCount: number;
}
