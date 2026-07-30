export type WorkspaceCompletionStatus = "not_started" | "in_progress" | "completed";

export interface WorkspaceSectionDefinition<TSectionId extends string> {
  readonly id: TSectionId;
  readonly title: string;
  readonly description: string;
  readonly order: number;
  readonly workflowOrder?: number;
  readonly enabled: boolean;
  readonly navigationVisible: boolean;
  readonly prerequisites?: readonly TSectionId[];
  readonly recommended?: boolean;
}

export interface WorkspaceSectionStateLike<TSectionId extends string> {
  readonly id: TSectionId;
  readonly completionStatus: WorkspaceCompletionStatus;
  readonly disabled?: boolean;
}

export interface WorkspaceWorkflowEvaluation<TSectionId extends string> {
  readonly availableSections: readonly TSectionId[];
  readonly blockedSections: readonly TSectionId[];
  readonly completedSections: readonly TSectionId[];
  readonly nextRecommendedSection: TSectionId | null;
}

export type WorkspaceFilters = Readonly<Record<string, string | number | boolean | readonly string[]>>;

export interface WorkspacePersistenceSnapshot<TSectionId extends string, TFilters> {
  readonly activeSection: TSectionId | null;
  readonly expandedSections: Readonly<Record<TSectionId, boolean>>;
  readonly selectedTab: string;
  readonly filters: TFilters;
  readonly lastVisitedAt: string | null;
}
