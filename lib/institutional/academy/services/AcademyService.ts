import type { InstitutionAudit } from "@/lib/institutional/core/InstitutionAudit";
import type { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionCustodian } from "@/lib/institutional/core/InstitutionCustodian";
import type { InstitutionEvent } from "@/lib/institutional/core/InstitutionEvent";
import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionLifecycle } from "@/lib/institutional/core/InstitutionLifecycle";
import type { InstitutionMetadata } from "@/lib/institutional/core/InstitutionMetadata";
import type { InstitutionOwner } from "@/lib/institutional/core/InstitutionOwner";
import type { InstitutionReference } from "@/lib/institutional/core/InstitutionReference";
import type { InstitutionalService } from "@/lib/institutional/core/InstitutionalService";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { AcademyStatus } from "@/lib/institutional/academy/constants/AcademyStatus";
import type { Academy } from "@/lib/institutional/academy/domain/Academy";
import type { AcademyId } from "@/lib/institutional/academy/domain/Academy";
import type { AcademySummary } from "@/lib/institutional/academy/types/AcademySummary";

export interface CreateAcademyInput {
  readonly academyId: AcademyId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: AcademyStatus;
  readonly classification: InstitutionClassification;
  readonly owner: InstitutionOwner;
  readonly custodian: InstitutionCustodian;
  readonly reviewerIds: readonly string[];
  readonly approverIds: readonly string[];
  readonly metadata: InstitutionMetadata;
  readonly lifecycle: InstitutionLifecycle;
  readonly audit: InstitutionAudit;
  readonly references: readonly InstitutionReference[];
  readonly events: readonly InstitutionEvent[];
}

export interface AcademyService extends InstitutionalService<Academy> {
  create(input: CreateAcademyInput): Promise<Academy>;
  get(academyId: AcademyId): Promise<Academy | null>;
  updateStatus(academyId: AcademyId, status: AcademyStatus, updatedBy: string): Promise<Academy>;
  summarize(academyId: AcademyId): Promise<AcademySummary | null>;
}
