export interface InstitutionReferenceSet {
  readonly businessPassportId?: string;
  readonly timelineId?: string;
  readonly journeyId?: string;
  readonly evidenceIds: readonly string[];
  readonly knowledgeIds: readonly string[];
}

export interface InstitutionProfile {
  readonly legalForm: string;
  readonly businessActivity: string;
  readonly establishedOn?: string;
  readonly references: InstitutionReferenceSet;
}