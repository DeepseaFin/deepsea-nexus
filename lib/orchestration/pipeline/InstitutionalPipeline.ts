import type { InstitutionalPipelineContext } from "@/lib/orchestration/pipeline/InstitutionalPipelineContext";
import type { InstitutionalPipelineResult } from "@/lib/orchestration/pipeline/InstitutionalPipelineResult";

export interface InstitutionalPipeline {
  execute(context: InstitutionalPipelineContext): Promise<InstitutionalPipelineResult>;
}
