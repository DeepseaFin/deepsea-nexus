import type { InstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import type { InstitutionType } from "@/lib/institution/constants/InstitutionType";
import type { InstitutionId } from "@/lib/institution/domain/InstitutionIdentity";

export interface InstitutionSnapshot {
  readonly institutionId: InstitutionId;
  readonly legalName: string;
  readonly institutionType: InstitutionType;
  readonly jurisdiction: string;
  readonly status: InstitutionStatus;
  readonly businessPassportId?: string;
  readonly journeyId?: string;
  readonly timelineId?: string;
  readonly evidenceCount: number;
  readonly knowledgeCount: number;
}