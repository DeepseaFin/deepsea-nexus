import { WorkspaceCategory, WorkspaceVisibility } from "@/lib/workspaces/WorkspaceDefinition";
import { WorkspaceCapabilityType } from "@/lib/workspaces/WorkspaceCapability";

export const WORKSPACE_CATEGORIES = [
  WorkspaceCategory.Institutional,
  WorkspaceCategory.Relationship,
  WorkspaceCategory.Workflow,
  WorkspaceCategory.Activity,
  WorkspaceCategory.Intelligence,
  WorkspaceCategory.Operations,
  WorkspaceCategory.Custom,
] as const;

export const WORKSPACE_VISIBILITIES = [
  WorkspaceVisibility.Internal,
  WorkspaceVisibility.Restricted,
  WorkspaceVisibility.External,
] as const;

export const WORKSPACE_CAPABILITY_TYPES = [
  WorkspaceCapabilityType.Dashboard,
  WorkspaceCapabilityType.Timeline,
  WorkspaceCapabilityType.Workflow,
  WorkspaceCapabilityType.Activity,
  WorkspaceCapabilityType.Documents,
  WorkspaceCapabilityType.Evidence,
  WorkspaceCapabilityType.Knowledge,
  WorkspaceCapabilityType.Actions,
  WorkspaceCapabilityType.Intelligence,
  WorkspaceCapabilityType.Custom,
] as const;

export const WORKSPACE_CATEGORY_LABELS: Readonly<Record<WorkspaceCategory, string>> = {
  [WorkspaceCategory.Institutional]: "Institutional",
  [WorkspaceCategory.Relationship]: "Relationship",
  [WorkspaceCategory.Workflow]: "Workflow",
  [WorkspaceCategory.Activity]: "Activity",
  [WorkspaceCategory.Intelligence]: "Intelligence",
  [WorkspaceCategory.Operations]: "Operations",
  [WorkspaceCategory.Custom]: "Custom",
};

export const WORKSPACE_VISIBILITY_LABELS: Readonly<Record<WorkspaceVisibility, string>> = {
  [WorkspaceVisibility.Internal]: "Internal",
  [WorkspaceVisibility.Restricted]: "Restricted",
  [WorkspaceVisibility.External]: "External",
};

export const WORKSPACE_CAPABILITY_LABELS: Readonly<Record<WorkspaceCapabilityType, string>> = {
  [WorkspaceCapabilityType.Dashboard]: "Dashboard",
  [WorkspaceCapabilityType.Timeline]: "Timeline",
  [WorkspaceCapabilityType.Workflow]: "Workflow",
  [WorkspaceCapabilityType.Activity]: "Activity",
  [WorkspaceCapabilityType.Documents]: "Documents",
  [WorkspaceCapabilityType.Evidence]: "Evidence",
  [WorkspaceCapabilityType.Knowledge]: "Knowledge",
  [WorkspaceCapabilityType.Actions]: "Actions",
  [WorkspaceCapabilityType.Intelligence]: "Intelligence",
  [WorkspaceCapabilityType.Custom]: "Custom",
};
