import { NextResponse } from 'next/server';
import { createSupabaseRouteSessionClient } from '@/lib/supabase/serverSession';

export async function POST(request: Request): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  const supabase = createSupabaseRouteSessionClient(request, response);

  await supabase.auth.signOut();

  return response;
}
