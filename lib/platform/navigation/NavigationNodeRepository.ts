import type { NavigationNode } from "@/lib/platform/navigation/NavigationNode";
import type { NavigationNodeId } from "@/lib/platform/navigation/NavigationNodeId";
import type { NavigationNodeStatus } from "@/lib/platform/navigation/NavigationNodeStatus";
import type { NavigationNodeType } from "@/lib/platform/navigation/NavigationNodeType";

export interface NavigationNodeRepository {
  findById(navigationNodeId: NavigationNodeId): Promise<NavigationNode | null>;
  save(navigationNode: NavigationNode): Promise<void>;
  listByCapabilityId(capabilityId: string): Promise<readonly NavigationNode[]>;
  listByWorkspaceId(workspaceId: string): Promise<readonly NavigationNode[]>;
  listByType(type: NavigationNodeType): Promise<readonly NavigationNode[]>;
  listByStatus(status: NavigationNodeStatus): Promise<readonly NavigationNode[]>;
}
