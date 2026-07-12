import type { WorkspaceAction } from "@/lib/workspaces/businessWorkspaceViewModel";

export interface ExecutiveWorkspaceViewModel {
  greeting: string;
  title: string;
  executiveBrief: string;
  kpis: Array<{
    label: string;
    value: string;
    detail?: string;
  }>;
  aiChiefOfStaff: {
    title: string;
    narrative: string;
  };
  todayPriority: {
    title: string;
    detail: string;
  };
  actions: WorkspaceAction[];
}
