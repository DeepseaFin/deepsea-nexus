'use client';

import React from 'react';
import { TrendingUp, AlertCircle, Eye } from 'lucide-react';
import SectionCard from './SectionCard';

interface Finding {
  id: string;
  text: string;
  severity?: 'low' | 'medium' | 'high';
}

interface FindingsByCategory {
  strengths?: Finding[];
  observations?: Finding[];
  risks?: Finding[];
}

interface FindingsPanelProps {
  findings: FindingsByCategory;
}

const FindingsPanel: React.FC<FindingsPanelProps> = ({ findings }) => {
  const categoryConfig = {
    strengths: {
      title: 'Strengths',
      icon: TrendingUp,
      color: 'emerald',
      bg: 'bg-emerald-900/20 border-emerald-800',
      textColor: 'text-emerald-300',
    },
    observations: {
      title: 'Observations',
      icon: Eye,
      color: 'cyan',
      bg: 'bg-cyan-900/20 border-cyan-800',
      textColor: 'text-cyan-300',
    },
    risks: {
      title: 'Risks',
      icon: AlertCircle,
      color: 'rose',
      bg: 'bg-rose-900/20 border-rose-800',
      textColor: 'text-rose-300',
    },
  };

  const severityColors = {
    low: 'border-amber-800 bg-amber-900/20',
    medium: 'border-amber-700 bg-amber-900/40',
    high: 'border-rose-800 bg-rose-900/20',
  };

  const renderCategory = (
    key: keyof typeof categoryConfig,
    items: Finding[] | undefined
  ) => {
    if (!items || items.length === 0) return null;

    const config = categoryConfig[key];
    const Icon = config.icon;

    return (
      <div key={key} className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 text-${config.color}-400`} />
          <h4 className="font-semibold text-slate-200">{config.title}</h4>
          <span className="ml-auto text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
            {items.length}
          </span>
        </div>
        <div className="space-y-2 ml-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg border p-3 ${
                item.severity && key === 'risks'
                  ? severityColors[item.severity]
                  : `${config.bg}`
              }`}
            >
              <p className="text-sm text-slate-300">{item.text}</p>
              {item.severity && key === 'risks' && (
                <p className="mt-1 text-xs text-slate-400 capitalize">
                  Severity: <span className="font-medium">{item.severity}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasAnyFindings = 
    (findings.strengths && findings.strengths.length > 0) ||
    (findings.observations && findings.observations.length > 0) ||
    (findings.risks && findings.risks.length > 0);

  return (
    <SectionCard title="Findings">
      {!hasAnyFindings ? (
        <p className="text-sm text-slate-400">No findings available</p>
      ) : (
        <div className="space-y-6">
          {renderCategory('strengths', findings.strengths)}
          {renderCategory('observations', findings.observations)}
          {renderCategory('risks', findings.risks)}
        </div>
      )}
    </SectionCard>
  );
};

export default FindingsPanel;
