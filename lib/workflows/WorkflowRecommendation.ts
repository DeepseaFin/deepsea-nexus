import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export enum WorkflowRecommendationPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export interface WorkflowRecommendation {
  readonly recommendationId: string;
  readonly workflowId: string;
  readonly executionId: string;
  readonly step: WorkflowStep;
  readonly priority: WorkflowRecommendationPriority;
  readonly title: string;
  readonly detail: string;
  readonly createdAt: string;
}
