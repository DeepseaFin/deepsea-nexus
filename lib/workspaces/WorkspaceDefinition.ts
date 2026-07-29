import type { WorkspaceAttributes, WorkspaceTag } from "@/lib/workspaces/types";

export enum WorkspaceCategory {
  Institutional = "institutional",
  Relationship = "relationship",
  Workflow = "workflow",
  Activity = "activity",
  Intelligence = "intelligence",
  Operations = "operations",
  Custom = "custom",
}

export enum WorkspaceVisibility {
  Internal = "internal",
  Restricted = "restricted",
  External = "external",
}

export interface WorkspaceDefinition {
  readonly workspaceId: string;
  readonly name: string;
  readonly displayName: string;
  readonly description?: string;
  readonly category: WorkspaceCategory;
  readonly visibility: WorkspaceVisibility;
  readonly version: string;
  readonly owner?: string;
  readonly tags: readonly WorkspaceTag[];
  readonly metadata?: WorkspaceAttributes;
}
