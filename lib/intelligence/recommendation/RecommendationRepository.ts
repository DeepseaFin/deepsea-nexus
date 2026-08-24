import type { Recommendation } from "@/lib/intelligence/recommendation/Recommendation";
import type { RecommendationId } from "@/lib/intelligence/recommendation/RecommendationId";
import type { RecommendationStatus } from "@/lib/intelligence/recommendation/RecommendationStatus";
import type { RecommendationType } from "@/lib/intelligence/recommendation/RecommendationType";

export interface RecommendationRepository {
  findById(recommendationId: RecommendationId): Promise<Recommendation | null>;
  save(recommendation: Recommendation): Promise<void>;
  listByType(recommendationType: RecommendationType): Promise<readonly Recommendation[]>;
  listByStatus(status: RecommendationStatus): Promise<readonly Recommendation[]>;
}