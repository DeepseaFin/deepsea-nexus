"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, BriefcaseBusiness, Building2, CheckCircle2, Files, LayoutDashboard, PieChart } from "lucide-react";
import UICard from "@/components/ui/Card";
import Breadcrumbs, { type ProductBreadcrumbItem } from "@/components/product/Breadcrumbs";
import CommandPalette, { type CommandPaletteItem } from "@/components/product/CommandPalette";
import NotificationCenter, { type ProductNotificationItem } from "@/components/product/NotificationCenter";
import ProductSidebar, { type ProductSidebarItem } from "@/components/product/ProductSidebar";
import ProductTopbar from "@/components/product/ProductTopbar";
import QuickActions, { type QuickActionItem } from "@/components/product/QuickActions";
import UserMenu, { type ProductUserOption, type ProductUserSummary } from "@/components/product/UserMenu";
import type { WorkspaceSwitcherItem } from "@/components/product/WorkspaceSwitcher";

export interface ProductShellProps {
  readonly children: React.ReactNode;
  readonly title?: string;
  readonly subtitle?: string;
  readonly breadcrumbs?: readonly ProductBreadcrumbItem[];
  readonly workspaceItems: readonly WorkspaceSwitcherItem[];
  readonly activeWorkspaceId?: string;
  readonly onWorkspaceChange?: (workspaceId: string) => void;
  readonly sidebarItems: readonly ProductSidebarItem[];
  readonly activeSidebarItemId?: string;
  readonly onSidebarSelect?: (itemId: string) => void;
  readonly quickActions?: readonly QuickActionItem[];
  readonly notifications?: readonly ProductNotificationItem[];
  readonly user: ProductUserSummary;
  readonly userOptions?: readonly ProductUserOption[];
  readonly commandItems?: readonly CommandPaletteItem[];
  readonly onSearch?: (value: string) => void;
}

export function iconForProductNavigation(icon: "layout-dashboard" | "building-2" | "briefcase-business" | "files" | "check-circle-2" | "pie-chart" | "bar-chart-3") {
  if (icon === "layout-dashboard") {
    return <LayoutDashboard className="h-4 w-4" />;
  }

  if (icon === "building-2") {
    return <Building2 className="h-4 w-4" />;
  }

  if (icon === "briefcase-business") {
    return <BriefcaseBusiness className="h-4 w-4" />;
  }

  if (icon === "files") {
    return <Files className="h-4 w-4" />;
  }

  if (icon === "check-circle-2") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (icon === "pie-chart") {
    return <PieChart className="h-4 w-4" />;
  }

  return <BarChart3 className="h-4 w-4" />;
}

export default function ProductShell({
  children,
  title = "Workspace",
  subtitle,
  breadcrumbs = [],
  workspaceItems,
  activeWorkspaceId,
  onWorkspaceChange,
  sidebarItems,
  activeSidebarItemId,
  onSidebarSelect,
  quickActions = [],
  notifications = [],
  user,
  userOptions = [],
  commandItems,
  onSearch,
}: ProductShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const effectiveCommandItems = useMemo<readonly CommandPaletteItem[]>(() => {
    if (commandItems && commandItems.length > 0) {
      return commandItems;
    }

    return sidebarItems.map((item) => ({
      id: `nav:${item.id}`,
      label: item.label,
      hint: item.href,
      onSelect: () => onSidebarSelect?.(item.id),
    }));
  }, [commandItems, onSidebarSelect, sidebarItems]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className="min-h-screen ds-surface-base">
      <ProductTopbar
        title="Deepsea Nexus Product"
        workspaceItems={workspaceItems}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceChange={onWorkspaceChange}
        onOpenCommandPalette={() => setCommandOpen(true)}
        onToggleNotifications={() => {
          setNotificationsOpen((open) => !open);
          setUserMenuOpen(false);
        }}
        onToggleUserMenu={() => {
          setUserMenuOpen((open) => !open);
          setNotificationsOpen(false);
        }}
        onToggleMobileSidebar={() => setMobileSidebarOpen((open) => !open)}
        onSearch={onSearch}
      />

      <div className="relative mx-auto flex w-full max-w-[1800px]">
        <ProductSidebar
          items={sidebarItems}
          activeItemId={activeSidebarItemId}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
          onMobileClose={() => setMobileSidebarOpen(false)}
          onSelectItem={onSidebarSelect}
        />

        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="relative">
            <div className="absolute right-0 top-0 z-30">
              <NotificationCenter
                open={notificationsOpen}
                items={notifications}
                onClose={() => setNotificationsOpen(false)}
              />
              <UserMenu open={userMenuOpen} user={user} options={userOptions} onClose={() => setUserMenuOpen(false)} />
            </div>
          </div>

          <UICard variant="subtle" className="p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <Breadcrumbs items={breadcrumbs} />
                <h1 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
              </div>

              <QuickActions actions={quickActions} />
            </div>

            <div>{children}</div>
          </UICard>
        </section>
      </div>

      <CommandPalette open={commandOpen} items={effectiveCommandItems} onOpenChange={setCommandOpen} />
    </div>
  );
}
