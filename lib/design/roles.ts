export const USER_ROLES = [
  "executive",
  "relationship_manager",
  "credit_analyst",
  "operations_lead",
  "compliance_officer",
  "observer",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Readonly<Record<UserRole, string>> = {
  executive: "Executive",
  relationship_manager: "Relationship Manager",
  credit_analyst: "Credit Analyst",
  operations_lead: "Operations Lead",
  compliance_officer: "Compliance Officer",
  observer: "Observer",
};
