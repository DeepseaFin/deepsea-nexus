import { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionDocument } from "@/lib/institutional/core/InstitutionDocument";
import type { ConstitutionStatus } from "@/lib/institutional/constitution/constants/ConstitutionStatus";

export type ConstitutionId = string;

export interface Constitution extends InstitutionDocument {
  readonly constitutionId: ConstitutionId;
  readonly status: ConstitutionStatus;
  readonly classification: InstitutionClassification;
}

export const ConstitutionClassification: InstitutionClassification = InstitutionClassification.Constitution;
