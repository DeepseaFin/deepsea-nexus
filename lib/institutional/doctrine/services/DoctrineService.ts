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
import type { DoctrineStatus } from "@/lib/institutional/doctrine/constants/DoctrineStatus";
import type { Doctrine } from "@/lib/institutional/doctrine/domain/Doctrine";
import type { DoctrineId } from "@/lib/institutional/doctrine/domain/Doctrine";
import type { DoctrineSummary } from "@/lib/institutional/doctrine/types/DoctrineSummary";

export interface CreateDoctrineInput {
  readonly doctrineId: DoctrineId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: DoctrineStatus;
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

export interface DoctrineService extends InstitutionalService<Doctrine> {
  create(input: CreateDoctrineInput): Promise<Doctrine>;
  get(doctrineId: DoctrineId): Promise<Doctrine | null>;
  updateStatus(doctrineId: DoctrineId, status: DoctrineStatus, updatedBy: string): Promise<Doctrine>;
  summarize(doctrineId: DoctrineId): Promise<DoctrineSummary | null>;
}
