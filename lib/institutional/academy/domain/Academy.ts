import { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionDocument } from "@/lib/institutional/core/InstitutionDocument";
import type { AcademyStatus } from "@/lib/institutional/academy/constants/AcademyStatus";

export type AcademyId = string;

export interface Academy extends InstitutionDocument {
  readonly academyId: AcademyId;
  readonly status: AcademyStatus;
  readonly classification: InstitutionClassification;
}

export const AcademyClassification: InstitutionClassification = InstitutionClassification.Academy;
