import type { Confidence } from "@/lib/business-passport/types/Confidence";
import type { InstitutionalPulse } from "@/lib/business-passport/types/InstitutionalPulse";
import type { KnowledgeDensity } from "@/lib/business-passport/types/KnowledgeDensity";

export interface ProjectionMetadata {
  readonly projectionVersion: string;
  readonly projectionName: string;
  readonly generatedAt: string;
  readonly generator: string;
  readonly confidence: Confidence;
  readonly knowledgeDensity: KnowledgeDensity;
  readonly institutionalPulse: InstitutionalPulse;
}
