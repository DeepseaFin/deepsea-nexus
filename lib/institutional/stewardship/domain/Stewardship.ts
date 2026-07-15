import { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionDocument } from "@/lib/institutional/core/InstitutionDocument";
import type { StewardshipStatus } from "@/lib/institutional/stewardship/constants/StewardshipStatus";

export type StewardshipId = string;

export interface Stewardship extends InstitutionDocument {
  readonly stewardshipId: StewardshipId;
  readonly status: StewardshipStatus;
  readonly classification: InstitutionClassification;
}

export const StewardshipClassification: InstitutionClassification = InstitutionClassification.Stewardship;
