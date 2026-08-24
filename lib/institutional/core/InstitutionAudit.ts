export interface InstitutionAudit {
  readonly createdBy: string;
  readonly createdAt: string;
  readonly updatedBy: string;
  readonly updatedAt: string;
  readonly changeReason: string | null;
}
