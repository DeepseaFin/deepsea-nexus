"use client";

import type { KeyboardEvent, ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import UIButton from "@/components/ui/Button";
import UICard from "@/components/ui/Card";

export interface ProductSidebarItem {
  readonly id: string;
  readonly label: string;
  readonly href?: string;
  readonly icon?: ReactNode;
  readonly badge?: string;
}

export interface ProductSidebarProps {
  readonly items: readonly ProductSidebarItem[];
  readonly activeItemId?: string;
  readonly collapsed?: boolean;
  readonly mobileOpen?: boolean;
  readonly onToggleCollapsed?: () => void;
  readonly onMobileClose?: () => void;
  readonly onSelectItem?: (itemId: string) => void;
}

function SidebarItemButton({
  item,
  active,
  collapsed,
  onSelect,
}: {
  readonly item: ProductSidebarItem;
  readonly active: boolean;
  readonly collapsed: boolean;
  readonly onSelect?: (itemId: string) => void;
}) {
  const className = `group flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm ds-motion ${
    active
      ? "border-cyan-700/50 bg-cyan-900/25 text-cyan-100"
      : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
  }`;

  const content = (
    <>
      <span className="inline-flex h-4 w-4 items-center justify-center text-slate-400 group-hover:text-slate-200">{item.icon}</span>
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
      {!collapsed && item.badge ? <span className="ml-auto text-xs text-slate-500">{item.badge}</span> : null}
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={className} onClick={() => onSelect?.(item.id)}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={() => onSelect?.(item.id)}>
      {content}
    </button>
  );
}

function SidebarContent({
  items,
  activeItemId,
  collapsed,
  onSelectItem,
}: {
  readonly items: readonly ProductSidebarItem[];
  readonly activeItemId?: string;
  readonly collapsed: boolean;
  readonly onSelectItem?: (itemId: string) => void;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    const target = event.target as HTMLElement;
    const current = target.closest("button, a");
    if (!current) {
      return;
    }

    const focusable = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>("button, a"),
    );
    const index = focusable.indexOf(current as HTMLElement);
    if (index < 0) {
      return;
    }

    event.preventDefault();

    if (event.key === "Home") {
      focusable[0]?.focus();
      return;
    }

    if (event.key === "End") {
      focusable[focusable.length - 1]?.focus();
      return;
    }

    const offset = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (index + offset + focusable.length) % focusable.length;
    focusable[nextIndex]?.focus();
  };

  return (
    <ul className="space-y-1" onKeyDown={onKeyDown}>
      {items.map((item) => (
        <li key={item.id}>
          <SidebarItemButton
            item={item}
            active={item.id === activeItemId}
            collapsed={collapsed}
            onSelect={onSelectItem}
          />
        </li>
      ))}
    </ul>
  );
}

export default function ProductSidebar({
  items,
  activeItemId,
  collapsed = false,
  mobileOpen = false,
  onToggleCollapsed,
  onMobileClose,
  onSelectItem,
}: ProductSidebarProps) {
  return (
    <>
      <aside className={`hidden shrink-0 border-r border-slate-800/90 bg-[#040b15] p-3 lg:block ${collapsed ? "w-20" : "w-72"}`}>
        <UICard variant="subtle" className="h-full p-2">
          <div className="mb-2 flex items-center justify-between">
            {!collapsed ? <p className="px-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">Navigation</p> : null}
            <UIButton size="sm" variant="ghost" onClick={onToggleCollapsed} aria-label="Toggle sidebar width">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </UIButton>
          </div>
          <SidebarContent items={items} activeItemId={activeItemId} collapsed={collapsed} onSelectItem={onSelectItem} />
        </UICard>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Sidebar navigation">
          <button type="button" className="h-full flex-1 bg-slate-950/70" onClick={onMobileClose} aria-label="Close sidebar" />

          <aside className="w-72 border-l border-slate-800 bg-[#040b15] p-3">
            <UICard variant="subtle" className="h-full p-2">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Navigation</p>
                <UIButton size="sm" variant="ghost" onClick={onMobileClose} aria-label="Close sidebar panel">
                  <X className="h-4 w-4" />
                </UIButton>
              </div>
              <SidebarContent
                items={items}
                activeItemId={activeItemId}
                collapsed={false}
                onSelectItem={(itemId) => {
                  onSelectItem?.(itemId);
                  onMobileClose?.();
                }}
              />
            </UICard>
          </aside>
        </div>
      ) : null}
    </>
  );
}
