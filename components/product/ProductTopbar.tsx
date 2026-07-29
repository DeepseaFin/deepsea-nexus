"use client";

import { Bell, Command, Menu, UserCircle2 } from "lucide-react";
import UIButton from "@/components/ui/Button";
import WorkspaceSwitcher, { type WorkspaceSwitcherItem } from "@/components/product/WorkspaceSwitcher";
import GlobalSearch from "@/components/product/GlobalSearch";

export interface ProductTopbarProps {
  readonly title?: string;
  readonly workspaceItems: readonly WorkspaceSwitcherItem[];
  readonly activeWorkspaceId?: string;
  readonly onWorkspaceChange?: (workspaceId: string) => void;
  readonly onOpenCommandPalette: () => void;
  readonly onToggleNotifications: () => void;
  readonly onToggleUserMenu: () => void;
  readonly onToggleMobileSidebar: () => void;
  readonly onSearch?: (value: string) => void;
}

export default function ProductTopbar({
  title = "Deepsea Nexus Product",
  workspaceItems,
  activeWorkspaceId,
  onWorkspaceChange,
  onOpenCommandPalette,
  onToggleNotifications,
  onToggleUserMenu,
  onToggleMobileSidebar,
  onSearch,
}: ProductTopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#050d18]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <UIButton size="sm" variant="ghost" onClick={onToggleMobileSidebar} className="lg:hidden" aria-label="Open sidebar">
          <Menu className="h-4 w-4" />
        </UIButton>

        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">{title}</p>
        </div>

        <WorkspaceSwitcher
          items={workspaceItems}
          activeWorkspaceId={activeWorkspaceId}
          onWorkspaceChange={onWorkspaceChange}
        />

        <div className="hidden min-w-0 flex-1 md:flex">
          <GlobalSearch onSearch={onSearch} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <UIButton size="sm" variant="ghost" onClick={onOpenCommandPalette} aria-label="Open command palette">
            <Command className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Command</span>
          </UIButton>

          <UIButton size="sm" variant="ghost" onClick={onToggleNotifications} aria-label="Open notifications">
            <Bell className="h-4 w-4" />
          </UIButton>

          <UIButton size="sm" variant="ghost" onClick={onToggleUserMenu} aria-label="Open user menu">
            <UserCircle2 className="h-4 w-4" />
          </UIButton>
        </div>
      </div>
    </header>
  );
}
