import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { GovernanceId } from "@/lib/institutional/governance/domain/Governance";
import type { GovernanceStatus } from "@/lib/institutional/governance/constants/GovernanceStatus";

export interface GovernanceSummary {
  readonly governanceId: GovernanceId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: GovernanceStatus;
  readonly effectiveFrom: string | null;
  readonly reviewedAt: string | null;
}
