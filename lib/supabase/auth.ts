import type {
  SupabaseAuthState,
  SupabasePrincipal,
  SupabaseRequestContext,
  SupabaseSessionContext,
} from '@/lib/supabase/types';

export interface SupabaseAuthCookieNames {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface SupabaseAuthCookieValue {
  readonly name: string;
  readonly value: string;
}

export interface SupabaseAuthCookieAdapter {
  get(name: string): string | undefined;
  set(name: string, value: string, options?: { readonly path?: string; readonly httpOnly?: boolean; readonly secure?: boolean; readonly sameSite?: 'lax' | 'strict' | 'none'; readonly maxAge?: number }): void;
  delete(name: string): void;
}

export interface SupabaseAuthenticationContext {
  readonly principal: SupabasePrincipal | null;
  readonly session: SupabaseSessionContext;
  readonly request: SupabaseRequestContext | null;
  readonly authState: SupabaseAuthState;
  readonly cookieNames: SupabaseAuthCookieNames;
}

export interface SupabaseAuthenticationContextInput {
  readonly principal?: SupabasePrincipal | null;
  readonly session?: SupabaseSessionContext;
  readonly request?: SupabaseRequestContext | null;
  readonly cookieNames?: Partial<SupabaseAuthCookieNames>;
}

export interface SupabaseSessionTokenPair {
  readonly accessToken?: string;
  readonly refreshToken?: string;
}

const DEFAULT_COOKIE_NAMES: SupabaseAuthCookieNames = Object.freeze({
  accessToken: 'sb-access-token',
  refreshToken: 'sb-refresh-token',
});

export function resolveSupabaseAuthCookieNames(
  cookieNames: Partial<SupabaseAuthCookieNames> = {},
): SupabaseAuthCookieNames {
  return Object.freeze({
    accessToken: cookieNames.accessToken ?? DEFAULT_COOKIE_NAMES.accessToken,
    refreshToken: cookieNames.refreshToken ?? DEFAULT_COOKIE_NAMES.refreshToken,
  });
}

export function normalizeSupabaseAuthState(
  session?: SupabaseSessionContext,
): SupabaseAuthState {
  if (!session) {
    return 'unknown';
  }

  return session.authState;
}

export function createAnonymousSupabaseSessionContext(): SupabaseSessionContext {
  return Object.freeze({
    authState: 'anonymous',
  });
}

export function createAuthenticatedSupabaseSessionContext(
  input: SupabaseSessionTokenPair & Partial<SupabaseSessionContext>,
): SupabaseSessionContext {
  return Object.freeze({
    authState: 'authenticated',
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
    session: input.session,
    user: input.user,
  });
}

export function createSupabaseAuthenticationContext(
  input: SupabaseAuthenticationContextInput = {},
): SupabaseAuthenticationContext {
  const session = input.session ?? createAnonymousSupabaseSessionContext();

  return Object.freeze({
    principal: input.principal ?? null,
    session,
    request: input.request ?? null,
    authState: normalizeSupabaseAuthState(session),
    cookieNames: resolveSupabaseAuthCookieNames(input.cookieNames),
  });
}

export function extractSupabaseSessionTokens(
  cookies: SupabaseAuthCookieAdapter,
  cookieNames: SupabaseAuthCookieNames = DEFAULT_COOKIE_NAMES,
): SupabaseSessionTokenPair {
  return {
    accessToken: cookies.get(cookieNames.accessToken),
    refreshToken: cookies.get(cookieNames.refreshToken),
  };
}

export function applySupabaseSessionTokens(
  cookies: SupabaseAuthCookieAdapter,
  tokens: SupabaseSessionTokenPair,
  cookieNames: SupabaseAuthCookieNames = DEFAULT_COOKIE_NAMES,
): void {
  if (tokens.accessToken) {
    cookies.set(cookieNames.accessToken, tokens.accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }

  if (tokens.refreshToken) {
    cookies.set(cookieNames.refreshToken, tokens.refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }
}

export function clearSupabaseSessionTokens(
  cookies: SupabaseAuthCookieAdapter,
  cookieNames: SupabaseAuthCookieNames = DEFAULT_COOKIE_NAMES,
): void {
  cookies.delete(cookieNames.accessToken);
  cookies.delete(cookieNames.refreshToken);
}

export function isSupabaseAuthenticatedSession(
  session: SupabaseSessionContext | null | undefined,
): session is SupabaseSessionContext & { readonly authState: 'authenticated' } {
  return session?.authState === 'authenticated';
}
