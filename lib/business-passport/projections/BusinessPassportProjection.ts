import type { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import type { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { ConfidenceScore } from "@/lib/business-passport/types/Confidence";
import type { InstitutionalPulseState } from "@/lib/business-passport/types/InstitutionalPulse";
import type { KnowledgeDensityBand } from "@/lib/business-passport/types/KnowledgeDensity";
import type { PassportMaturityLevel } from "@/lib/business-passport/types/PassportMaturity";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface BusinessPassportProjection {
  readonly passportId: PassportId;
  readonly status: PassportStatus;
  readonly lifecycle: PassportLifecycle;
  readonly confidenceScore: ConfidenceScore;
  readonly knowledgeDensityBand: KnowledgeDensityBand;
  readonly institutionalPulseState: InstitutionalPulseState;
  readonly maturityLevel: PassportMaturityLevel;
  readonly updatedAt: string;
}
