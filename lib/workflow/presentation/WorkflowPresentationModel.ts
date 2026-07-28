export interface WorkflowPresentationFormatOptions {
  readonly locale?: string;
  readonly timeZone?: string;
  readonly now?: string;
}

export interface WorkflowStagePresentationModel {
  readonly currentStageKey: string;
  readonly currentStageLabel: string;
  readonly currentStageTone: "neutral" | "info" | "success" | "warning" | "danger";
  readonly previousStageKey?: string;
  readonly previousStageLabel?: string;
  readonly updatedAtIso: string;
  readonly updatedAtDisplay: string;
  readonly completedAtIso?: string;
  readonly completedAtDisplay?: string;
  readonly cancelledAtIso?: string;
  readonly cancelledAtDisplay?: string;
  readonly nextTransitions: readonly WorkflowStageTransitionPresentationModel[];
}

export interface WorkflowStageTransitionPresentationModel {
  readonly transitionId: string;
  readonly toStageKey: string;
  readonly toStageLabel: string;
  readonly requirementSummary: string;
  readonly conditionCountLabel: string;
}

export interface WorkflowTaskPresentationModel {
  readonly taskId: string;
  readonly title: string;
  readonly description?: string;
  readonly stageLabel: string;
  readonly statusLabel: string;
  readonly statusTone: "neutral" | "info" | "success" | "warning" | "danger";
  readonly priorityLabel: string;
  readonly priorityTone: "neutral" | "info" | "success" | "warning" | "danger";
  readonly assignmentLabel: string;
  readonly dueAtIso?: string;
  readonly dueAtDisplay?: string;
  readonly startedAtIso?: string;
  readonly startedAtDisplay?: string;
  readonly completedAtIso?: string;
  readonly completedAtDisplay?: string;
}

export interface WorkflowTimelinePresentationModel {
  readonly eventId: string;
  readonly typeLabel: string;
  readonly occurredAtIso: string;
  readonly occurredAtDisplay: string;
  readonly actorLabel: string;
  readonly message: string;
  readonly stageChangeLabel?: string;
  readonly taskId?: string;
  readonly milestoneId?: string;
  readonly assignmentId?: string;
}

export interface WorkflowSummaryMetricPresentationModel {
  readonly metricKey: string;
  readonly label: string;
  readonly value: string;
  readonly tone: "neutral" | "info" | "success" | "warning" | "danger";
}

export interface WorkflowSummaryPresentationModel {
  readonly completionPercent: number;
  readonly completionPercentLabel: string;
  readonly openTaskPercent: number;
  readonly openTaskPercentLabel: string;
  readonly totalTasksLabel: string;
  readonly totalMilestonesLabel: string;
  readonly terminalLabel: string;
  readonly metrics: readonly WorkflowSummaryMetricPresentationModel[];
}

export interface WorkflowPresentationModel {
  readonly generatedAtIso: string;
  readonly generatedAtDisplay: string;
  readonly workflowId: string;
  readonly title: string;
  readonly subtitle: string;
  readonly revisionLabel: string;
  readonly stage: WorkflowStagePresentationModel;
  readonly summary: WorkflowSummaryPresentationModel;
  readonly tasks: readonly WorkflowTaskPresentationModel[];
  readonly timeline: readonly WorkflowTimelinePresentationModel[];
  readonly milestoneCountLabel: string;
  readonly assignmentCountLabel: string;
  readonly validationWarnings: readonly string[];
}
