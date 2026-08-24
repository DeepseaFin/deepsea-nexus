import type { InstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import type { Institution } from "@/lib/institution/domain/Institution";
import type { InstitutionId } from "@/lib/institution/domain/InstitutionIdentity";

export interface InstitutionRepository {
  findById(institutionId: InstitutionId): Promise<Institution | null>;
  save(institution: Institution): Promise<void>;
  listByStatus(status: InstitutionStatus): Promise<readonly Institution[]>;
}