"use client";

import Link from "next/link";
import React from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Files,
  LayoutDashboard,
  PieChart,
  X,
} from "lucide-react";
import { getNavigationForRole, type NavigationIconKey } from "@/lib/design/navigation";
import type { UserRole } from "@/lib/design/roles";

const iconMap: Readonly<Record<NavigationIconKey, React.ComponentType<{ className?: string }>>> = {
  "layout-dashboard": LayoutDashboard,
  "building-2": Building2,
  "briefcase-business": BriefcaseBusiness,
  files: Files,
  "check-circle-2": CheckCircle2,
  "pie-chart": PieChart,
  "bar-chart-3": BarChart3,
};

export interface SideNavigationProps {
  readonly role: UserRole;
  readonly pathname: string;
  readonly mobileOpen: boolean;
  readonly onMobileClose: () => void;
}

function NavContent({ role, pathname, onNavigate }: {
  readonly role: UserRole;
  readonly pathname: string;
  readonly onNavigate?: () => void;
}) {
  const navItems = getNavigationForRole(role);

  return (
    <nav aria-label="Primary" className="space-y-1">
      {navItems.map((item) => {
        const Icon = iconMap[item.icon];
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
              active
                ? "border-cyan-700/40 bg-cyan-900/30 text-cyan-100"
                : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function SideNavigation({
  role,
  pathname,
  mobileOpen,
  onMobileClose,
}: SideNavigationProps) {
  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-slate-800/90 bg-[#040b15] lg:block">
        <div className="h-full px-4 py-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">Navigation</p>
          <NavContent role={role} pathname={pathname} />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className="h-full flex-1 bg-slate-950/70"
            onClick={onMobileClose}
            aria-label="Close navigation"
          />

          <aside className="h-full w-72 border-l border-slate-800 bg-[#040b15] p-4 shadow-[0_20px_45px_rgba(2,6,23,0.5)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Navigation</p>
              <button
                type="button"
                onClick={onMobileClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-300"
                aria-label="Close navigation panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavContent role={role} pathname={pathname} onNavigate={onMobileClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
