import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";
import type { ProjectionFactoryResult } from "@/src/framework/projections/ProjectionFactoryResult";

export interface ApprovalProjectionResult<
  TProjection extends ApprovalProjection = ApprovalProjection,
> extends ProjectionFactoryResult<TProjection> {}