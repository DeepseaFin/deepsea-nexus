"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BrainCircuit,
  GitBranch,
  ShieldCheck,
  Gavel,
  BellRing,
  Sparkles,
  Briefcase,
  Files,
  ListTodo,
  Wallet,
  HandCoins,
  Building2,
  Landmark,
  Users,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Intelligence",
    href: "/atlas/intelligence",
    icon: BrainCircuit,
  },
  {
    title: "Dashboard",
    href: "/atlas/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Origination",
    href: "/atlas/origination",
    icon: Sparkles,
  },
  {
    title: "Deals",
    href: "/atlas/deals",
    icon: Briefcase,
  },
  {
    title: "Documents",
    href: "/atlas/documents",
    icon: Files,
  },
  {
    title: "Relationship Graph",
    href: "/atlas/relationship-graph",
    icon: GitBranch,
  },
  {
    title: "Relationship Intelligence",
    href: "/atlas/relationship-intelligence",
    icon: GitBranch,
  },
  {
    title: "Identity & Access",
    href: "/atlas/identity-access",
    icon: ShieldCheck,
  },
  {
    title: "Approval Center",
    href: "/atlas/approval-center",
    icon: Gavel,
  },
  {
    title: "Notification Center",
    href: "/atlas/notification-center",
    icon: BellRing,
  },
  {
    title: "Work Queue",
    href: "/atlas/work-queue",
    icon: ListTodo,
  },
  {
    title: "Treasury",
    href: "/atlas/treasury",
    icon: Wallet,
  },
  {
    title: "Collections",
    href: "/atlas/collections",
    icon: HandCoins,
  },
  {
    title: "Clients",
    href: "/atlas/clients",
    icon: Building2,
  },
  {
    title: "Counterparties",
    href: "/atlas/counterparties",
    icon: Landmark,
  },
  {
    title: "Partners",
    href: "/atlas/partners",
    icon: Users,
  },
  {
    title: "Term Sheets",
    href: "/atlas/term-sheets",
    icon: FileText,
  },
  {
    title: "Reports",
    href: "/atlas/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/atlas/settings",
    icon: Settings,
  },
];

export default function AtlasSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#07111F] border-r border-slate-800 min-h-screen">

      <div className="p-8 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-cyan-400">
          ATLAS
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Deepsea Nexus Operating System
        </p>

      </div>

      <nav className="mt-6 px-4">

        {menu.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (

            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-5 py-4 mb-2 transition-all duration-300 ${
                active
                  ? "bg-cyan-500 text-black font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
              }`}
            >

              <Icon size={22} />

              <span>{item.title}</span>

            </Link>

          );
        })}

      </nav>

    </aside>
  );
}