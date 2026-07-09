'use client';

import { Bot, Clock3, FileText, Star, ShieldAlert } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

export type WorkspaceDoc = {
  id: string;
  name: string;
  status: 'Needs Review' | 'AI Queue' | 'Expiring';
  updatedAt: string;
};

type LeftSidebarProps = {
  documents: WorkspaceDoc[];
  favorites: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function statusTone(status: WorkspaceDoc['status']): string {
  if (status === 'Needs Review') return 'border-amber-700/40 bg-amber-950/25 text-amber-200';
  if (status === 'AI Queue') return 'border-cyan-700/40 bg-cyan-950/25 text-cyan-200';
  return 'border-rose-700/40 bg-rose-950/25 text-rose-200';
}

export default function LeftSidebar({ documents, favorites, selectedId, onSelect }: LeftSidebarProps) {
  const aiQueue = documents.filter((doc) => doc.status === 'AI Queue').length;
  const expiring = documents.filter((doc) => doc.status === 'Expiring').length;
  const needsReview = documents.filter((doc) => doc.status === 'Needs Review').length;

  return (
    <aside className="w-full space-y-2 xl:w-[280px]">
      <SectionCard title="Recent Documents" icon={FileText}>
        <div className="space-y-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => onSelect(doc.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                selectedId === doc.id
                  ? 'border-cyan-700/50 bg-cyan-950/20'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-600'
              }`}
            >
              <p className="truncate text-sm font-semibold text-slate-100">{doc.name}</p>
              <p className="mt-1 text-xs text-slate-400">Updated {doc.updatedAt}</p>
              <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${statusTone(doc.status)}`}>
                {doc.status}
              </span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Favourites" icon={Star}>
        <div className="space-y-1 text-sm text-slate-300">
          {favorites.map((item) => (
            <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">{item}</p>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="AI Queue" icon={Bot}>
        <p className="text-sm text-slate-300">{aiQueue} documents pending AI extraction and validation.</p>
      </SectionCard>

      <SectionCard title="Expiring Documents" icon={Clock3}>
        <p className="text-sm text-slate-300">{expiring} documents approaching policy expiry windows.</p>
      </SectionCard>

      <SectionCard title="Needs Review" icon={ShieldAlert}>
        <div className="inline-flex items-center rounded-full border border-amber-700/40 bg-amber-950/25 px-2 py-1 text-xs text-amber-200">
          {needsReview} requiring manual review
        </div>
      </SectionCard>
    </aside>
  );
}
