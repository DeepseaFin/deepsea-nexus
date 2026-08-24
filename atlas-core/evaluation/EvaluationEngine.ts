import type { DealModel } from '@/atlas-core/deals/DealModel';
import type { EvaluationResult } from './EvaluationResult';

export interface EvaluationEngine {
  evaluate(deal: DealModel): EvaluationResult;
}
