import type { WorkspaceId } from "@/lib/platform/workspace/WorkspaceId";
import type { WorkspaceCompositionId } from "@/lib/platform/composition/WorkspaceCompositionId";
import type { WorkspaceCompositionMetadata } from "@/lib/platform/composition/WorkspaceCompositionMetadata";
import type { WorkspaceCompositionStatus } from "@/lib/platform/composition/WorkspaceCompositionStatus";
import type { WorkspaceCompositionType } from "@/lib/platform/composition/WorkspaceCompositionType";

export interface WorkspaceComposition {
  readonly compositionId: WorkspaceCompositionId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly description: string;
  readonly type: WorkspaceCompositionType;
  readonly status: WorkspaceCompositionStatus;
  readonly version: string;
  readonly metadata: WorkspaceCompositionMetadata;
}
