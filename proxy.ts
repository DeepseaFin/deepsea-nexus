import { NextResponse, type NextRequest } from 'next/server';
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

  const supabase = createSupabaseProxySessionClient({
    request,
    onCookiesToSet(cookiesToSet) {
      refreshedCookies.push(...cookiesToSet);
    },
  });

  const { data, error } = await supabase.auth.getUser();

  let finalResponse: NextResponse;

  if (error || !data.user) {
    finalResponse = NextResponse.redirect(toLoginRedirectUrl(request));
  } else {
    finalResponse = NextResponse.next({ request });
  }

  refreshedCookies.forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value, cookie.options);
  });

  return finalResponse;
}

export const config = {
  matcher: ['/atlas/:path*'],
};
