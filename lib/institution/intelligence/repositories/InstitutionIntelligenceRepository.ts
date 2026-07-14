import type { InstitutionIntelligence } from "@/lib/institution/intelligence/domain/InstitutionIntelligence";

export interface InstitutionIntelligenceRepository {
  findByInstitutionId(institutionId: string): Promise<InstitutionIntelligence | null>;
  save(intelligence: InstitutionIntelligence): Promise<void>;
}