'use client';

import React from 'react';

interface ConfidenceBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined';
  showLabel?: boolean;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  score,
  size = 'md',
  variant = 'default',
  showLabel = true,
}) => {
  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'cyan';
    if (score >= 40) return 'amber';
    return 'rose';
  };

  const color = getColor(score);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const colorClasses = {
    emerald: {
      default: 'bg-emerald-900/30 text-emerald-200 border border-emerald-800',
      outlined: 'bg-transparent text-emerald-400 border border-emerald-400',
    },
    cyan: {
      default: 'bg-cyan-900/30 text-cyan-200 border border-cyan-800',
      outlined: 'bg-transparent text-cyan-400 border border-cyan-400',
    },
    amber: {
      default: 'bg-amber-900/30 text-amber-200 border border-amber-800',
      outlined: 'bg-transparent text-amber-400 border border-amber-400',
    },
    rose: {
      default: 'bg-rose-900/30 text-rose-200 border border-rose-800',
      outlined: 'bg-transparent text-rose-400 border border-rose-400',
    },
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-medium transition-colors ${
        sizeClasses[size]
      } ${colorClasses[color][variant]}`}
    >
      <span className="font-semibold">{score}%</span>
      {showLabel && <span className="hidden sm:inline capitalize">Confidence</span>}
    </div>
  );
};

export default ConfidenceBadge;
