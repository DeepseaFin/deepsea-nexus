import type { WorkspaceId } from "@/lib/platform/workspace/WorkspaceId";
import type { WorkspaceComposition } from "@/lib/platform/composition/WorkspaceComposition";
import type { WorkspaceCompositionId } from "@/lib/platform/composition/WorkspaceCompositionId";
import type { WorkspaceCompositionStatus } from "@/lib/platform/composition/WorkspaceCompositionStatus";
import type { WorkspaceCompositionType } from "@/lib/platform/composition/WorkspaceCompositionType";

export interface WorkspaceCompositionRepository {
  findById(compositionId: WorkspaceCompositionId): Promise<WorkspaceComposition | null>;
  save(composition: WorkspaceComposition): Promise<void>;
  listByWorkspaceId(workspaceId: WorkspaceId): Promise<readonly WorkspaceComposition[]>;
  listByType(type: WorkspaceCompositionType): Promise<readonly WorkspaceComposition[]>;
  listByStatus(status: WorkspaceCompositionStatus): Promise<readonly WorkspaceComposition[]>;
}
