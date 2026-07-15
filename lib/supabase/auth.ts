import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseServerClientOptions } from '@/lib/supabase/types';

let authenticatedServerClient: SupabaseClient | null = null;

function resolveAuthenticatedServerCredentials(): { url: string; anonKey: string } {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase authentication configuration. Ensure SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC equivalents) are set.',
    );
  }

  return { url, anonKey };
}

function buildAuthorizationHeaders(accessToken?: string, headers?: HeadersInit): Record<string, string> {
  const resolvedHeaders = new Headers(headers);

  if (accessToken) {
    resolvedHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  return Object.fromEntries(resolvedHeaders.entries());
}

export function createAuthenticatedSupabaseServerClient(
  options: SupabaseServerClientOptions = {},
): SupabaseClient {
  const { url, anonKey } = resolveAuthenticatedServerCredentials();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: buildAuthorizationHeaders(options.accessToken, options.headers),
    },
  });
}

export function getAuthenticatedSupabaseServerClient(
  options: SupabaseServerClientOptions = {},
): SupabaseClient {
  if (options.accessToken || options.headers) {
    return createAuthenticatedSupabaseServerClient(options);
  }

  if (authenticatedServerClient) {
    return authenticatedServerClient;
  }

  authenticatedServerClient = createAuthenticatedSupabaseServerClient();
  return authenticatedServerClient;
}
