'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import SectionCard from './SectionCard';
import { formatDateTime } from '@/lib/utils/formatters';

interface ExecutiveSummaryProps {
  summary: string;
  recommendation: 'approve' | 'conditional' | 'review' | 'reject';
  status: 'draft' | 'in-review' | 'completed';
  timestamp?: string;
  score?: number;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  summary,
  recommendation,
  status,
  timestamp,
  score,
}) => {
  const recommendationConfig = {
    approve: {
      icon: CheckCircle,
      label: 'Recommended for Approval',
      color: 'emerald',
      bg: 'bg-emerald-900/20 border-emerald-800',
    },
    conditional: {
      icon: AlertCircle,
      label: 'Conditional Approval',
      color: 'amber',
      bg: 'bg-amber-900/20 border-amber-800',
    },
    review: {
      icon: Clock,
      label: 'Requires Human Review',
      color: 'cyan',
      bg: 'bg-cyan-900/20 border-cyan-800',
    },
    reject: {
      icon: AlertCircle,
      label: 'Not Recommended',
      color: 'rose',
      bg: 'bg-rose-900/20 border-rose-800',
    },
  };

  const statusConfig = {
    draft: 'bg-slate-700 text-slate-200',
    'in-review': 'bg-cyan-900 text-cyan-200',
    completed: 'bg-emerald-900 text-emerald-200',
  };

  const config = recommendationConfig[recommendation];
  const RecommendIcon = config.icon;

  return (
    <SectionCard title="Executive Summary">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Status</span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusConfig[status]}`}>
            {status.replace('-', ' ')}
          </span>
        </div>

        {/* Summary Text */}
        <div className="rounded-lg bg-slate-800/50 p-4">
          <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
        </div>

        {/* Recommendation */}
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${config.bg}`}
        >
          <RecommendIcon className={`h-5 w-5 text-${config.color}-400 mt-0.5 flex-shrink-0`} />
          <div>
            <p className={`font-semibold text-${config.color}-300`}>{config.label}</p>
            {score !== undefined && (
              <p className="mt-1 text-xs text-slate-400">
                Intelligence Score: <span className="text-slate-200 font-medium">{score}%</span>
              </p>
            )}
          </div>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs text-slate-500">
            Generated: {formatDateTime(timestamp)}
          </p>
        )}
      </div>
    </SectionCard>
  );
};

export default ExecutiveSummary;
