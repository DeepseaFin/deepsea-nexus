export const USER_ROLES = [
  "executive",
  "relationship_manager",
  "credit_analyst",
  "operations_lead",
  "compliance_officer",
  "observer",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type PresentationExperienceContext = "employee" | "client";

export const USER_ROLE_LABELS: Readonly<Record<UserRole, string>> = {
  executive: "Executive",
  relationship_manager: "Relationship Manager",
  credit_analyst: "Credit Analyst",
  operations_lead: "Operations Lead",
  compliance_officer: "Compliance Officer",
  observer: "Observer",
};

const INFRASTRUCTURE_TO_UI_ROLE: Readonly<Record<string, UserRole>> = {
  PLATFORM_ADMIN: "executive",
  EXECUTIVE: "executive",
  RELATIONSHIP_MANAGER: "relationship_manager",
  TREASURY: "operations_lead",
  OPERATIONS: "operations_lead",
  COMPLIANCE: "compliance_officer",
  VIEWER: "observer",
  SYSTEM: "observer",
};

export function resolveUserRoleFromIdentityRoles(
  identityRoles: readonly string[] | undefined,
  fallbackRole: UserRole = "relationship_manager",
): UserRole {
  if (!identityRoles || identityRoles.length === 0) {
    return fallbackRole;
  }

  for (const role of identityRoles) {
    const mappedRole = INFRASTRUCTURE_TO_UI_ROLE[role.toUpperCase()];
    if (mappedRole) {
      return mappedRole;
    }
  }

  return fallbackRole;
}

export function resolvePresentationExperienceContext(role: UserRole): PresentationExperienceContext {
  // Temporary compatibility mapping for E1: observer receives client-style UX.
  // This does not redefine the underlying domain authorization model.
  return role === "observer" ? "client" : "employee";
}
