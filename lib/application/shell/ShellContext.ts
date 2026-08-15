import {
  resolveUserRoleFromIdentityRoles,
  type UserRole,
} from "@/lib/design/roles";

export interface ShellContext {
  readonly role: UserRole;
  readonly userName: string;
  readonly userEmail?: string;
}

interface SessionIdentityPayload {
  readonly id?: unknown;
  readonly email?: unknown;
  readonly roles?: unknown;
}

interface SessionPayload {
  readonly identity?: SessionIdentityPayload;
}

export function createDefaultShellContext(
  fallbackRole: UserRole = "relationship_manager",
): ShellContext {
  return {
    role: fallbackRole,
    userName: "Institution User",
    userEmail: undefined,
  };
}

export function resolveShellContextFromSessionPayload(
  payload: SessionPayload,
  fallbackRole: UserRole = "relationship_manager",
): ShellContext {
  const identity = payload.identity;
  const identityRoles = Array.isArray(identity?.roles)
    ? identity.roles.filter((value): value is string => typeof value === "string")
    : [];

  const role = resolveUserRoleFromIdentityRoles(identityRoles, fallbackRole);

  const userEmail = typeof identity?.email === "string" && identity.email.length > 0
    ? identity.email
    : undefined;

  const userName = typeof identity?.id === "string" && identity.id.length > 0
    ? identity.id === "anonymous"
      ? "Institution User"
      : identity.id
    : "Institution User";

  return {
    role,
    userName,
    userEmail,
  };
}
