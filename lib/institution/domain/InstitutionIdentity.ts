import type { InstitutionType } from "@/lib/institution/constants/InstitutionType";

export type InstitutionId = string;

const INSTITUTION_ID_PATTERN = /^[a-zA-Z0-9:_-]{8,128}$/;

export interface InstitutionIdentity {
  readonly institutionId: InstitutionId;
  readonly legalName: string;
  readonly displayName: string;
  readonly institutionType: InstitutionType;
  readonly jurisdiction: string;
  readonly registrationNumber: string;
}

export function createInstitutionId(): InstitutionId {
  const timeToken = Date.now().toString(36);
  const randomToken = Math.random().toString(36).slice(2, 10);
  return `institution:${timeToken}:${randomToken}`;
}

export function isInstitutionId(value: string): value is InstitutionId {
  return INSTITUTION_ID_PATTERN.test(value.trim());
}

export function assertInstitutionId(value: string): InstitutionId {
  const normalized = value.trim();

  if (!isInstitutionId(normalized)) {
    throw new Error("Invalid InstitutionId format.");
  }

  return normalized;
}