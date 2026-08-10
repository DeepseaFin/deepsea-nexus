import type {
  SupabaseAuthenticationContext,
  SupabaseAuthenticationContextInput,
  SupabaseAuthCookieAdapter,
  SupabaseAuthCookieNames,
  SupabaseSessionTokenPair,
} from '@/lib/supabase/auth';
import type {
  SupabaseAuthState,
  SupabasePrincipal,
  SupabaseSessionContext,
} from '@/lib/supabase/types';
import {
  createAnonymousSupabaseSessionContext,
  createSupabaseAuthenticationContext,
  extractSupabaseSessionTokens,
  isSupabaseAuthenticatedSession,
  resolveSupabaseAuthCookieNames,
} from '@/lib/supabase/auth';

export type SessionStatus = 'anonymous' | 'active' | 'expired' | 'unknown';

export interface SessionMetadata {
  readonly issuedAt?: string;
  readonly expiresAt?: string;
  readonly lastRefreshedAt?: string;
  readonly source?: 'cookie' | 'header' | 'server' | 'unknown';
}

export interface SessionSnapshot {
  readonly status: SessionStatus;
  readonly authState: SupabaseAuthState;
  readonly principal: SupabasePrincipal | null;
  readonly session: SupabaseSessionContext;
  readonly metadata: SessionMetadata;
  readonly expiresAtEpochMs?: number;
}

// SessionContext represents the authenticated runtime session boundary. It does not own institution, passport, relationship, or workflow business state.
export interface SessionContext {
  readonly snapshot: SessionSnapshot;
  readonly authentication: SupabaseAuthenticationContext;
  readonly isAuthenticated: boolean;
  readonly isExpired: boolean;
}

export interface SessionSnapshotInput {
  readonly session?: SupabaseSessionContext;
  readonly principal?: SupabasePrincipal | null;
  readonly metadata?: SessionMetadata;
  readonly auth?: Omit<SupabaseAuthenticationContextInput, 'session' | 'principal'>;
  readonly now?: Date;
}

function normalizeTimestamp(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return new Date(parsed).toISOString();
}

function toEpochMs(value?: string): number | undefined {
  const normalized = normalizeTimestamp(value);
  if (!normalized) {
    return undefined;
  }

  return Date.parse(normalized);
}

function resolveSessionExpiresAtEpochMs(
  session: SupabaseSessionContext,
  metadata: SessionMetadata,
): number | undefined {
  const metadataExpiry = toEpochMs(metadata.expiresAt);
  if (metadataExpiry !== undefined) {
    return metadataExpiry;
  }

  const sessionExpirySeconds = session.session?.expires_at;
  if (typeof sessionExpirySeconds === 'number' && Number.isFinite(sessionExpirySeconds)) {
    return sessionExpirySeconds * 1000;
  }

  return undefined;
}

export function normalizeSessionMetadata(input: SessionMetadata = {}): SessionMetadata {
  return Object.freeze({
    issuedAt: normalizeTimestamp(input.issuedAt),
    expiresAt: normalizeTimestamp(input.expiresAt),
    lastRefreshedAt: normalizeTimestamp(input.lastRefreshedAt),
    source: input.source ?? 'unknown',
  });
}

export function normalizeSessionTokenPair(tokens: SupabaseSessionTokenPair): SupabaseSessionTokenPair {
  const accessToken = tokens.accessToken?.trim();
  const refreshToken = tokens.refreshToken?.trim();

  return Object.freeze({
    accessToken: accessToken && accessToken.length > 0 ? accessToken : undefined,
    refreshToken: refreshToken && refreshToken.length > 0 ? refreshToken : undefined,
  });
}

export function extractNormalizedSessionTokens(
  cookies: SupabaseAuthCookieAdapter,
  cookieNames?: Partial<SupabaseAuthCookieNames>,
): SupabaseSessionTokenPair {
  const resolvedCookieNames = resolveSupabaseAuthCookieNames(cookieNames);
  return normalizeSessionTokenPair(extractSupabaseSessionTokens(cookies, resolvedCookieNames));
}

export function isSessionExpired(
  snapshot: Pick<SessionSnapshot, 'expiresAtEpochMs'>,
  now: Date = new Date(),
): boolean {
  if (snapshot.expiresAtEpochMs === undefined) {
    return false;
  }

  return snapshot.expiresAtEpochMs <= now.getTime();
}

export function resolveSessionStatus(
  session: SupabaseSessionContext,
  expiresAtEpochMs?: number,
  now: Date = new Date(),
): SessionStatus {
  if (session.authState === 'anonymous') {
    return 'anonymous';
  }

  if (session.authState === 'unknown') {
    return 'unknown';
  }

  if (expiresAtEpochMs !== undefined && expiresAtEpochMs <= now.getTime()) {
    return 'expired';
  }

  return 'active';
}

export function createSessionSnapshot(input: SessionSnapshotInput = {}): SessionSnapshot {
  const session = input.session ?? createAnonymousSupabaseSessionContext();
  const principal = input.principal ?? null;
  const metadata = normalizeSessionMetadata(input.metadata);
  const expiresAtEpochMs = resolveSessionExpiresAtEpochMs(session, metadata);
  const status = resolveSessionStatus(session, expiresAtEpochMs, input.now);

  return Object.freeze({
    status,
    authState: session.authState,
    principal,
    session,
    metadata,
    expiresAtEpochMs,
  });
}

export function createSessionContext(input: SessionSnapshotInput = {}): SessionContext {
  const snapshot = createSessionSnapshot(input);
  const authentication = createSupabaseAuthenticationContext({
    ...(input.auth ?? {}),
    session: snapshot.session,
    principal: snapshot.principal,
  });

  return Object.freeze({
    snapshot,
    authentication,
    isAuthenticated: isSupabaseAuthenticatedSession(snapshot.session),
    isExpired: isSessionExpired(snapshot, input.now),
  });
}

export function withSessionExpiration(
  snapshot: SessionSnapshot,
  expiresAt: string,
  now: Date = new Date(),
): SessionSnapshot {
  const metadata = normalizeSessionMetadata({
    ...snapshot.metadata,
    expiresAt,
  });
  const expiresAtEpochMs = toEpochMs(metadata.expiresAt);

  return Object.freeze({
    ...snapshot,
    metadata,
    expiresAtEpochMs,
    status: resolveSessionStatus(snapshot.session, expiresAtEpochMs, now),
  });
}
