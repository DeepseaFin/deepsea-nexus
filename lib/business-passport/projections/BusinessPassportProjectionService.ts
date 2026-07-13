import type { ProjectionAssembler } from "@/lib/business-passport/projections/ProjectionAssembler";
import type { ProjectionContext } from "@/lib/business-passport/projections/ProjectionContext";
import type { ProjectionRegistry } from "@/lib/business-passport/projections/ProjectionRegistry";
import type { ProjectionResult } from "@/lib/business-passport/projections/ProjectionResult";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface BusinessPassportProjectionService {
  project(context: ProjectionContext): ProjectionResult;
  rebuild(passportId: PassportId, requestedBy: string): ProjectionResult;
  refresh(context: ProjectionContext): ProjectionResult;
  validate(result: ProjectionResult): ProjectionResult["validation"];
  canProject(projectionName: string): boolean;
}

export interface BusinessPassportProjectionServiceDependencies {
  readonly projectionRegistry: ProjectionRegistry;
  readonly projectionAssembler: ProjectionAssembler;
}

export function createBusinessPassportProjectionService(
  dependencies: BusinessPassportProjectionServiceDependencies,
): BusinessPassportProjectionService {
  return {
    project(context: ProjectionContext): ProjectionResult {
      return dependencies.projectionAssembler.assemble(context);
    },

    rebuild(passportId: PassportId, requestedBy: string): ProjectionResult {
      return dependencies.projectionAssembler.rebuild(passportId, requestedBy);
    },

    refresh(context: ProjectionContext): ProjectionResult {
      return dependencies.projectionAssembler.refresh(context);
    },

    validate(result: ProjectionResult): ProjectionResult["validation"] {
      return dependencies.projectionAssembler.validate(result);
    },

    canProject(projectionName: string): boolean {
      return dependencies.projectionRegistry.exists(projectionName);
    },
  };
}
