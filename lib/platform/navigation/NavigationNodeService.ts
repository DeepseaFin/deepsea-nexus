import type { NavigationNode } from "@/lib/platform/navigation/NavigationNode";
import type { NavigationNodeId } from "@/lib/platform/navigation/NavigationNodeId";
import type { NavigationNodeMetadata } from "@/lib/platform/navigation/NavigationNodeMetadata";
import type { NavigationNodeStatus } from "@/lib/platform/navigation/NavigationNodeStatus";
import type { NavigationNodeType } from "@/lib/platform/navigation/NavigationNodeType";

export interface CreateNavigationNodeInput {
  readonly navigationNodeId: NavigationNodeId;
  readonly capabilityId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly type: NavigationNodeType;
  readonly status: NavigationNodeStatus;
  readonly metadata: NavigationNodeMetadata;
}

export interface NavigationNodeService {
  create(input: CreateNavigationNodeInput): Promise<NavigationNode>;
  get(navigationNodeId: NavigationNodeId): Promise<NavigationNode | null>;
  listByCapabilityId(capabilityId: string): Promise<readonly NavigationNode[]>;
  listByWorkspaceId(workspaceId: string): Promise<readonly NavigationNode[]>;
  listByType(type: NavigationNodeType): Promise<readonly NavigationNode[]>;
  listByStatus(status: NavigationNodeStatus): Promise<readonly NavigationNode[]>;
}
