'use client';

import React from 'react';
import { CheckCircle2, Clock, User, AlertCircle } from 'lucide-react';
import SectionCard from './SectionCard';

interface Action {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'in-progress' | 'completed';
}

interface ActionPanelProps {
  actions: Action[];
  title?: string;
  onActionClick?: (actionId: string) => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  actions,
  title = 'Required Actions',
  onActionClick,
}) => {
  const priorityConfig = {
    low: {
      badge: 'bg-slate-700 text-slate-200',
      border: 'border-slate-700',
      dot: 'bg-slate-400',
    },
    medium: {
      badge: 'bg-amber-900 text-amber-200',
      border: 'border-amber-800',
      dot: 'bg-amber-400',
    },
    high: {
      badge: 'bg-rose-900 text-rose-200',
      border: 'border-rose-800',
      dot: 'bg-rose-400',
    },
    critical: {
      badge: 'bg-red-900 text-red-200',
      border: 'border-red-800',
      dot: 'bg-red-400',
    },
  };

  const statusConfig = {
    pending: { icon: AlertCircle, color: 'text-slate-400' },
    'in-progress': { icon: Clock, color: 'text-cyan-400' },
    completed: { icon: CheckCircle2, color: 'text-emerald-400' },
  };

  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <SectionCard title={title}>
      {actions.length === 0 ? (
        <p className="text-sm text-slate-400">No actions required</p>
      ) : (
        <div className="space-y-3">
          {sortedActions.map((action) => {
            const priority = priorityConfig[action.priority];
            const status = action.status ? statusConfig[action.status] : undefined;
            const StatusIcon = status?.icon;
            const overdue = action.dueDate && isOverdue(action.dueDate);

            return (
              <div
                key={action.id}
                onClick={() => onActionClick?.(action.id)}
                className={`rounded-lg border ${priority.border} bg-slate-800/50 p-4 hover:bg-slate-800 transition-colors cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  {/* Priority Dot */}
                  <div className={`h-3 w-3 rounded-full ${priority.dot} mt-1 flex-shrink-0`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-slate-200 text-sm line-clamp-1">
                        {action.title}
                      </h4>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                          priority.badge
                        }`}
                      >
                        {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                      </span>
                    </div>

                    {action.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {action.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      {action.owner && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{action.owner}</span>
                        </div>
                      )}
                      {action.dueDate && (
                        <div className={`flex items-center gap-1 ${overdue ? 'text-rose-400' : ''}`}>
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(action.dueDate).toLocaleDateString()}
                            {overdue && ' (Overdue)'}
                          </span>
                        </div>
                      )}
                      {action.status && StatusIcon && (
                        <div className={`flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{action.status.replace('-', ' ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};

export default ActionPanel;
