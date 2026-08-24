export type CustomerOnboardingStepId =
  | "institution_wizard"
  | "oracle"
  | "evidence"
  | "knowledge"
  | "business_passport"
  | "journey"
  | "institution_health"
  | "institution_intelligence";

export type CustomerOnboardingStepStatus = "pending" | "in_progress" | "completed" | "blocked";

export type CustomerOnboardingStatus = "in_progress" | "paused" | "completed";

export interface CustomerOnboardingStep {
  readonly id: CustomerOnboardingStepId;
  readonly title: string;
  readonly description: string;
  readonly owner: string;
  readonly status: CustomerOnboardingStepStatus;
}

export interface CustomerOnboardingTimelineItem {
  readonly id: string;
  readonly timestamp: string;
  readonly event: string;
  readonly actor: string;
  readonly detail: string;
}

export interface CustomerProcessingTask {
  readonly id: string;
  readonly title: string;
  readonly queue: string;
  readonly eta: string;
  readonly status: "queued" | "running" | "ready";
}

export interface CustomerRecommendation {
  readonly id: string;
  readonly priority: "high" | "medium" | "low";
  readonly title: string;
  readonly detail: string;
}

export interface CustomerOnboardingCompletion {
  readonly readinessScore: number;
  readonly nextHandoff: string;
  readonly checks: readonly string[];
}

export interface CustomerOnboardingState {
  readonly onboardingId: string;
  readonly customerName: string;
  readonly institutionName: string;
  readonly initiatedAt: string;
  readonly status: CustomerOnboardingStatus;
  readonly currentStepId: CustomerOnboardingStepId;
  readonly steps: readonly CustomerOnboardingStep[];
  readonly timeline: readonly CustomerOnboardingTimelineItem[];
  readonly processingTasks: readonly CustomerProcessingTask[];
  readonly recommendations: readonly CustomerRecommendation[];
  readonly completion: CustomerOnboardingCompletion;
}
