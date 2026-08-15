import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DealProvider } from "@/components/atlas/common/DealContext";
import { SearchRegistryProvider } from "@/components/atlas/design-system/SearchRegistry";
import DNOSShell from "@/components/layout/DNOSShell";
import { resolveServerRuntimeAuthContext, type RuntimeAuthCookieAdapter } from "@/lib/supabase/runtimeAuth";

async function createCookieAdapter(): Promise<RuntimeAuthCookieAdapter> {
  const cookieStore = await cookies();

  return {
    get(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },
  };
}

export default async function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const requestCookies = await createCookieAdapter();
  const runtime = await resolveServerRuntimeAuthContext({
    url: "http://localhost/atlas",
    method: "GET",
    pathname: "/atlas",
    headers: requestHeaders,
    searchParams: new URLSearchParams(),
    cookies: requestCookies,
  });

  if (!runtime.session.isAuthenticated || runtime.session.isExpired) {
    redirect("/login?next=/atlas/institution-home");
  }

  return (
    <DealProvider>
      <SearchRegistryProvider>
        <DNOSShell>{children}</DNOSShell>
      </SearchRegistryProvider>
    </DealProvider>
  );
}