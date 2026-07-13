import type { BusinessPassport, BusinessPassportProfiles } from "@/lib/business-passport/domain/BusinessPassport";
import type { ProjectionMetadata } from "@/lib/business-passport/projections/ProjectionMetadata";

export interface KnowledgeProjectionResult {
  readonly updatedPassport: BusinessPassport;
  readonly updatedProfiles: Pick<BusinessPassportProfiles, "identityProfile">;
  readonly warnings: readonly string[];
  readonly projectionMetadata: ProjectionMetadata;
}