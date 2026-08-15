"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProductShell, { iconForProductNavigation } from "@/components/product/ProductShell";
import type { ProductSidebarItem } from "@/components/product/ProductSidebar";
import type { WorkspaceSwitcherItem } from "@/components/product/WorkspaceSwitcher";
import PublicShell from "@/components/layout/PublicShell";
import { PUBLIC_PATHS } from "@/components/layout/publicNavigation";
import {
  createDefaultShellContext,
  resolveShellContextFromSessionPayload,
  type ShellContext,
} from "@/lib/application/shell/ShellContext";
import {
  getNavigationForRole,
  getNavigationHomeHrefForRole,
} from "@/lib/design/navigation";
import {
  USER_ROLE_LABELS,
} from "@/lib/design/roles";

export interface AppShellProps {
  readonly children: React.ReactNode;
}

function toTitle(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

  const currentItem = useMemo(() => {
    const items = getNavigationForRole(shellContext.role);

    const matchingItems = items.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
    if (matchingItems.length === 0) {
      return undefined;
    }

    return matchingItems.sort((left, right) => right.href.length - left.href.length)[0];
  }, [pathname, shellContext.role]);

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const generated = segments.map((segment, index) => ({
      label: toTitle(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    }));
    return [{ label: "Home", href: getNavigationHomeHrefForRole(shellContext.role) }, ...generated];
  }, [pathname, shellContext.role]);

  const sidebarItems = useMemo<readonly ProductSidebarItem[]>(() => {
    return getNavigationForRole(shellContext.role).map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: iconForProductNavigation(item.icon),
    }));
  }, [shellContext.role]);

  const workspaceItems = useMemo<readonly WorkspaceSwitcherItem[]>(
    () => [
      { workspaceId: "atlas", label: "ATLAS Workspace" },
      { workspaceId: "dnos", label: "DNOS Workspace" },
    ],
    [],
  );

  const pageTitle = currentItem?.label ?? toTitle(pathname.split("/").filter(Boolean).at(-1) ?? "workspace");
  const subtitle = `Role context: ${USER_ROLE_LABELS[shellContext.role]}`;

  if (isPublicRoute) {
    return <PublicShell>{children}</PublicShell>;
  }

  return (
    <ProductShell
      title={pageTitle}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      workspaceItems={workspaceItems}
      activeWorkspaceId={pathname.startsWith("/atlas") ? "atlas" : "dnos"}
      sidebarItems={sidebarItems}
      activeSidebarItemId={currentItem?.id}
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
      quickActions={[
        { actionId: "new-case", label: "New Case" },
        { actionId: "new-note", label: "New Note" },
      ]}
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
