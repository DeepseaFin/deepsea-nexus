import { InstitutionStatus, canTransitionInstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import type { Institution } from "@/lib/institution/domain/Institution";
import {
  assertInstitutionId,
  createInstitutionId,
  type InstitutionIdentity,
} from "@/lib/institution/domain/InstitutionIdentity";
import type { InstitutionProfile } from "@/lib/institution/domain/InstitutionProfile";
import type { InstitutionRepository } from "@/lib/institution/repositories/InstitutionRepository";
import type { InstitutionMetadata } from "@/lib/institution/types/InstitutionMetadata";
import type { InstitutionSnapshot } from "@/lib/institution/types/InstitutionSnapshot";

export interface CreateInstitutionInput {
  readonly identity: InstitutionIdentity;
  readonly profile: InstitutionProfile;
  readonly metadata: InstitutionMetadata;
}

export interface InstitutionService {
  create(input: CreateInstitutionInput): Promise<Institution>;
  get(institutionId: InstitutionIdentity["institutionId"]): Promise<Institution | null>;
  updateStatus(
    institutionId: InstitutionIdentity["institutionId"],
    status: InstitutionStatus,
    updatedBy: string,
  ): Promise<Institution>;
  snapshot(institutionId: InstitutionIdentity["institutionId"]): Promise<InstitutionSnapshot | null>;
}

export interface InstitutionValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
}

export interface InstitutionValidationResult {
  readonly valid: boolean;
  readonly issues: readonly InstitutionValidationIssue[];
}

function createIssue(code: string, message: string, field?: string): InstitutionValidationIssue {
  return { code, message, field };
}

function createValidationResult(issues: readonly InstitutionValidationIssue[]): InstitutionValidationResult {
  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateInstitutionIdentity(identity: InstitutionIdentity): InstitutionValidationResult {
  const issues: InstitutionValidationIssue[] = [];

  try {
    assertInstitutionId(identity.institutionId);
  } catch {
    issues.push(createIssue("institution_id_invalid", "Institution id format is invalid.", "identity.institutionId"));
  }

  if (identity.legalName.trim().length === 0) {
    issues.push(createIssue("legal_name_required", "Institution legal name is required.", "identity.legalName"));
  }

  if (identity.displayName.trim().length === 0) {
    issues.push(createIssue("display_name_required", "Institution display name is required.", "identity.displayName"));
  }

  if (identity.jurisdiction.trim().length === 0) {
    issues.push(createIssue("jurisdiction_required", "Institution jurisdiction is required.", "identity.jurisdiction"));
  }

  if (identity.registrationNumber.trim().length === 0) {
    issues.push(
      createIssue(
        "registration_number_required",
        "Institution registration number is required.",
        "identity.registrationNumber",
      ),
    );
  }

  return createValidationResult(issues);
}

export function validateCreateInstitutionInput(input: CreateInstitutionInput): InstitutionValidationResult {
  const issues: InstitutionValidationIssue[] = [];
  const identityValidation = validateInstitutionIdentity(input.identity);
  issues.push(...identityValidation.issues);

  if (input.profile.legalForm.trim().length === 0) {
    issues.push(createIssue("legal_form_required", "Institution legal form is required.", "profile.legalForm"));
  }

  if (input.profile.businessActivity.trim().length === 0) {
    issues.push(
      createIssue("business_activity_required", "Institution business activity is required.", "profile.businessActivity"),
    );
  }

  if (input.metadata.createdAt.trim().length === 0) {
    issues.push(createIssue("created_at_required", "Institution metadata createdAt is required.", "metadata.createdAt"));
  }

  if (input.metadata.updatedAt.trim().length === 0) {
    issues.push(createIssue("updated_at_required", "Institution metadata updatedAt is required.", "metadata.updatedAt"));
  }

  if (input.metadata.createdBy.trim().length === 0) {
    issues.push(createIssue("created_by_required", "Institution metadata createdBy is required.", "metadata.createdBy"));
  }

  if (input.metadata.updatedBy.trim().length === 0) {
    issues.push(createIssue("updated_by_required", "Institution metadata updatedBy is required.", "metadata.updatedBy"));
  }

  if (input.metadata.source.trim().length === 0) {
    issues.push(createIssue("source_required", "Institution metadata source is required.", "metadata.source"));
  }

  return createValidationResult(issues);
}

export function assertCreateInstitutionInput(input: CreateInstitutionInput): CreateInstitutionInput {
  const validation = validateCreateInstitutionInput(input);

  if (!validation.valid) {
    throw new Error("Invalid institution create input.");
  }

  return input;
}

export function validateInstitutionStatusTransition(
  from: InstitutionStatus,
  to: InstitutionStatus,
): InstitutionValidationResult {
  if (canTransitionInstitutionStatus(from, to)) {
    return createValidationResult([]);
  }

  const code = from === to ? "status_transition_noop" : "status_transition_invalid";
  const message =
    from === to
      ? `Institution status transition from ${from} to ${to} is not allowed because it is a no-op.`
      : `Institution status transition from ${from} to ${to} is not allowed.`;

  return createValidationResult([createIssue(code, message, "status")]);
}

export function assertInstitutionStatusTransitionOrThrow(from: InstitutionStatus, to: InstitutionStatus): InstitutionStatus {
  const validation = validateInstitutionStatusTransition(from, to);

  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Invalid institution status transition.");
  }

  return to;
}

