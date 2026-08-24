import type { CapabilityProjection } from "@/src/capabilities/platform/projections/CapabilityProjection";
import type { NavigationNodeProjection } from "@/src/capabilities/platform/projections/NavigationNodeProjection";
import type { ProjectionCompositionProjection } from "@/src/capabilities/platform/projections/ProjectionCompositionProjection";
import type { WorkspaceCompositionProjection } from "@/src/capabilities/platform/projections/WorkspaceCompositionProjection";
import type { WorkspaceProjection } from "@/src/capabilities/platform/projections/WorkspaceProjection";

export interface PlatformWorkspaceProjection {
  readonly capabilities: readonly CapabilityProjection[];
  readonly workspaces: readonly WorkspaceProjection[];
  readonly workspaceCompositions: readonly WorkspaceCompositionProjection[];
  readonly projectionCompositions: readonly ProjectionCompositionProjection[];
  readonly navigation: readonly NavigationNodeProjection[];
}
