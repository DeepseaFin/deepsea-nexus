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
import type { ConstitutionStatus } from "@/lib/institutional/constitution/constants/ConstitutionStatus";
import type { Constitution } from "@/lib/institutional/constitution/domain/Constitution";
import type { ConstitutionId } from "@/lib/institutional/constitution/domain/Constitution";
import type { ConstitutionSummary } from "@/lib/institutional/constitution/types/ConstitutionSummary";

export interface CreateConstitutionInput {
  readonly constitutionId: ConstitutionId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: ConstitutionStatus;
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

export interface ConstitutionService extends InstitutionalService<Constitution> {
  create(input: CreateConstitutionInput): Promise<Constitution>;
  get(constitutionId: ConstitutionId): Promise<Constitution | null>;
  updateStatus(constitutionId: ConstitutionId, status: ConstitutionStatus, updatedBy: string): Promise<Constitution>;
  summarize(constitutionId: ConstitutionId): Promise<ConstitutionSummary | null>;
}
