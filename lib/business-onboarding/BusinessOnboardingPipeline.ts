import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import {
  knowledgeIdentityProjector,
  type KnowledgeIdentityProjector,
} from "@/lib/business-passport/projections/KnowledgeIdentityProjector";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import { evidenceFactory, type EvidenceFactory } from "@/lib/evidence/services/EvidenceFactory";
import type { OracleDocumentEvidenceInput } from "@/lib/evidence/services/EvidenceMapper";
import { evidenceValidator, type EvidenceValidator } from "@/lib/evidence/services/EvidenceValidator";
import {
  evidenceKnowledgeMapper,
  type EvidenceKnowledgeMapper,
} from "@/lib/knowledge/services/EvidenceKnowledgeMapper";
import type { BusinessOnboardingResult } from "@/lib/business-onboarding/BusinessOnboardingResult";

export interface BusinessOnboardingPipelineInput {
  readonly oracleDocument: OracleDocumentEvidenceInput;
  readonly passport: BusinessPassport;
  readonly evidenceReferences?: readonly EvidenceReference[];
}

export interface BusinessOnboardingPipelineDependencies {
  readonly evidenceFactory: EvidenceFactory;
  readonly evidenceValidator: EvidenceValidator;
  readonly evidenceKnowledgeMapper: EvidenceKnowledgeMapper;
  readonly knowledgeIdentityProjector: KnowledgeIdentityProjector;
}

export interface BusinessOnboardingPipeline {
  run(input: BusinessOnboardingPipelineInput): BusinessOnboardingResult;
}

function buildProjectionValidation(result: BusinessOnboardingResult["projection"]): BusinessOnboardingResult["validation"]["projection"] {
  return {
    valid: result.warnings.length === 0,
    checks:
      result.warnings.length === 0
        ? ["identity_profile_projection_completed"]
        : result.warnings.map((warning) => `warning:${warning}`),
  };
}

export function createBusinessOnboardingPipeline(
  dependencies: BusinessOnboardingPipelineDependencies = {
    evidenceFactory,
    evidenceValidator,
    evidenceKnowledgeMapper,
    knowledgeIdentityProjector,
  },
): BusinessOnboardingPipeline {
  return {
    run(input: BusinessOnboardingPipelineInput): BusinessOnboardingResult {
      const evidence = dependencies.evidenceFactory.createFromOracleDocument(
        input.oracleDocument,
        input.evidenceReferences,
      );

      const evidenceValidation = dependencies.evidenceValidator.validateEvidence(
        evidence,
        input.oracleDocument.uploadedAt,
      );

      const transformation = dependencies.evidenceKnowledgeMapper.mapEvidence(evidence);
      const projection = dependencies.knowledgeIdentityProjector.project(
        transformation.knowledgeCollection,
        input.passport,
      );

      const warnings = [...transformation.warnings.map((warning) => warning.message), ...projection.warnings];

      const provisionalResult = {
        evidence,
        knowledge: transformation.knowledgeCollection,
        passport: projection.updatedPassport,
        projection,
        validation: {
          evidence: evidenceValidation,
          knowledge: transformation.validationResult,
          projection: {
            valid: true,
            checks: [],
          },
        },
        warnings,
      } satisfies Omit<BusinessOnboardingResult, "validation"> & {
        validation: BusinessOnboardingResult["validation"];
      };

      return {
        ...provisionalResult,
        validation: {
          ...provisionalResult.validation,
          projection: buildProjectionValidation(projection),
        },
      };
    },
  };
}

export const businessOnboardingPipeline = createBusinessOnboardingPipeline();