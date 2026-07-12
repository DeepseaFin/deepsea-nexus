import type { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { BusinessPassportProfiles } from "@/lib/business-passport/domain/BusinessPassport";
import type { PassportGovernance } from "@/lib/business-passport/domain/Governance";
import type { PassportMetadata } from "@/lib/business-passport/domain/Metadata";
import type { Confidence } from "@/lib/business-passport/types/Confidence";
import type { InstitutionalPulse } from "@/lib/business-passport/types/InstitutionalPulse";
import type { KnowledgeDensity } from "@/lib/business-passport/types/KnowledgeDensity";
import type { PassportMaturity } from "@/lib/business-passport/types/PassportMaturity";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface CreateBusinessPassportInput {
  readonly passportId: PassportId;
  readonly metadata: PassportMetadata;
  readonly governance: PassportGovernance;
  readonly profiles: BusinessPassportProfiles;
  readonly confidence: Confidence;
  readonly knowledgeDensity: KnowledgeDensity;
  readonly institutionalPulse: InstitutionalPulse;
  readonly maturity: PassportMaturity;
}

export interface BusinessPassportService {
  create(input: CreateBusinessPassportInput): Promise<BusinessPassport>;
  get(passportId: PassportId): Promise<BusinessPassport | null>;
  updateStatus(passportId: PassportId, status: PassportStatus, updatedBy: string): Promise<BusinessPassport>;
}
