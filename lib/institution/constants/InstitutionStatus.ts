export enum InstitutionStatus {
  Draft = "draft",
  Active = "active",
  UnderReview = "under_review",
  Restricted = "restricted",
  Archived = "archived",
}

export const INSTITUTION_STATUS_TRANSITIONS: Readonly<Record<InstitutionStatus, readonly InstitutionStatus[]>> = {
  [InstitutionStatus.Draft]: [InstitutionStatus.UnderReview, InstitutionStatus.Active, InstitutionStatus.Archived],
  [InstitutionStatus.UnderReview]: [InstitutionStatus.Draft, InstitutionStatus.Active, InstitutionStatus.Restricted, InstitutionStatus.Archived],
  [InstitutionStatus.Active]: [InstitutionStatus.UnderReview, InstitutionStatus.Restricted, InstitutionStatus.Archived],
  [InstitutionStatus.Restricted]: [InstitutionStatus.UnderReview, InstitutionStatus.Active, InstitutionStatus.Archived],
  [InstitutionStatus.Archived]: [],
};

export function getInstitutionStatusTransitions(status: InstitutionStatus): readonly InstitutionStatus[] {
  return INSTITUTION_STATUS_TRANSITIONS[status];
}

export function canTransitionInstitutionStatus(from: InstitutionStatus, to: InstitutionStatus): boolean {
  if (from === to) {
    return false;
  }

  return INSTITUTION_STATUS_TRANSITIONS[from].includes(to);
}

export function assertInstitutionStatusTransition(from: InstitutionStatus, to: InstitutionStatus): InstitutionStatus {
  if (!canTransitionInstitutionStatus(from, to)) {
    throw new Error(`Invalid institution status transition from ${from} to ${to}.`);
  }

  return to;
}