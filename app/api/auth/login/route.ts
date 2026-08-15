import { NextResponse } from 'next/server';
import { createSupabaseRouteSessionClient } from '@/lib/supabase/serverSession';

interface LoginRequestBody {
  readonly email?: string;
  readonly password?: string;
}

function trimCredential(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readPassword(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: LoginRequestBody = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const email = trimCredential(body.email);
  const password = readPassword(body.password);

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  const supabase = createSupabaseRouteSessionClient(request, response);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: 'Authentication failed. Please verify your credentials.' }, { status: 401 });
  }

  return response;
}
