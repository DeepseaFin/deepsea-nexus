import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { InstitutionEvent } from "@/lib/institution/events/domain/InstitutionEvent";
import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";
import type { InstitutionIntelligence } from "@/lib/institution/intelligence/domain/InstitutionIntelligence";
import type { Journey } from "@/lib/journey/domain/Journey";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";

export interface BuildInstitutionIntelligenceInput {
  readonly institutionId: string;
  readonly health: InstitutionHealth;
  readonly businessPassport?: BusinessPassport;
  readonly timelineId?: string;
  readonly journey?: Journey;
  readonly knowledge?: KnowledgeCollection;
  readonly events: readonly InstitutionEvent[];
}

export interface InstitutionIntelligenceService {
  build(input: BuildInstitutionIntelligenceInput): InstitutionIntelligence;
}