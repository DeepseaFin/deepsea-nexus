import type { InstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import type { InstitutionIdentity } from "@/lib/institution/domain/InstitutionIdentity";
import type { InstitutionProfile } from "@/lib/institution/domain/InstitutionProfile";
import type { InstitutionMetadata } from "@/lib/institution/types/InstitutionMetadata";

export interface Institution {
  readonly identity: InstitutionIdentity;
  readonly status: InstitutionStatus;
  readonly profile: InstitutionProfile;
  readonly metadata: InstitutionMetadata;
}