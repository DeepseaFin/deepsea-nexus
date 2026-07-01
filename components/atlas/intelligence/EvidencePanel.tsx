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
  evidence: Evidence[];
  title?: string;
}

const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  title = 'Supporting Evidence',
}) => {
  return (
    <SectionCard title={title}>
      <div className="space-y-3">
        {evidence.length === 0 ? (
          <p className="text-sm text-slate-400">No evidence available</p>
        ) : (
          evidence.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-3 hover:border-slate-700 transition-colors"
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
