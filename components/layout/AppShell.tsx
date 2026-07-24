"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import CommandCenter from "@/components/command/CommandCenter";
import ActionBar from "@/components/ui/ActionBar";
import NotificationCenter from "@/components/layout/NotificationCenter";
import PageContainer, { type BreadcrumbItem } from "@/components/layout/PageContainer";
import SideNavigation from "@/components/layout/SideNavigation";
import TopNavigation from "@/components/layout/TopNavigation";
import UserMenu from "@/components/layout/UserMenu";
import { getNavigationForRole } from "@/lib/design/navigation";
import { USER_ROLE_LABELS, type UserRole } from "@/lib/design/roles";

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
  const [role, setRole] = useState<UserRole>("relationship_manager");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
        setNotificationOpen(false);
        setUserMenuOpen(false);
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const currentItem = useMemo(() => {
    const items = getNavigationForRole(role);
    return items.find((item) => pathname.startsWith(item.href));
  }, [pathname, role]);

  const breadcrumbs = useMemo<readonly BreadcrumbItem[]>(() => {
    const segments = pathname.split("/").filter(Boolean);
    const generated = segments.map((segment, index) => ({
      label: toTitle(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    }));
    return [{ label: "Home", href: "/atlas/dashboard" }, ...generated];
  }, [pathname]);

  const pageTitle = currentItem?.label ?? toTitle(pathname.split("/").filter(Boolean).at(-1) ?? "workspace");
  const subtitle = `Role context: ${USER_ROLE_LABELS[role]}`;

  return (
    <div className="min-h-screen bg-[#020916] text-slate-100">
      <TopNavigation
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleNotifications={() => {
          setNotificationOpen((open) => !open);
          setUserMenuOpen(false);
        }}
        onToggleUserMenu={() => {
          setUserMenuOpen((open) => !open);
          setNotificationOpen(false);
        }}
        onToggleSidebar={() => setMobileSidebarOpen((open) => !open)}
      />

      <div className="relative mx-auto flex w-full max-w-[1800px]">
        <SideNavigation
          role={role}
          pathname={pathname}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <section className="relative min-w-0 flex-1">
          <div className="absolute right-4 top-3 z-30 sm:right-6 lg:right-8">
            <div className="relative">
              <NotificationCenter open={notificationOpen} onClose={() => setNotificationOpen(false)} />
              <UserMenu
                open={userMenuOpen}
                currentRole={role}
                onRoleChange={setRole}
                onClose={() => setUserMenuOpen(false)}
              />
            </div>
          </div>

          <PageContainer
            title={pageTitle}
            subtitle={subtitle}
            breadcrumbs={breadcrumbs}
            actions={
              <ActionBar>
                <button
                  type="button"
                  onClick={() => setCommandPaletteOpen(true)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-600/40"
                >
                  Open Command Palette
                </button>
              </ActionBar>
            }
          >
            {children}
          </PageContainer>
        </section>
      </div>

      <CommandCenter open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  );
}
