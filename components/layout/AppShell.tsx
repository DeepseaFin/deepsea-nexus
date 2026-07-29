"use client";

import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import ProductShell, { iconForProductNavigation } from "@/components/product/ProductShell";
import type { ProductSidebarItem } from "@/components/product/ProductSidebar";
import type { WorkspaceSwitcherItem } from "@/components/product/WorkspaceSwitcher";
import PublicShell from "@/components/layout/PublicShell";
import { PUBLIC_PATHS } from "@/components/layout/publicNavigation";
import { getNavigationForRole } from "@/lib/design/navigation";
import { USER_ROLES, USER_ROLE_LABELS, type UserRole } from "@/lib/design/roles";

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
  const isPublicRoute = PUBLIC_PATHS.has(pathname);
  const [role, setRole] = useState<UserRole>("relationship_manager");

  const currentItem = useMemo(() => {
    const items = getNavigationForRole(role);
    return items.find((item) => pathname.startsWith(item.href));
  }, [pathname, role]);

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const generated = segments.map((segment, index) => ({
      label: toTitle(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    }));
    return [{ label: "Home", href: "/atlas/dashboard" }, ...generated];
  }, [pathname]);

  const sidebarItems = useMemo<readonly ProductSidebarItem[]>(() => {
    return getNavigationForRole(role).map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: iconForProductNavigation(item.icon),
    }));
  }, [role]);

  const workspaceItems = useMemo<readonly WorkspaceSwitcherItem[]>(
    () => [
      { workspaceId: "atlas", label: "ATLAS Workspace" },
      { workspaceId: "dnos", label: "DNOS Workspace" },
    ],
    [],
  );

  const pageTitle = currentItem?.label ?? toTitle(pathname.split("/").filter(Boolean).at(-1) ?? "workspace");
  const subtitle = `Role context: ${USER_ROLE_LABELS[role]}`;

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
        name: "Institution User",
        roleLabel: USER_ROLE_LABELS[role],
      }}
      userOptions={USER_ROLES.map((candidateRole) => ({
        id: candidateRole,
        label: `Switch to ${USER_ROLE_LABELS[candidateRole]}`,
        onSelect: () => setRole(candidateRole),
      }))}
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
