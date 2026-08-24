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
import type { GovernanceStatus } from "@/lib/institutional/governance/constants/GovernanceStatus";
import type { Governance } from "@/lib/institutional/governance/domain/Governance";
import type { GovernanceId } from "@/lib/institutional/governance/domain/Governance";
import type { GovernanceSummary } from "@/lib/institutional/governance/types/GovernanceSummary";

export interface CreateGovernanceInput {
  readonly governanceId: GovernanceId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: GovernanceStatus;
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

export interface GovernanceService extends InstitutionalService<Governance> {
  create(input: CreateGovernanceInput): Promise<Governance>;
  get(governanceId: GovernanceId): Promise<Governance | null>;
  updateStatus(governanceId: GovernanceId, status: GovernanceStatus, updatedBy: string): Promise<Governance>;
  summarize(governanceId: GovernanceId): Promise<GovernanceSummary | null>;
}
