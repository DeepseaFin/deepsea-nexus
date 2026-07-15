import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

export type SupabaseRuntimeTarget = 'browser' | 'server' | 'middleware';

export type SupabaseAuthState = 'anonymous' | 'authenticated' | 'unknown';

export interface SupabasePrincipal {
  readonly userId: string;
  readonly email?: string;
  readonly role?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface SupabaseSessionContext {
  readonly authState: SupabaseAuthState;
  readonly accessToken?: string;
  readonly refreshToken?: string;
  readonly session?: Session;
  readonly user?: User;
}

export interface SupabaseRequestContext {
  readonly pathname: string;
  readonly url: string;
  readonly method: string;
  readonly headers: Headers;
  readonly searchParams: URLSearchParams;
}

export interface SupabaseClientContext {
  readonly runtimeTarget: SupabaseRuntimeTarget;
  readonly session: SupabaseSessionContext;
  readonly request: SupabaseRequestContext | null;
}

export interface SupabaseServerClientOptions {
  readonly accessToken?: string;
  readonly request?: SupabaseRequestContext;
  readonly headers?: HeadersInit;
}

export interface SupabaseMiddlewareContext {
  readonly pathname: string;
  readonly method: string;
  readonly isApiRoute: boolean;
  readonly isStaticAsset: boolean;
  readonly isPublicAsset: boolean;
  readonly headers: Headers;
  readonly searchParams: URLSearchParams;
}

export interface SupabaseMiddlewareHeadersInput {
  readonly source?: HeadersInit;
  readonly additions?: HeadersInit;
}

export interface SupabaseClientFactory {
  (): SupabaseClient;
}
