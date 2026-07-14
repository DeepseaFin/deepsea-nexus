import type { InstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import type { Institution } from "@/lib/institution/domain/Institution";
import type { InstitutionIdentity } from "@/lib/institution/domain/InstitutionIdentity";
import type { InstitutionProfile } from "@/lib/institution/domain/InstitutionProfile";
import type { InstitutionMetadata } from "@/lib/institution/types/InstitutionMetadata";
import type { InstitutionSnapshot } from "@/lib/institution/types/InstitutionSnapshot";

export interface CreateInstitutionInput {
  readonly identity: InstitutionIdentity;
  readonly profile: InstitutionProfile;
  readonly metadata: InstitutionMetadata;
}

export interface InstitutionService {
  create(input: CreateInstitutionInput): Promise<Institution>;
  get(institutionId: InstitutionIdentity["institutionId"]): Promise<Institution | null>;
  updateStatus(
    institutionId: InstitutionIdentity["institutionId"],
    status: InstitutionStatus,
    updatedBy: string,
  ): Promise<Institution>;
  snapshot(institutionId: InstitutionIdentity["institutionId"]): Promise<InstitutionSnapshot | null>;
}