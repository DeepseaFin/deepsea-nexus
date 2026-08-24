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
import type { PolicyStatus } from "@/lib/institutional/policy/constants/PolicyStatus";
import type { Policy } from "@/lib/institutional/policy/domain/Policy";
import type { PolicyId } from "@/lib/institutional/policy/domain/Policy";
import type { PolicySummary } from "@/lib/institutional/policy/types/PolicySummary";

export interface CreatePolicyInput {
  readonly policyId: PolicyId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: PolicyStatus;
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

export interface PolicyService extends InstitutionalService<Policy> {
  create(input: CreatePolicyInput): Promise<Policy>;
  get(policyId: PolicyId): Promise<Policy | null>;
  updateStatus(policyId: PolicyId, status: PolicyStatus, updatedBy: string): Promise<Policy>;
  summarize(policyId: PolicyId): Promise<PolicySummary | null>;
}
