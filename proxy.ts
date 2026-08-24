import { NextResponse, type NextRequest } from 'next/server';
import { hasPermission } from '@/lib/supabase/permissions';
import { isSupabaseApiRoute, isSupabasePublicAsset, isSupabaseStaticAsset } from '@/lib/supabase/middleware';
import {
  findRouteProtectionDefinition,
  isReleaseOneProtectedPath,
  RELEASE_1_ROUTE_PROTECTION_REGISTRY,
  resolveRouteProtectionLevel,
} from '@/lib/supabase/protection';
import { resolveServerRuntimeAuthContext } from '@/lib/supabase/runtimeAuth';
import { createSupabaseProxySessionClient, type SupabaseSessionCookieToSet } from '@/lib/supabase/serverSession';

function toLoginRedirectUrl(request: NextRequest): URL {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = '';
  loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return loginUrl;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const refreshedCookies: SupabaseSessionCookieToSet[] = [];
  const { pathname, search } = request.nextUrl;

  const supabase = createSupabaseProxySessionClient({
    request,
    onCookiesToSet(cookiesToSet) {
      refreshedCookies.push(...cookiesToSet);
    },
  });

  const { data, error } = await supabase.auth.getUser();

  if (isSupabaseApiRoute(pathname) || isSupabaseStaticAsset(pathname) || isSupabasePublicAsset(pathname)) {
    const response = NextResponse.next({ request });
    refreshedCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    return response;
  }

  const definition = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname,
    method: request.method,
  });

  if (!definition && !isReleaseOneProtectedPath(pathname)) {
    const response = NextResponse.next({ request });
    refreshedCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    return response;
  }

  if (!definition) {
    const response = new NextResponse('Forbidden', { status: 403 });
    refreshedCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    return response;
  }

  const runtime = await resolveServerRuntimeAuthContext({
    url: request.url,
    method: request.method,
    pathname,
    headers: request.headers,
    searchParams: new URLSearchParams(search),
  });

  const protectionLevel = resolveRouteProtectionLevel(definition, 'public');
  const requiredPermission = definition.metadata?.requiredPermission;

  if (protectionLevel !== 'public' && (!runtime.session.isAuthenticated || runtime.session.isExpired)) {
    const response = NextResponse.redirect(toLoginRedirectUrl(request));
    refreshedCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    return response;
  }

  if (requiredPermission && !hasPermission(runtime.permissions.granted, requiredPermission)) {
    const response = new NextResponse('Forbidden', { status: 403 });
    refreshedCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    return response;
  }

  const response = NextResponse.next({ request });
  refreshedCookies.forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  });

  if (error || !data.user) {
    return NextResponse.redirect(toLoginRedirectUrl(request));
  }

  return response;
}

export const config = {
  matcher: ['/atlas', '/atlas/:path*', '/executive', '/executive/:path*'],
};
