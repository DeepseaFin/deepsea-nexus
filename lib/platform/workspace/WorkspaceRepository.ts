import type { Workspace } from "@/lib/platform/workspace/Workspace";
import type { WorkspaceId } from "@/lib/platform/workspace/WorkspaceId";
import type { WorkspaceStatus } from "@/lib/platform/workspace/WorkspaceStatus";
import type { WorkspaceType } from "@/lib/platform/workspace/WorkspaceType";

export interface WorkspaceRepository {
  findById(workspaceId: WorkspaceId): Promise<Workspace | null>;
  save(workspace: Workspace): Promise<void>;
  listByCapabilityId(capabilityId: string): Promise<readonly Workspace[]>;
  listByType(type: WorkspaceType): Promise<readonly Workspace[]>;
  listByStatus(status: WorkspaceStatus): Promise<readonly Workspace[]>;
}
