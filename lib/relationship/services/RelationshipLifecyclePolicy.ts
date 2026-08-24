import type { CreateRelationshipInput } from "@/lib/relationship/RelationshipService";
import { RelationshipId } from "@/lib/relationship/RelationshipId";

export interface RelationshipLifecycleIssue {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
}

export interface RelationshipLifecycleValidationResult {
  readonly valid: boolean;
  readonly issues: readonly RelationshipLifecycleIssue[];
}

function createIssue(code: string, message: string, field?: string): RelationshipLifecycleIssue {
  return { code, message, field };
}

function createValidationResult(
  issues: readonly RelationshipLifecycleIssue[],
): RelationshipLifecycleValidationResult {
  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateRelationshipId(relationshipId: RelationshipId): RelationshipLifecycleValidationResult {
  try {
    RelationshipId.fromString(relationshipId.toString());
  } catch {
    return createValidationResult([
      createIssue("relationship_id_invalid", "Relationship id is invalid.", "relationshipId"),
    ]);
  }

  return createValidationResult([]);
}

export function assertRelationshipIdOrThrow(relationshipId: RelationshipId): RelationshipId {
  const validation = validateRelationshipId(relationshipId);

  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Invalid relationship id.");
  }

  return relationshipId;
}

export function validateInstitutionRelationshipScope(institutionId: string): RelationshipLifecycleValidationResult {
  if (typeof institutionId !== "string") {
    return createValidationResult([
      createIssue(
        "institution_id_invalid",
        "Institution id must be a string for institution-scoped relationship access.",
        "institutionId",
      ),
    ]);
  }

  return createValidationResult([]);
}

export function assertInstitutionRelationshipScopeOrThrow(institutionId: string): string {
  const validation = validateInstitutionRelationshipScope(institutionId);

  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Invalid institution relationship scope.");
  }

  return institutionId;
}

export function validateCreateRelationshipInput(
  input: CreateRelationshipInput,
): RelationshipLifecycleValidationResult {
  const issues: RelationshipLifecycleIssue[] = [];

  const relationshipIdValidation = validateRelationshipId(input.relationshipId);
  issues.push(...relationshipIdValidation.issues);

  const institutionScopeValidation = validateInstitutionRelationshipScope(input.institutionId);
  issues.push(...institutionScopeValidation.issues);

  return createValidationResult(issues);
}

export function assertCreateRelationshipInputOrThrow(input: CreateRelationshipInput): CreateRelationshipInput {
  const validation = validateCreateRelationshipInput(input);

  if (!validation.valid) {
    throw new Error(validation.issues[0]?.message ?? "Invalid relationship create input.");
  }

  return input;
}