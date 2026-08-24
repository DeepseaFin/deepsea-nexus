import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { InstitutionEvent } from "@/lib/institution/events/domain/InstitutionEvent";
import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";
import type { InstitutionAlert } from "@/lib/institution/intelligence/domain/InstitutionAlert";
import type { InstitutionExecutiveSummary } from "@/lib/institution/intelligence/domain/InstitutionExecutiveSummary";
import type { InstitutionInsight } from "@/lib/institution/intelligence/domain/InstitutionInsight";
import type { InstitutionRecommendation } from "@/lib/institution/intelligence/domain/InstitutionRecommendation";
import type { InstitutionRating } from "@/lib/institution/intelligence/types/InstitutionRating";
import type { InstitutionScore } from "@/lib/institution/intelligence/types/InstitutionScore";
import type { Journey } from "@/lib/journey/domain/Journey";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";

export interface InstitutionIntelligenceReferences {
  readonly health: InstitutionHealth;
  readonly businessPassport?: BusinessPassport;
  readonly timelineId?: string;
  readonly journey?: Journey;
  readonly knowledge?: KnowledgeCollection;
  readonly events: readonly InstitutionEvent[];
}

export interface InstitutionIntelligence {
  readonly institutionId: string;
  readonly overallRating: InstitutionRating;
  readonly overallScore: InstitutionScore;
  readonly executiveSummary: InstitutionExecutiveSummary;
  readonly keyInsights: readonly InstitutionInsight[];
  readonly alerts: readonly InstitutionAlert[];
  readonly recommendations: readonly InstitutionRecommendation[];
  readonly references: InstitutionIntelligenceReferences;
}