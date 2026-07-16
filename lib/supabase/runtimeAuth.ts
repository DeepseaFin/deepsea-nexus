import type { Session, User } from '@supabase/supabase-js';
import {
  createAnonymousSupabaseSessionContext,
  createAuthenticatedSupabaseSessionContext,
  createSupabaseAuthenticationContext,
  resolveSupabaseAuthCookieNames,
} from '@/lib/supabase/auth';
import {
  createIdentityContext,
  createIdentityProfile,
  normalizeIdentityClaims,
  normalizeIdentityRoles,
  normalizeWorkspaceMemberships,
} from '@/lib/supabase/identity';
import { createPermissionContext } from '@/lib/supabase/permissions';
import { createRouteProtectionContext } from '@/lib/supabase/protection';
import { createSessionContext } from '@/lib/supabase/session';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { SupabasePrincipal, SupabaseRequestContext } from '@/lib/supabase/types';

export interface RuntimeAuthContext {
  readonly session: ReturnType<typeof createSessionContext>;
  readonly protection: ReturnType<typeof createRouteProtectionContext>;
  readonly identity: ReturnType<typeof createIdentityContext>;
  readonly permissions: ReturnType<typeof createPermissionContext>;
  readonly request: SupabaseRequestContext | null;
}

export interface RuntimeAuthCookieAdapter {
  get(name: string): string | undefined;
}

function extractRuntimeSessionTokens(cookies: RuntimeAuthCookieAdapter): {
  readonly accessToken?: string;
  readonly refreshToken?: string;
} {
  const cookieNames = resolveSupabaseAuthCookieNames();
  return Object.freeze({
    accessToken: cookies.get(cookieNames.accessToken),
    refreshToken: cookies.get(cookieNames.refreshToken),
  });
}

function toRequestContext(input: {
  readonly url: string;
  readonly method: string;
  readonly pathname: string;
  readonly headers: Headers;
  readonly searchParams: URLSearchParams;
}): SupabaseRequestContext {
  return Object.freeze({
    pathname: input.pathname,
    url: input.url,
    method: input.method,
    headers: new Headers(input.headers),
    searchParams: new URLSearchParams(input.searchParams.toString()),
  });
}

function toPrincipalFromUser(user: User | null): SupabasePrincipal | null {
  if (!user) {
    return null;
  }

  const appMetadata = user.app_metadata && typeof user.app_metadata === 'object'
    ? user.app_metadata as Record<string, unknown>
    : {};

  const role = typeof appMetadata.role === 'string' ? appMetadata.role : undefined;

  return Object.freeze({
    userId: user.id,
    email: user.email,
    role,
    metadata: Object.freeze({
      ...(user.user_metadata && typeof user.user_metadata === 'object'
        ? user.user_metadata as Record<string, unknown>
        : {}),
    }),
  });
}

function toIdentityProfileFromPrincipal(principal: SupabasePrincipal | null) {
  if (!principal) {
    return createIdentityProfile({
      identityId: 'anonymous',
      status: 'anonymous',
      type: 'unknown',
      claims: [],
      roles: [],
      memberships: [],
    });
  }

  const roles = normalizeIdentityRoles(principal.role ? [principal.role] : []);
  const metadata = principal.metadata ?? {};

  const workspaceMemberships = normalizeWorkspaceMemberships(
    Array.isArray(metadata.workspaces)
      ? metadata.workspaces.filter((value): value is string => typeof value === 'string')
      : [],
  );

  const claims = normalizeIdentityClaims(
    Array.isArray(metadata.claims)
      ? metadata.claims.filter((value): value is string => typeof value === 'string')
      : [],
  );

  return createIdentityProfile({
    identityId: principal.userId,
    status: 'identified',
    type: 'human',
    email: principal.email,
    roles,
    memberships: workspaceMemberships,
    claims,
  });
}

function toSessionContextFromAuthSession(input: {
  readonly authSession: Session | null;
  readonly user: User | null;
}) {
  if (!input.authSession?.access_token) {
    return createAnonymousSupabaseSessionContext();
  }

  return createAuthenticatedSupabaseSessionContext({
    accessToken: input.authSession.access_token,
    refreshToken: input.authSession.refresh_token,
    session: input.authSession,
    user: input.user ?? undefined,
  });
}

export async function resolveServerRuntimeAuthContext(input: {
  readonly url: string;
  readonly method: string;
  readonly pathname: string;
  readonly headers: Headers;
  readonly searchParams: URLSearchParams;
  readonly cookies: RuntimeAuthCookieAdapter;
}): Promise<RuntimeAuthContext> {
  const request = toRequestContext(input);
  const tokens = extractRuntimeSessionTokens(input.cookies);

  let authSessionContext = createAnonymousSupabaseSessionContext();
  let principal: SupabasePrincipal | null = null;

  if (tokens.accessToken) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(tokens.accessToken);

    if (!error && data.user) {
      const user = data.user;
      authSessionContext = createAuthenticatedSupabaseSessionContext({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
      });
      principal = toPrincipalFromUser(user);
    }
  }

  const authentication = createSupabaseAuthenticationContext({
    principal,
    request,
    session: authSessionContext,
  });

  const session = createSessionContext({
    principal,
    session: authentication.session,
    auth: {
      request,
    },
  });

  const protection = createRouteProtectionContext({
    request,
    authentication,
    session,
  });

  const identity = createIdentityContext({
    principal,
    session,
    protection,
    identity: toIdentityProfileFromPrincipal(principal),
    pathname: request.pathname,
  });

  const permissions = createPermissionContext({
    identity,
    session,
    protection,
    granted: identity.identity.claims,
  });

  return Object.freeze({
    session,
    protection,
    identity,
    permissions,
    request,
  });
}

export async function resolveBrowserRuntimeAuthContext(): Promise<RuntimeAuthContext> {
  const supabase = getSupabaseClient();
  const [{ data: sessionData }, { data: userData }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ]);

  const authSession = sessionData.session;
  const user = userData.user ?? authSession?.user ?? null;
  const principal = toPrincipalFromUser(user);
  const authSessionContext = toSessionContextFromAuthSession({
    authSession,
    user,
  });

  const authentication = createSupabaseAuthenticationContext({
    principal,
    session: authSessionContext,
    request: null,
  });

  const session = createSessionContext({
    principal,
    session: authentication.session,
    auth: {
      request: null,
    },
  });

  const protection = createRouteProtectionContext({
    request: null,
    authentication,
    session,
  });

  const identity = createIdentityContext({
    principal,
    session,
    protection,
    identity: toIdentityProfileFromPrincipal(principal),
    pathname: '/',
  });

  const permissions = createPermissionContext({
    identity,
    session,
    protection,
    granted: identity.identity.claims,
  });

  return Object.freeze({
    session,
    protection,
    identity,
    permissions,
    request: null,
  });
}
