'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
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
  icon: Icon,
  badge,
  action,
  children,
  className = '',
}) => {
  const badgeColors = {
    default: 'bg-slate-700 text-slate-200',
    success: 'bg-emerald-900 text-emerald-200',
    warning: 'bg-amber-900 text-amber-200',
    error: 'bg-rose-900 text-rose-200',
    info: 'bg-cyan-900 text-cyan-200',
  };

  return (
    <div
      className={`rounded-lg border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-cyan-400" />}
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                badgeColors[badge.variant || 'default']
              }`}
            >
              {badge.label}
            </span>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
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
