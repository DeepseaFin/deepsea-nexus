import type { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import type { Journey } from "@/lib/journey/domain/Journey";
import type { BusinessId } from "@/lib/journey/domain/Journey";
import type { JourneyId } from "@/lib/journey/domain/Journey";

export interface JourneyRepository {
  findById(journeyId: JourneyId): Promise<Journey | null>;
  save(journey: Journey): Promise<void>;
  listByBusinessId(businessId: BusinessId): Promise<readonly Journey[]>;
  listByStatus(status: JourneyStatus): Promise<readonly Journey[]>;
}