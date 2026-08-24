import type { ProjectionContext } from "@/lib/business-passport/projections/ProjectionContext";
import type { ProjectionResult } from "@/lib/business-passport/projections/ProjectionResult";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface ProjectionAssembler {
  assemble(context: ProjectionContext): ProjectionResult;
  rebuild(passportId: PassportId, requestedBy: string): ProjectionResult;
  refresh(context: ProjectionContext): ProjectionResult;
  validate(result: ProjectionResult): ProjectionResult["validation"];
}
