import { NextResponse } from 'next/server';
import { resolveServerRuntimeAuthContext } from '@/lib/supabase/runtimeAuth';

function createCookieAdapter(request: Request) {
  const rawCookie = request.headers.get('cookie') ?? '';
  const cookieMap = new Map<string, string>();

  for (const pair of rawCookie.split(';')) {
    const [key, ...rest] = pair.split('=');
    const cookieName = key?.trim();

    if (!cookieName) {
      continue;
    }

    cookieMap.set(cookieName, decodeURIComponent(rest.join('=').trim()));
  }

  return {
    get(name: string): string | undefined {
      return cookieMap.get(name);
    },
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);

  const runtime = await resolveServerRuntimeAuthContext({
    url: request.url,
    method: request.method,
    pathname: url.pathname,
    headers: request.headers,
    searchParams: url.searchParams,
    cookies: createCookieAdapter(request),
  });

  return NextResponse.json({
    session: {
      status: runtime.session.snapshot.status,
      authState: runtime.session.snapshot.authState,
      isAuthenticated: runtime.session.isAuthenticated,
      isExpired: runtime.session.isExpired,
    },
    identity: {
      id: runtime.identity.identity.identityId,
      email: runtime.identity.principal?.email,
      status: runtime.identity.identity.status,
      type: runtime.identity.identity.type,
      roles: runtime.identity.identity.roles,
      memberships: runtime.identity.identity.memberships,
      claims: runtime.identity.identity.claims,
    },
    protection: {
      pathname: runtime.protection.normalizedPathname,
      method: runtime.protection.method,
      sessionStatus: runtime.protection.sessionStatus,
    },
    permissions: {
      granted: runtime.permissions.granted,
      totalDefinitions: runtime.permissions.definitions.length,
    },
  });
}
