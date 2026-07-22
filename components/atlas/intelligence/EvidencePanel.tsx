'use client';

import React from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';
import SectionCard from './SectionCard';
import ConfidenceBadge from './ConfidenceBadge';

interface Evidence {
  id: string;
  title: string;
  description: string;
  source: string;
  confidence: number;
}

interface EvidencePanelProps {
  evidence: readonly Evidence[];
  title?: string;
}

const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  title = 'Evidence',
}) => {
  return (
    <SectionCard
      title={title}
      icon={FileText}
      badge={{
        label: `${evidence.length} Items`,
        variant: 'default',
      }}
      action={{
        label: 'Action Placeholder',
        onClick: () => {},
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Institutional evidence artifacts supporting current journey-stage assessments and decisions.
      </p>
      <div className="space-y-3">
        {evidence.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
            <p className="text-sm font-medium text-slate-300">No evidence entries are currently available.</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Placeholder state</p>
          </div>
        ) : (
          evidence.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700"
            >
              <FileText className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-slate-200 text-sm line-clamp-1">
                    {item.title}
                  </h4>
                  <ConfidenceBadge score={item.confidence} size="sm" showLabel={false} />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <LinkIcon className="h-3 w-3" />
                  <span className="truncate">{item.source}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default EvidencePanel;
