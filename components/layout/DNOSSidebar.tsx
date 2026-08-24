'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronsLeftRight,
  Files,
  LayoutDashboard,
  PieChart,
} from 'lucide-react';
import { getNavigationForRole, type NavigationIconKey } from '@/lib/design/navigation';
import type { UserRole } from '@/lib/design/roles';

const iconMap: Readonly<Record<NavigationIconKey, React.ComponentType<{ className?: string }>>> = {
  'layout-dashboard': LayoutDashboard,
  'building-2': Building2,
  'briefcase-business': BriefcaseBusiness,
  files: Files,
  'check-circle-2': CheckCircle2,
  'pie-chart': PieChart,
  'bar-chart-3': BarChart3,
};

export interface DNOSSidebarProps {
  readonly role?: UserRole;
}

export default function DNOSSidebar({ role = 'executive' }: DNOSSidebarProps) {
  const pathname = usePathname();
  const navigation = getNavigationForRole(role);

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-800/90 bg-[#040b15] lg:flex lg:flex-col">
      <div className="border-b border-slate-800/90 px-4 py-5">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-900/40 text-sm font-bold tracking-[0.18em] text-cyan-200">
              DN
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Deepsea / DNOS</p>
              <p className="text-xs text-slate-400">Institutional Application Shell</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300"
          >
            <ChevronsLeftRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">Navigation</p>
        <nav aria-label="DNOS navigation" className="space-y-1">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                  active
                    ? 'border-cyan-700/40 bg-cyan-900/30 text-cyan-100'
                    : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
