import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";

export interface InstitutionHealthRepository {
  findByInstitutionId(institutionId: string): Promise<InstitutionHealth | null>;
  save(health: InstitutionHealth): Promise<void>;
}