import type { WorkspaceCapability } from "@/lib/workspaces/WorkspaceCapability";
import type { WorkspaceAttributes } from "@/lib/workspaces/types";

export interface WorkspaceNavigationItem {
  readonly itemId: string;
  readonly label: string;
  readonly panelId: string;
  readonly order: number;
  readonly defaultItem?: boolean;
  readonly metadata?: WorkspaceAttributes;
}

export interface WorkspacePanel {
  readonly panelId: string;
  readonly title: string;
  readonly description?: string;
  readonly order: number;
  readonly requiredCapabilityIds: readonly string[];
  readonly dependsOnPanelIds: readonly string[];
  readonly metadata?: WorkspaceAttributes;
}

export interface WorkspaceDependency {
  readonly workspaceId: string;
  readonly required: boolean;
  readonly reason?: string;
  readonly metadata?: WorkspaceAttributes;
}

export interface WorkspaceManifest {
  readonly manifestId: string;
  readonly navigation: readonly WorkspaceNavigationItem[];
  readonly capabilities: readonly WorkspaceCapability[];
  readonly panels: readonly WorkspacePanel[];
  readonly dependencies: readonly WorkspaceDependency[];
  readonly metadata?: WorkspaceAttributes;
}
