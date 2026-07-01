'use client';

import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import SectionCard from './SectionCard';
import ConfidenceBadge from './ConfidenceBadge';

interface RecommendationPanelProps {
  recommendation: 'approve' | 'conditional' | 'reject';
  reasons: string[];
  confidence: number;
  onApprove?: () => void;
  onReject?: () => void;
  onConditions?: () => void;
  isLoading?: boolean;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendation,
  reasons,
  confidence,
  onApprove,
  onReject,
  onConditions,
  isLoading = false,
}) => {
  const recommendationConfig = {
    approve: {
      icon: CheckCircle,
      label: 'Approve',
      description: 'Ready for approval',
      color: 'emerald',
      bgButton: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    conditional: {
      icon: AlertCircle,
      label: 'Conditional',
      description: 'Approval with conditions',
      color: 'amber',
      bgButton: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    reject: {
      icon: XCircle,
      label: 'Reject',
      description: 'Not recommended',
      color: 'rose',
      bgButton: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
  };

  const config = recommendationConfig[recommendation];
  const Icon = config.icon;

  return (
    <SectionCard title="Recommendation">
      <div className="space-y-6">
        {/* Recommendation Header */}
        <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-4">
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 text-${config.color}-400`} />
            <div>
              <p className={`font-semibold text-${config.color}-300`}>{config.label}</p>
              <p className="text-xs text-slate-400">{config.description}</p>
            </div>
          </div>
          <ConfidenceBadge score={confidence} />
        </div>

        {/* Reasons */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-200">Supporting Reasons</h4>
          <ul className="space-y-2">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
          {recommendation === 'approve' && onApprove && (
            <button
              onClick={onApprove}
              disabled={isLoading}
              className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                config.bgButton
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : 'Approve'}
            </button>
          )}
          {recommendation === 'conditional' && onConditions && (
            <button
              onClick={onConditions}
              disabled={isLoading}
              className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                config.bgButton
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : 'Review Conditions'}
            </button>
          )}
          {recommendation === 'reject' && onReject && (
            <button
              onClick={onReject}
              disabled={isLoading}
              className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                config.bgButton
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : 'Acknowledge'}
            </button>
          )}
          <button className="flex-1 rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            Request Review
          </button>
        </div>
      </div>
    </SectionCard>
  );
};

export default RecommendationPanel;
