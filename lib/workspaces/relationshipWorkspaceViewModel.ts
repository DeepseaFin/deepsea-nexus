import type { RelationshipCardViewModel, WorkspaceAction, WorkspaceTask } from "@/lib/workspaces/businessWorkspaceViewModel";

export interface RelationshipWorkspaceViewModel {
  greeting: string;
  title: string;
  subtitle: string;
  portfolioSummary: {
    activeClients: number;
    awaitingFirstContact: number;
    meetingsToday: number;
    fundingPipeline: string;
    todaysPriority: string;
  };
  relationshipCard: RelationshipCardViewModel;
  aiRelationshipCoach: {
    title: string;
    narrative: string;
  };
  taskPanel: {
    title: string;
    tasks: WorkspaceTask[];
  };
  actions?: WorkspaceAction[];
}
