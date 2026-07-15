import type { SupabaseMiddlewareContext, SupabaseMiddlewareHeadersInput } from '@/lib/supabase/types';

const STATIC_ASSET_PATTERN = /\.(?:css|js|mjs|map|png|jpg|jpeg|gif|webp|svg|ico|txt|json|xml|woff2?)$/i;

function toHeaders(input?: HeadersInit): Headers {
  return new Headers(input);
}

export function cloneSupabaseMiddlewareHeaders(input: SupabaseMiddlewareHeadersInput = {}): Headers {
  const headers = toHeaders(input.source);
  if (input.additions) {
    for (const [key, value] of new Headers(input.additions).entries()) {
      headers.set(key, value);
    }
  }

  return headers;
}

export function normalizeSupabaseMiddlewarePath(pathname: string): string {
  if (!pathname.startsWith('/')) {
    return `/${pathname}`;
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function isSupabaseApiRoute(pathname: string): boolean {
  return normalizeSupabaseMiddlewarePath(pathname).startsWith('/api/');
}

export function isSupabasePublicAsset(pathname: string): boolean {
  const normalizedPath = normalizeSupabaseMiddlewarePath(pathname);
  return normalizedPath === '/' || normalizedPath === '/favicon.ico' || STATIC_ASSET_PATTERN.test(normalizedPath);
}

export function isSupabaseStaticAsset(pathname: string): boolean {
  return STATIC_ASSET_PATTERN.test(normalizeSupabaseMiddlewarePath(pathname));
}

export function createSupabaseMiddlewareContext(input: {
  readonly pathname: string;
  readonly method: string;
  readonly headers?: HeadersInit;
  readonly searchParams?: URLSearchParams | string;
}): SupabaseMiddlewareContext {
  const pathname = normalizeSupabaseMiddlewarePath(input.pathname);
  const searchParams = typeof input.searchParams === 'string'
    ? new URLSearchParams(input.searchParams)
    : input.searchParams ?? new URLSearchParams();

  return {
    pathname,
    method: input.method.toUpperCase(),
    isApiRoute: isSupabaseApiRoute(pathname),
    isStaticAsset: isSupabaseStaticAsset(pathname),
    isPublicAsset: isSupabasePublicAsset(pathname),
    headers: toHeaders(input.headers),
    searchParams,
  };
}

export function shouldSkipSupabaseMiddleware(context: SupabaseMiddlewareContext): boolean {
  return context.isStaticAsset || context.isPublicAsset || context.isApiRoute;
}
