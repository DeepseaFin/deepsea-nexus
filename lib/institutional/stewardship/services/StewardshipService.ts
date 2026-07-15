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
import type { StewardshipStatus } from "@/lib/institutional/stewardship/constants/StewardshipStatus";
import type { Stewardship } from "@/lib/institutional/stewardship/domain/Stewardship";
import type { StewardshipId } from "@/lib/institutional/stewardship/domain/Stewardship";
import type { StewardshipSummary } from "@/lib/institutional/stewardship/types/StewardshipSummary";

export interface CreateStewardshipInput {
  readonly stewardshipId: StewardshipId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: StewardshipStatus;
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

export interface StewardshipService extends InstitutionalService<Stewardship> {
  create(input: CreateStewardshipInput): Promise<Stewardship>;
  get(stewardshipId: StewardshipId): Promise<Stewardship | null>;
  updateStatus(stewardshipId: StewardshipId, status: StewardshipStatus, updatedBy: string): Promise<Stewardship>;
  summarize(stewardshipId: StewardshipId): Promise<StewardshipSummary | null>;
}
