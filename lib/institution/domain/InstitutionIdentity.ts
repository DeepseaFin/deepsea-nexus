import type { InstitutionType } from "@/lib/institution/constants/InstitutionType";

export type InstitutionId = string;

export interface InstitutionIdentity {
  readonly institutionId: InstitutionId;
  readonly legalName: string;
  readonly displayName: string;
  readonly institutionType: InstitutionType;
  readonly jurisdiction: string;
  readonly registrationNumber: string;
}