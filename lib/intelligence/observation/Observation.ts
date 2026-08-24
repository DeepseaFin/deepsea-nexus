import type { ObservationId } from "@/lib/intelligence/observation/ObservationId";
import type { ObservationMetadata } from "@/lib/intelligence/observation/ObservationMetadata";
import type { ObservationStatus } from "@/lib/intelligence/observation/ObservationStatus";
import type { ObservationType } from "@/lib/intelligence/observation/ObservationType";

export interface Observation {
  readonly observationId: ObservationId;
  readonly title: string;
  readonly description: string;
  readonly observationType: ObservationType;
  readonly status: ObservationStatus;
  readonly source: string;
  readonly observedAt: string;
  readonly relatedEntityIds: readonly string[];
  readonly metadata: ObservationMetadata;
}