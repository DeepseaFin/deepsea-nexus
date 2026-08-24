import type { Observation } from "@/lib/intelligence/observation/Observation";
import type { ObservationId } from "@/lib/intelligence/observation/ObservationId";
import type { ObservationStatus } from "@/lib/intelligence/observation/ObservationStatus";
import type { ObservationType } from "@/lib/intelligence/observation/ObservationType";

export interface ObservationRepository {
  findById(observationId: ObservationId): Promise<Observation | null>;
  save(observation: Observation): Promise<void>;
  listByType(observationType: ObservationType): Promise<readonly Observation[]>;
  listByStatus(status: ObservationStatus): Promise<readonly Observation[]>;
}