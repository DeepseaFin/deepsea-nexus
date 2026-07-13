import type { BusinessPassportProjection } from "@/lib/business-passport/projections/BusinessPassportProjection";
import type { ProjectionMetadata } from "@/lib/business-passport/projections/ProjectionMetadata";

export interface ProjectionValidation {
  readonly valid: boolean;
  readonly checks: readonly string[];
}

export interface ProjectionResult<TPassport = BusinessPassportProjection> {
  readonly projectionMetadata: ProjectionMetadata;
  readonly passport: TPassport;
  readonly validation: ProjectionValidation;
  readonly warnings: readonly string[];
}
