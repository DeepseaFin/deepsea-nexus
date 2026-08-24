import { normalizeSupabaseMiddlewarePath } from '@/lib/supabase/middleware';
import type { RouteProtectionContext } from '@/lib/supabase/protection';
import type { SessionContext } from '@/lib/supabase/session';
import type { SupabasePrincipal } from '@/lib/supabase/types';

export type IdentityStatus = 'anonymous' | 'identified' | 'suspended' | 'unknown';

export type IdentityType = 'human' | 'service' | 'system' | 'unknown';

export type IdentityRole =
  | 'PLATFORM_ADMIN'
  | 'EXECUTIVE'
  | 'RELATIONSHIP_MANAGER'
  | 'TREASURY'
  | 'OPERATIONS'
  | 'COMPLIANCE'
  | 'VIEWER'
  | 'SYSTEM';

export type WorkspaceMembership =
  | 'Institution'
  | 'Commercial'
  | 'Executive'
  | 'Treasury'
  | 'Forfaiting'
  | 'Oracle'
  | 'Dashboard';

export type IdentityClaim = string;

export interface IdentityProfile {
  readonly identityId: string;
  readonly status: IdentityStatus;
  readonly type: IdentityType;
  readonly displayName?: string;
  readonly email?: string;
  readonly roles: readonly IdentityRole[];
  readonly claims: readonly IdentityClaim[];
  readonly memberships: readonly WorkspaceMembership[];
  readonly metadata: Readonly<Record<string, string>>;
}

// IdentityContext captures the authenticated actor's runtime identity and access posture. It is not an institution-domain container.
export interface IdentityContext {
  readonly identity: IdentityProfile;
  readonly principal: SupabasePrincipal | null;
  readonly session: SessionContext | null;
  readonly protection: RouteProtectionContext | null;
  readonly normalizedPathname: string;
}

const IDENTITY_ROLES: readonly IdentityRole[] = Object.freeze([
  'PLATFORM_ADMIN',
  'EXECUTIVE',
  'RELATIONSHIP_MANAGER',
  'TREASURY',
  'OPERATIONS',
  'COMPLIANCE',
  'VIEWER',
  'SYSTEM',
]);

const WORKSPACE_MEMBERSHIPS: readonly WorkspaceMembership[] = Object.freeze([
  'Institution',
  'Commercial',
  'Executive',
  'Treasury',
  'Forfaiting',
  'Oracle',
  'Dashboard',
]);

const IDENTITY_STATUS_VALUES: readonly IdentityStatus[] = Object.freeze([
  'anonymous',
  'identified',
  'suspended',
  'unknown',
]);

const IDENTITY_TYPE_VALUES: readonly IdentityType[] = Object.freeze([
  'human',
  'service',
  'system',
  'unknown',
]);

function freezeStrings(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)]);
}

function toIdentityRole(value: string): IdentityRole | null {
  return IDENTITY_ROLES.find((role) => role === value) ?? null;
}

function toWorkspaceMembership(value: string): WorkspaceMembership | null {
  return WORKSPACE_MEMBERSHIPS.find((membership) => membership === value) ?? null;
}

function normalizeClaim(value: string): IdentityClaim | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function listIdentityRoles(): readonly IdentityRole[] {
  return IDENTITY_ROLES;
}

export function listWorkspaceMemberships(): readonly WorkspaceMembership[] {
  return WORKSPACE_MEMBERSHIPS;
}

export function normalizeIdentityStatus(status?: IdentityStatus | string): IdentityStatus {
  if (!status) {
    return 'unknown';
  }

  const normalized = status.trim().toLowerCase();
  return IDENTITY_STATUS_VALUES.find((value) => value === normalized) ?? 'unknown';
}

export function normalizeIdentityType(type?: IdentityType | string): IdentityType {
  if (!type) {
    return 'unknown';
  }

  const normalized = type.trim().toLowerCase();
  return IDENTITY_TYPE_VALUES.find((value) => value === normalized) ?? 'unknown';
}

