'use client';

import React from 'react';

interface TrustScoreProps {
  score: number;
  maxScore?: number;
  label?: string;
  rating?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TrustScore: React.FC<TrustScoreProps> = ({
  score,
  maxScore = 100,
  label = 'Trust Score',
  rating,
  size = 'md',
}) => {
  const percentage = (score / maxScore) * 100;

  // Determine color and rating label based on score
  const getColorAndRating = (percentage: number) => {
    if (percentage >= 80) return { color: 'emerald', rating: 'Excellent' };
    if (percentage >= 60) return { color: 'cyan', rating: 'Good' };
    if (percentage >= 40) return { color: 'amber', rating: 'Fair' };
    return { color: 'rose', rating: 'Poor' };
  };

  const { color, rating: defaultRating } = getColorAndRating(percentage);

  const sizeClasses = {
    sm: { circle: 'h-24 w-24', text: 'text-lg', label: 'text-xs' },
    md: { circle: 'h-32 w-32', text: 'text-3xl', label: 'text-sm' },
    lg: { circle: 'h-40 w-40', text: 'text-4xl', label: 'text-base' },
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <svg
          className={`${sizeClasses[size].circle} transform -rotate-90`}
          viewBox="0 0 120 120"
        >
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(30, 41, 59, 0.5)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`text-${color}-400 transition-all duration-500 ease-out`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${sizeClasses[size].text} font-bold text-slate-100`}>
            {score}
          </div>
          <div className={`${sizeClasses[size].label} text-slate-400`}>
            {maxScore > 100 ? '' : '/ 100'}
          </div>
        </div>
      </div>

      {/* Label and Rating */}
      <div className="text-center">
        <p className="text-xs text-slate-400">{label}</p>
        <p className={`text-sm font-semibold text-${color}-300`}>
          {rating || defaultRating}
        </p>
      </div>
    </div>
  );
};

export default TrustScore;
