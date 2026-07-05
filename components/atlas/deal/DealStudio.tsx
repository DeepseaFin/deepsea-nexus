'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const studioTabs = [
  'Client',
  'Counterparty',
  'Commercial Terms',
  'Documents',
  'ATLAS Intelligence',
  'Term Sheet',
  'Approval',
] as const;

type StudioTab = (typeof studioTabs)[number];

interface DealStudioProps {
  onCancel?: () => void;
}

export default function DealStudio({ onCancel }: DealStudioProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('Client');

  return (
    <div className="space-y-6">
      <SectionCard title="Deal Header" className="border-cyan-900/30 bg-slate-950/70">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <HeaderItem label="Client" value="Placeholder Client" />
          <HeaderItem label="Counterparty" value="Placeholder Counterparty" />
          <HeaderItem label="Product" value="Receivables Financing" />
          <HeaderItem label="Deal Stage" value={activeTab} />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
          {studioTabs.map((tab) => {
            const selected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? 'border-cyan-700/60 bg-cyan-950/30 text-cyan-100'
                    : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </aside>

        <main className="min-w-0">
          <SectionCard title={`${activeTab} Workspace`} icon={Layers}>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-300">Placeholder panel for {activeTab}.</p>
              <p className="mt-2 text-xs text-slate-500">
                This workspace is intentionally shell-only for Sprint 38 Ticket 038-001.
              </p>
            </div>
          </SectionCard>
        </main>

        <aside className="space-y-4">
          <SectionCard title="Deal Completion" icon={CheckCircle2}>
            <p className="text-4xl font-semibold text-emerald-300">35%</p>
            <p className="mt-2 text-sm text-slate-400">Placeholder completion status.</p>
          </SectionCard>

          <SectionCard title="Trust Score" icon={ShieldCheck}>
            <p className="text-4xl font-semibold text-cyan-300">78</p>
            <p className="mt-2 text-sm text-slate-400">Placeholder trust signal.</p>
          </SectionCard>

          <SectionCard title="Deal Confidence Index" icon={Sparkles}>
            <p className="text-4xl font-semibold text-emerald-300">72</p>
            <p className="mt-2 text-sm text-slate-400">Placeholder confidence index.</p>
          </SectionCard>

          <SectionCard title="Executive Recommendation" icon={FileText}>
            <p className="text-base font-semibold text-cyan-100">Proceed with Conditions</p>
            <p className="mt-2 text-sm text-slate-400">Placeholder recommendation summary.</p>
          </SectionCard>

          <SectionCard title="Outstanding Actions" icon={AlertTriangle}>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">Complete client profile inputs</li>
              <li className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">Upload mandatory documents</li>
              <li className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">Review approval checklist</li>
            </ul>
          </SectionCard>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          Cancel
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Save Draft
          </button>
          <button
            type="button"
            className="rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40"
          >
            Generate Term Sheet
          </button>
          <button
            type="button"
            className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-900/40"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}

function HeaderItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
