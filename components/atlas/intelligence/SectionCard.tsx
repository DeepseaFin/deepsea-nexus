'use client';

import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowUpToLine,
  BadgeCheck,
  BarChart3,
  BellRing,
  BookOpenText,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CheckSquare,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileSearch,
  FileText,
  FileUp,
  FileWarning,
  FolderKanban,
  FolderOpen,
  Gauge,
  Gavel,
  GitBranch,
  Globe2,
  HandCoins,
  Handshake,
  History,
  Info,
  Landmark,
  Lightbulb,
  Network,
  PanelsTopLeft,
  RefreshCcw,
  Route,
  Scale,
  Search,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  Wallet,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

const iconRegistry = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  'arrow-up-right': ArrowUpRight,
  'arrow-up-to-line': ArrowUpToLine,
  'badge-check': BadgeCheck,
  'bar-chart-3': BarChart3,
  'bell-ring': BellRing,
  'book-open-text': BookOpenText,
  bot: Bot,
  'brain-circuit': BrainCircuit,
  'briefcase-business': BriefcaseBusiness,
  'building-2': Building2,
  'check-circle-2': CheckCircle2,
  'check-square': CheckSquare,
  'circle-dollar-sign': CircleDollarSign,
  'clipboard-check': ClipboardCheck,
  'clipboard-list': ClipboardList,
  'clock-3': Clock3,
  'file-check-2': FileCheck2,
  'file-search': FileSearch,
  'file-text': FileText,
  'file-up': FileUp,
  'file-warning': FileWarning,
  'folder-kanban': FolderKanban,
  'folder-open': FolderOpen,
  gauge: Gauge,
  gavel: Gavel,
  'git-branch': GitBranch,
  'globe-2': Globe2,
  'hand-coins': HandCoins,
  handshake: Handshake,
  history: History,
  info: Info,
  landmark: Landmark,
  lightbulb: Lightbulb,
  network: Network,
  'panels-top-left': PanelsTopLeft,
  'refresh-ccw': RefreshCcw,
  route: Route,
  scale: Scale,
  search: Search,
  'search-check': SearchCheck,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  'trending-up': TrendingUp,
  upload: Upload,
  'user-plus': UserPlus,
  users: Users,
  wallet: Wallet,
  workflow: Workflow,
} as const satisfies Record<string, LucideIcon>;

export type SectionCardIconKey = keyof typeof iconRegistry;

interface SectionCardProps {
  title: string;
  iconKey?: SectionCardIconKey;
  badge?: {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  iconKey,
  badge,
  action,
  children,
  className = '',
}) => {
  const Icon = iconKey ? iconRegistry[iconKey] : undefined;

  const badgeColors = {
    default: 'border border-slate-600 bg-slate-800/80 text-slate-200',
    success: 'border border-emerald-700/50 bg-emerald-900/40 text-emerald-200',
    warning: 'border border-amber-700/50 bg-amber-900/40 text-amber-200',
    error: 'border border-rose-700/50 bg-rose-900/40 text-rose-200',
    info: 'border border-cyan-700/50 bg-cyan-900/40 text-cyan-200',
  };

  return (
    <div
      className={`rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.28)] backdrop-blur-sm sm:p-7 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-cyan-300" />}
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                badgeColors[badge.variant || 'default']
              }`}
            >
              {badge.label}
            </span>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="rounded-full border border-cyan-700/40 bg-cyan-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200 transition-colors hover:bg-cyan-900/60"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SectionCard;
