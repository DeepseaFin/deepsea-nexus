import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { StewardshipId } from "@/lib/institutional/stewardship/domain/Stewardship";
import type { StewardshipStatus } from "@/lib/institutional/stewardship/constants/StewardshipStatus";

export interface StewardshipSummary {
  readonly stewardshipId: StewardshipId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: StewardshipStatus;
  readonly effectiveFrom: string | null;
  readonly reviewedAt: string | null;
}