function normalizeCreateInput(input: CreateInstitutionInput): CreateInstitutionInput {
  const providedInstitutionId = input.identity.institutionId.trim();

  return {
    ...input,
    identity: {
      ...input.identity,
      institutionId: providedInstitutionId.length > 0 ? providedInstitutionId : createInstitutionId(),
    },
  };
}

function toInstitutionSnapshot(institution: Institution): InstitutionSnapshot {
  return {
    institutionId: institution.identity.institutionId,
    legalName: institution.identity.legalName,
    institutionType: institution.identity.institutionType,
    jurisdiction: institution.identity.jurisdiction,
    status: institution.status,
    businessPassportId: institution.profile.references.businessPassportId,
    journeyId: institution.profile.references.journeyId,
    timelineId: institution.profile.references.timelineId,
    evidenceCount: institution.profile.references.evidenceIds.length,
    knowledgeCount: institution.profile.references.knowledgeIds.length,
  };
}

export function createInstitutionService(repository: InstitutionRepository): InstitutionService {
  return {
    async create(input: CreateInstitutionInput): Promise<Institution> {
      const normalizedInput = normalizeCreateInput(input);
      const validatedInput = assertCreateInstitutionInput(normalizedInput);

      const institution: Institution = {
        identity: {
          ...validatedInput.identity,
          institutionId: assertInstitutionId(validatedInput.identity.institutionId),
        },
        status: InstitutionStatus.Draft,
        profile: validatedInput.profile,
        metadata: validatedInput.metadata,
      };

      await repository.save(institution);

      return institution;
    },

    async get(institutionId: InstitutionIdentity["institutionId"]): Promise<Institution | null> {
      return repository.findById(assertInstitutionId(institutionId));
    },

    async updateStatus(
      institutionId: InstitutionIdentity["institutionId"],
      status: InstitutionStatus,
      updatedBy: string,
    ): Promise<Institution> {
      const normalizedInstitutionId = assertInstitutionId(institutionId);
      const currentInstitution = await repository.findById(normalizedInstitutionId);

      if (!currentInstitution) {
        throw new Error(`Institution ${normalizedInstitutionId} was not found.`);
      }

      assertInstitutionStatusTransitionOrThrow(currentInstitution.status, status);

      const normalizedUpdatedBy = updatedBy.trim();

      if (normalizedUpdatedBy.length === 0) {
        throw new Error("updatedBy is required.");
      }

      const updatedInstitution: Institution = {
        ...currentInstitution,
        status,
        metadata: {
          ...currentInstitution.metadata,
          updatedAt: new Date().toISOString(),
          updatedBy: normalizedUpdatedBy,
        },
      };

      await repository.save(updatedInstitution);

      return updatedInstitution;
    },

    async snapshot(institutionId: InstitutionIdentity["institutionId"]): Promise<InstitutionSnapshot | null> {
      const institution = await repository.findById(assertInstitutionId(institutionId));

      if (!institution) {
        return null;
      }

      return toInstitutionSnapshot(institution);
    },
  };
}