import type { WorkspaceAttributes } from "@/lib/workspaces/types";

export enum WorkspaceCapabilityType {
  Dashboard = "dashboard",
  Timeline = "timeline",
  Workflow = "workflow",
  Activity = "activity",
  Documents = "documents",
  Evidence = "evidence",
  Knowledge = "knowledge",
  Actions = "actions",
  Intelligence = "intelligence",
  Custom = "custom",
}

export interface WorkspaceCapability {
  readonly capabilityId: string;
  readonly type: WorkspaceCapabilityType;
  readonly label: string;
  readonly description?: string;
  readonly enabled: boolean;
  readonly required: boolean;
  readonly metadata?: WorkspaceAttributes;
}
