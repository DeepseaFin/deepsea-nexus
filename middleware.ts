import { NextResponse, type NextRequest } from 'next/server';
import { hasPermission } from '@/lib/supabase/permissions';
import { isSupabaseApiRoute, isSupabasePublicAsset, isSupabaseStaticAsset } from '@/lib/supabase/middleware';
import {
  findRouteProtectionDefinition,
  isReleaseOneProtectedPath,
  RELEASE_1_ROUTE_PROTECTION_REGISTRY,
  resolveRouteProtectionLevel,
} from '@/lib/supabase/protection';
import { resolveServerRuntimeAuthContext, type RuntimeAuthCookieAdapter } from '@/lib/supabase/runtimeAuth';

function createCookieAdapter(request: NextRequest): RuntimeAuthCookieAdapter {
  return {
    get(name: string): string | undefined {
      return request.cookies.get(name)?.value;
    },
  };
}

function toLoginRedirectUrl(request: NextRequest): URL {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = '';
  loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return loginUrl;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isSupabaseApiRoute(pathname) || isSupabaseStaticAsset(pathname) || isSupabasePublicAsset(pathname)) {
    return NextResponse.next();
  }

  const definition = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname,
    method: request.method,
  });

  if (!definition && !isReleaseOneProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!definition) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const runtime = await resolveServerRuntimeAuthContext({
    url: request.url,
    method: request.method,
    pathname,
    headers: request.headers,
    searchParams: new URLSearchParams(search),
    cookies: createCookieAdapter(request),
  });

  const protectionLevel = resolveRouteProtectionLevel(definition, 'public');

  if (protectionLevel !== 'public' && (!runtime.session.isAuthenticated || runtime.session.isExpired)) {
    return NextResponse.redirect(toLoginRedirectUrl(request));
  }

  const requiredPermission = definition.metadata?.requiredPermission;
  if (requiredPermission && !hasPermission(runtime.permissions.granted, requiredPermission)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/atlas', '/atlas/:path*', '/executive', '/executive/:path*'],
};
