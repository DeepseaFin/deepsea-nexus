import type { Workspace } from "@/lib/workspaces/Workspace";
import type { WorkspaceRevision, WorkspaceTimestamp } from "@/lib/workspaces/types";

export interface WorkspaceRegistry {
  readonly registryId: string;
  readonly workspaces: readonly Workspace[];
  readonly revision: WorkspaceRevision;
  readonly createdAt: WorkspaceTimestamp;
  readonly updatedAt: WorkspaceTimestamp;
}

export interface WorkspaceRegistryInput {
  readonly registryId: string;
  readonly workspaces?: readonly Workspace[];
  readonly revision?: WorkspaceRevision;
  readonly createdAt?: WorkspaceTimestamp;
  readonly updatedAt?: WorkspaceTimestamp;
}

function copyWorkspaces(workspaces: readonly Workspace[] | undefined): readonly Workspace[] {
  return [...(workspaces ?? [])];
}

export function createWorkspaceRegistry(input: WorkspaceRegistryInput): WorkspaceRegistry {
  const createdAt = input.createdAt ?? input.updatedAt ?? new Date().toISOString();
  const updatedAt = input.updatedAt ?? createdAt;

  return {
    registryId: input.registryId,
    workspaces: copyWorkspaces(input.workspaces),
    revision: input.revision ?? 0,
    createdAt,
    updatedAt,
  };
}
