import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { PolicyId } from "@/lib/institutional/policy/domain/Policy";
import type { PolicyStatus } from "@/lib/institutional/policy/constants/PolicyStatus";

export interface PolicySummary {
  readonly policyId: PolicyId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: PolicyStatus;
  readonly effectiveFrom: string | null;
  readonly reviewedAt: string | null;
}
