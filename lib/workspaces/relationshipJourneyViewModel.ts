import type { WorkspaceAction } from "@/lib/workspaces/businessWorkspaceViewModel";

export interface RelationshipJourneyViewModel {
  welcomeMessage: string;
  businessSummary: {
    companyName: string;
    documentType: string;
    jurisdiction: string;
  };
  intelligenceScore: string;
  fundingGoal: string;
  estimatedResponseTime: string;
  assignedRelationshipManager?: string;
  nextSteps: string[];
  timeline: Array<{
    title: string;
    description: string;
    state: "complete" | "current" | "upcoming";
  }>;
  actions: WorkspaceAction[];
}
