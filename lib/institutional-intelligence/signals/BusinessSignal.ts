import type { BusinessSignalSeverity } from "@/lib/institutional-intelligence/signals/BusinessSignalSeverity";
import type { BusinessSignalType } from "@/lib/institutional-intelligence/signals/BusinessSignalType";

export interface BusinessSignal {
  readonly id: string;
  readonly type: BusinessSignalType;
  readonly title: string;
  readonly description: string;
  readonly severity: BusinessSignalSeverity;
  readonly supportingFactIds: readonly string[];
  readonly confidence: number;
}