export function normalizeIdentityRoles(roles: readonly string[] = []): readonly IdentityRole[] {
  const normalized = roles
    .map((role) => toIdentityRole(role.trim().toUpperCase()))
    .filter((role): role is IdentityRole => role !== null);

  return Object.freeze([...new Set(normalized)]);
}

export function normalizeWorkspaceMemberships(
  memberships: readonly string[] = [],
): readonly WorkspaceMembership[] {
  const normalized = memberships
    .map((membership) => toWorkspaceMembership(membership.trim()))
    .filter((membership): membership is WorkspaceMembership => membership !== null);

  return Object.freeze([...new Set(normalized)]);
}

export function normalizeIdentityClaims(claims: readonly string[] = []): readonly IdentityClaim[] {
  const normalized = claims
    .map((claim) => normalizeClaim(claim))
    .filter((claim): claim is IdentityClaim => claim !== null);

  return Object.freeze([...new Set(normalized)]);
}

export function createAnonymousIdentityProfile(): IdentityProfile {
  return Object.freeze({
    identityId: 'anonymous',
    status: 'anonymous',
    type: 'unknown',
    roles: Object.freeze([]),
    claims: Object.freeze([]),
    memberships: Object.freeze([]),
    metadata: Object.freeze({}),
  });
}

export function createIdentityProfile(input: {
  readonly identityId: string;
  readonly status?: IdentityStatus | string;
  readonly type?: IdentityType | string;
  readonly displayName?: string;
  readonly email?: string;
  readonly roles?: readonly string[];
  readonly claims?: readonly string[];
  readonly memberships?: readonly string[];
  readonly metadata?: Readonly<Record<string, string>>;
}): IdentityProfile {
  const identityId = input.identityId.trim();

  return Object.freeze({
    identityId: identityId.length > 0 ? identityId : 'unknown',
    status: normalizeIdentityStatus(input.status),
    type: normalizeIdentityType(input.type),
    displayName: input.displayName?.trim() || undefined,
    email: input.email?.trim() || undefined,
    roles: normalizeIdentityRoles(input.roles),
    claims: normalizeIdentityClaims(input.claims),
    memberships: normalizeWorkspaceMemberships(input.memberships),
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
  });
}

export function createIdentityProfileFromPrincipal(
  principal: SupabasePrincipal | null | undefined,
): IdentityProfile {
  if (!principal) {
    return createAnonymousIdentityProfile();
  }

  return createIdentityProfile({
    identityId: principal.userId,
    status: 'identified',
    type: 'human',
    email: principal.email,
    roles: principal.role ? [principal.role] : [],
    metadata: Object.freeze(
      Object.fromEntries(
        Object.entries(principal.metadata ?? {}).filter(([, value]) => typeof value === 'string') as [string, string][],
      ),
    ),
  });
}

export function hasIdentityRole(identity: IdentityProfile, role: IdentityRole): boolean {
  return identity.roles.includes(role);
}

export function hasWorkspaceMembership(identity: IdentityProfile, membership: WorkspaceMembership): boolean {
  return identity.memberships.includes(membership);
}

export function hasIdentityClaim(identity: IdentityProfile, claim: IdentityClaim): boolean {
  const normalized = normalizeClaim(claim);
  return normalized ? identity.claims.includes(normalized) : false;
}

export function createIdentityContext(input: {
  readonly identity?: IdentityProfile;
  readonly principal?: SupabasePrincipal | null;
  readonly session?: SessionContext | null;
  readonly protection?: RouteProtectionContext | null;
  readonly pathname?: string;
}): IdentityContext {
  const principal = input.principal ?? null;
  const identity = input.identity ?? createIdentityProfileFromPrincipal(principal);
  const normalizedPathname = normalizeSupabaseMiddlewarePath(input.pathname ?? input.protection?.normalizedPathname ?? '/');

  return Object.freeze({
    identity,
    principal,
    session: input.session ?? null,
    protection: input.protection ?? null,
    normalizedPathname,
  });
}

export function mergeIdentityClaims(
  baseClaims: readonly IdentityClaim[],
  additionalClaims: readonly IdentityClaim[],
): readonly IdentityClaim[] {
  return freezeStrings([...baseClaims, ...additionalClaims]) as readonly IdentityClaim[];
}
