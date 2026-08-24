import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";

export interface InstitutionalRepository<T> {
  findById(entityId: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  listByInstitutionId(institutionId: InstitutionId): Promise<readonly T[]>;
}
