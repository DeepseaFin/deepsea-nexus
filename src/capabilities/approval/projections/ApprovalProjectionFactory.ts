import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";
import type { ApprovalProjectionContext } from "@/src/capabilities/approval/projections/ApprovalProjectionContext";
import type { ProjectionFactory } from "@/src/framework/projections/ProjectionFactory";

export interface ApprovalProjectionFactory
  extends ProjectionFactory<ApprovalProjectionContext, ApprovalProjection> {}