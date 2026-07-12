export interface WorkspaceAction {
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  badge?: string;
}

export interface WorkspaceTask {
  label: string;
  value?: string;
  detail?: string;
  status?: string;
  icon?: string;
}

export interface RelationshipCardViewModel {
  companyName: string;
  businessIntelligenceScore?: string;
  fundingGoal?: string;
  status?: string;
  nextBestAction?: string;
  lastActivity?: string;
}

export interface BusinessWorkspaceViewModel {
  greeting: string;
  title: string;
  subtitle: string;
  businessProfile: {
    companyName: string;
    documentType: string;
    jurisdiction: string;
  };
  fundingReadiness: {
    fundingGoal?: string;
    progressLabel: string;
    progressValue: number;
    completedItems: string[];
    pendingItems: string[];
    guidance: string;
  };
  documents: {
    title: string;
    description?: string;
  };
  relationshipTimeline: {
    heading: string;
    events: Array<{
      title: string;
      description: string;
      status?: string;
    }>;
  };
  aiAdvisor: {
    title: string;
    narrative: string;
  };
  actions?: WorkspaceAction[];
  tasks?: WorkspaceTask[];
  relationshipCard?: RelationshipCardViewModel;
}
