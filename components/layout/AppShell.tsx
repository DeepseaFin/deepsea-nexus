"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProductShell from "@/components/product/ProductShell";
import type { WorkspaceSwitcherItem } from "@/components/product/WorkspaceSwitcher";
import PublicShell from "@/components/layout/PublicShell";
import { PUBLIC_PATHS } from "@/components/layout/publicNavigation";
import {
  createDefaultShellContext,
  resolveShellContextFromSessionPayload,
  type ShellContext,
} from "@/lib/application/shell/ShellContext";
import { createShellExperience } from "@/lib/application/shell/ShellExperience";
import { createShellNavigation } from "@/lib/application/shell/ShellNavigation";
import { USER_ROLE_LABELS } from "@/lib/design/roles";

export interface AppShellProps {
  readonly children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_PATHS.has(pathname);
  const [shellContext, setShellContext] = useState<ShellContext>(() => createDefaultShellContext());

  useEffect(() => {
    if (isPublicRoute) {
      return;
    }

    let cancelled = false;

    async function hydrateIdentityContext() {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (cancelled) {
          return;
        }

        setShellContext(resolveShellContextFromSessionPayload(payload));
      } catch {
        // Preserve shell defaults when session introspection is unavailable.
      }
    }

    void hydrateIdentityContext();

    return () => {
      cancelled = true;
    };
  }, [isPublicRoute]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  const shellNavigation = useMemo(
    () => createShellNavigation({ role: shellContext.role, pathname }),
    [pathname, shellContext.role],
  );

  const workspaceItems = useMemo<readonly WorkspaceSwitcherItem[]>(
    () => [
      { workspaceId: "atlas", label: "ATLAS Workspace" },
      { workspaceId: "dnos", label: "DNOS Workspace" },
    ],
    [],
  );

  const shellExperience = useMemo(
    () => createShellExperience({ pathname, currentItemLabel: shellNavigation.currentItem?.label, shellContext }),
    [pathname, shellContext, shellNavigation.currentItem?.label],
  );

  if (isPublicRoute) {
    return <PublicShell>{children}</PublicShell>;
  }

  return (
    <ProductShell
      title={shellExperience.title}
      subtitle={shellExperience.subtitle}
      breadcrumbs={shellNavigation.breadcrumbs}
      workspaceItems={workspaceItems}
      activeWorkspaceId={pathname.startsWith("/atlas") ? "atlas" : "dnos"}
      sidebarItems={shellNavigation.sidebarItems}
      activeSidebarItemId={shellNavigation.activeSidebarItemId}
      user={{
        name: shellContext.userName,
        roleLabel: USER_ROLE_LABELS[shellContext.role],
        email: shellContext.userEmail,
      }}
      userOptions={[
        {
          id: "sign-out",
          label: "Sign Out",
          onSelect: () => {
            void handleLogout();
          },
        },
      ]}
      quickActions={shellExperience.quickActions}
      notifications={[
        {
          id: "notif-1",
          title: "Approval queue updated",
          description: "Two items require compliance review in the current workspace.",
          timestampLabel: "2m ago",
          unread: true,
        },
        {
          id: "notif-2",
          title: "Portfolio snapshot refreshed",
          description: "Latest metrics are available in the reports section.",
          timestampLabel: "10m ago",
        },
      ]}
    >
      {children}
    </ProductShell>
  );
}
