import type { RelationshipWorkspaceProjection } from "@/src/capabilities/relationship/projections/RelationshipWorkspaceProjection";
import type { RelationshipInteractionProjection } from "@/src/capabilities/relationship/projections/RelationshipInteractionProjection";

export interface RelationshipHealthModel {
  readonly score: string;
  readonly status: string;
  readonly confidence: string;
  readonly trend: string;
  readonly lastUpdated: string;
}

export interface RelationshipSummaryModel {
  readonly relationship: RelationshipWorkspaceProjection["relationship"];
  readonly contactCount: string;
  readonly interactionCount: string;
  readonly primaryContactName?: string;
}

export interface RelationshipNextAction {
  readonly id: string;
  readonly title: string;
  readonly priority: "low" | "medium" | "high";
  readonly owner: string;
  readonly dueDate: string;
  readonly status: string;
}

export interface RelationshipInsightRecommendation {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly category?: string;
  readonly confidence?: string;
}

export interface RelationshipPanelConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly workspaceLabel: string;
  readonly healthTitle: string;
  readonly healthSubtitle: string;
  readonly summaryTitle: string;
  readonly summarySubtitle: string;
  readonly timelineTitle: string;
  readonly timelineSubtitle: string;
  readonly insightsTitle: string;
  readonly insightsSubtitle: string;
  readonly nextActionsTitle: string;
  readonly nextActionsSubtitle: string;
}

export interface RelationshipPanelModel {
  readonly health: RelationshipHealthModel;
  readonly summary: RelationshipSummaryModel;
  readonly timeline: readonly RelationshipInteractionProjection[];
  readonly insights: readonly RelationshipInsightRecommendation[];
  readonly nextActions: readonly RelationshipNextAction[];
}
