import type { WorkflowExecutionState } from "@/lib/workflows/WorkflowExecutionState";
import type { WorkflowRecommendation } from "@/lib/workflows/WorkflowRecommendation";
import type { WorkflowStageResults } from "@/lib/workflows/WorkflowExecutionResult";
import type { WorkflowStepResult } from "@/lib/workflows/WorkflowStepResult";
import type { WorkflowTimeline } from "@/lib/workflows/WorkflowTimeline";

export interface WorkflowExecution {
  readonly workflowId: string;
  readonly executionId: string;
  readonly state: WorkflowExecutionState;
  readonly timeline: WorkflowTimeline;
  readonly stepResults: readonly WorkflowStepResult[];
  readonly stageResults: WorkflowStageResults;
  readonly recommendations: readonly WorkflowRecommendation[];
}
