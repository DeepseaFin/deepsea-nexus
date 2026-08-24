import type { NavigationNodeId } from "@/lib/platform/navigation/NavigationNodeId";
import type { NavigationNodeMetadata } from "@/lib/platform/navigation/NavigationNodeMetadata";
import type { NavigationNodeStatus } from "@/lib/platform/navigation/NavigationNodeStatus";
import type { NavigationNodeType } from "@/lib/platform/navigation/NavigationNodeType";

export interface NavigationNode {
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
