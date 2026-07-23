import type { BusinessOnboardingResult } from "@/lib/business-onboarding/BusinessOnboardingResult";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";

export interface InstitutionalGraphSource {
  readonly passport: BusinessPassport;
  readonly evidence?: readonly Evidence[];
  readonly knowledgeFacts?: readonly KnowledgeFact[];
  readonly onboardingResults?: readonly BusinessOnboardingResult[];
}
