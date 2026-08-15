import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { NextRequest, NextResponse } from 'next/server';

export interface SupabaseSessionCookie {
  readonly name: string;
  readonly value: string;
}

export interface SupabaseSessionCookieToSet {
  readonly name: string;
  readonly value: string;
  readonly options?: {
    readonly domain?: string;
    readonly path?: string;
    readonly maxAge?: number;
    readonly expires?: Date;
    readonly httpOnly?: boolean;
    readonly secure?: boolean;
    readonly sameSite?: 'lax' | 'strict' | 'none' | boolean;
  };
}

function resolveSessionCredentials(): { readonly url: string; readonly anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase session configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.',
    );
  }

  return { url, anonKey };
}

function parseCookieHeader(headerValue: string | null): SupabaseSessionCookie[] {
  if (!headerValue) {
    return [];
  }

  const cookies: SupabaseSessionCookie[] = [];

  for (const pair of headerValue.split(';')) {
    const [rawName, ...rest] = pair.split('=');
    const name = rawName?.trim();

    if (!name) {
      continue;
    }

    cookies.push({
      name,
      value: decodeURIComponent(rest.join('=').trim()),
    });
  }

  return cookies;
}

export function createSupabaseServerSessionClient(input: {
  readonly headers: Headers;
  readonly setCookies?: (cookiesToSet: SupabaseSessionCookieToSet[]) => void;
}): SupabaseClient {
  const { url, anonKey } = resolveSessionCredentials();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(input.headers.get('cookie'));
      },
      setAll(cookiesToSet) {
        input.setCookies?.(cookiesToSet);
      },
    },
  });
}

export function createSupabaseRouteSessionClient(request: Request, response: NextResponse): SupabaseClient {
  return createSupabaseServerSessionClient({
    headers: request.headers,
    setCookies(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    },
  });
}

export function createSupabaseMiddlewareSessionClient(request: NextRequest, response: NextResponse): SupabaseClient {
  const { url, anonKey } = resolveSessionCredentials();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

export function createSupabaseProxySessionClient(input: {
  readonly request: NextRequest;
  readonly onCookiesToSet?: (cookiesToSet: SupabaseSessionCookieToSet[]) => void;
}): SupabaseClient {
  const { url, anonKey } = resolveSessionCredentials();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return input.request.cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          input.request.cookies.set(name, value);
        });

        input.onCookiesToSet?.(cookiesToSet);
      },
    },
  });
}