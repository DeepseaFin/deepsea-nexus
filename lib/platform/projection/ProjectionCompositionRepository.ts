import type { ProjectionComposition } from "@/lib/platform/projection/ProjectionComposition";
import type { ProjectionCompositionId } from "@/lib/platform/projection/ProjectionCompositionId";
import type { ProjectionCompositionStatus } from "@/lib/platform/projection/ProjectionCompositionStatus";
import type { ProjectionCompositionType } from "@/lib/platform/projection/ProjectionCompositionType";

export interface ProjectionCompositionRepository {
  findById(compositionId: ProjectionCompositionId): Promise<ProjectionComposition | null>;
  save(composition: ProjectionComposition): Promise<void>;
  listByType(type: ProjectionCompositionType): Promise<readonly ProjectionComposition[]>;
  listByStatus(status: ProjectionCompositionStatus): Promise<readonly ProjectionComposition[]>;
}
