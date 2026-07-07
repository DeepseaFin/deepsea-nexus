'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Archive,
  ArrowDownUp,
  ArrowRight,
  Bot,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileSearch,
  FileStack,
  Files,
  Filter,
  GitCompare,
  HardDrive,
  RefreshCw,
  Share2,
  ShieldAlert,
  Signature,
  Upload,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { useDeal } from '@/components/atlas/common/DealContext';
import { DealOrchestrationEngine } from '@/atlas-core/orchestration/DealOrchestrationEngine';

type VaultTab =
  | 'Overview'
  | 'Legal Documents'
  | 'Credit Memos'
  | 'Term Sheets'
  | 'Funding Documents'
  | 'Collections'
  | 'Compliance'
  | 'Templates'
  | 'Archive';

type DocumentStatus = 'Draft' | 'Executed' | 'Pending' | 'Expired' | 'Archived';
type SignatureStatus = 'Signed' | 'Pending' | 'Expired' | 'Not Required';
type Confidentiality = 'Public' | 'Internal' | 'Confidential' | 'Restricted';
type SortDirection = 'asc' | 'desc';

type VaultDocument = {
  id: string;
  name: string;
  category: string;
  deal: string;
  client: string;
  counterparty: string;
  status: DocumentStatus;
  version: string;
  owner: string;
  created: string;
  modified: string;
  signatureStatus: SignatureStatus;
  fileSizeMB: number;
  confidentiality: Confidentiality;
  retentionDate: string;
  country: string;
  rm: string;
  uploader: string;
  ocrText: string;
  linkedDealHref: string;
  linkedClientHref: string;
  linkedLegalHref: string;
  linkedMemoHref: string;
};

const TABS: VaultTab[] = [
  'Overview',
  'Legal Documents',
  'Credit Memos',
  'Term Sheets',
  'Funding Documents',
  'Collections',
  'Compliance',
  'Templates',
  'Archive',
];

const RELATIONSHIP_FLOW = [
  { label: 'Deal', href: '/atlas/deals' },
  { label: 'Term Sheet', href: '/atlas/term-sheets' },
  { label: 'Credit Memo', href: '/atlas/deals?module=credit-memo' },
  { label: 'Receivables Purchase Agreement', href: '/atlas/deals?module=legal' },
  { label: 'Assignment Agreement', href: '/atlas/deals?module=legal' },
  { label: 'Funding', href: '/atlas/treasury' },
  { label: 'Collections', href: '/atlas/collections' },
  { label: 'Audit', href: '/atlas/reports' },
];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(base: Date, offset: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + offset);
  return toIsoDate(date);
}

function moneyMb(value: number): string {
  return `${value.toFixed(1)} MB`;
}

function statusColor(status: DocumentStatus): string {
  if (status === 'Executed') return 'text-emerald-300';
  if (status === 'Draft') return 'text-cyan-300';
  if (status === 'Pending') return 'text-amber-300';
  if (status === 'Expired') return 'text-rose-300';
  return 'text-slate-400';
}

function signatureColor(status: SignatureStatus): string {
  if (status === 'Signed') return 'text-emerald-300';
  if (status === 'Pending') return 'text-amber-300';
  if (status === 'Expired') return 'text-rose-300';
  return 'text-cyan-300';
}

export default function DocumentsPage() {
  const { deal } = useDeal();
  const orchestration = useMemo(() => DealOrchestrationEngine.orchestrateDealWorkflow(deal), [deal]);

  const [activeTab, setActiveTab] = useState<VaultTab>('Overview');
  const [search, setSearch] = useState('');

  const [countryFilter, setCountryFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [counterpartyFilter, setCounterpartyFilter] = useState('All');
  const [rmFilter, setRmFilter] = useState('All');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('All');
  const [createdDateFilter, setCreatedDateFilter] = useState('All');
  const [modifiedDateFilter, setModifiedDateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [executedFilter, setExecutedFilter] = useState('All');
  const [pendingFilter, setPendingFilter] = useState('All');
  const [archivedFilter, setArchivedFilter] = useState('All');
  const [legalFilter, setLegalFilter] = useState('All');
  const [treasuryFilter, setTreasuryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [collectionsFilter, setCollectionsFilter] = useState('All');

  const [sortColumn, setSortColumn] = useState<keyof VaultDocument>('modified');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const anchorDate = useMemo(() => {
    const parsed = new Date(deal.workflow.lastUpdated);
    if (!Number.isNaN(parsed.getTime())) return parsed;
    return new Date('2026-07-07');
  }, [deal.workflow.lastUpdated]);

  const documents = useMemo<VaultDocument[]>(() => {
    const clients = [
      deal.client.legalName,
      'Apex Trading Group',
      'Crescent Healthcare Distribution',
      'Falcon Energy Trade LLC',
      'Blue Horizon Procurement DMCC',
      'Northern Infrastructure Buyers Ltd.',
      'Summit Industrial Procurement Co.',
      'Atlas Regional Distribution Co.',
    ];

    const counterparties = [
      deal.counterparty.name,
      'Mashreq Bank PJSC',
      'ADCB Treasury Desk',
      'ENBD Institutional Banking',
      'FAB Corporate Line',
      'Gulf Maritime Logistics LLC',
      'Qatar Procurement Syndicate',
      'Bahrain Trade Corridor SPV',
    ];

    const categories = [
      'Legal Package',
      'Credit Memo',
      'Term Sheet',
      'Funding Document',
      'Collection Record',
      'Compliance Certificate',
      'Template',
      'Audit Document',
    ];

    const names = [
      'Receivables Purchase Agreement',
      'Credit Memo - Renewal Tranche A',
      'Term Sheet - Structured Facility',
      'Funding Instruction Letter',
      'Collection Reconciliation Statement',
      'KYC Compliance Pack',
      'Master Template - Legal Annexure',
      'Audit Trail Snapshot',
      'Assignment Agreement',
      'Risk Committee Note',
      'Escrow Account Mandate',
      'Signature Page Bundle',
      'Invoice Assignment Notice',
      'Treasury Release Confirmation',
      'Collections Escalation Notice',
      'Document Retention Certification',
    ];

    return Array.from({ length: 20 }, (_, i) => {
      const status: DocumentStatus = i % 11 === 0
        ? 'Expired'
        : i % 9 === 0
          ? 'Archived'
          : i % 4 === 0
            ? 'Pending'
            : i % 3 === 0
              ? 'Draft'
              : 'Executed';

      const signatureStatus: SignatureStatus = status === 'Executed'
        ? 'Signed'
        : status === 'Expired'
          ? 'Expired'
          : status === 'Pending'
            ? 'Pending'
            : 'Not Required';

      const category = categories[i % categories.length];

      return {
        id: `DOC-${2026}-${String(1200 + i)}`,
        name: names[i % names.length],
        category,
        deal: `${deal.deal.dealId.slice(0, -1)}${i % 10}`,
        client: clients[i % clients.length],
        counterparty: counterparties[i % counterparties.length],
        status,
        version: `v${Math.max(1, (i % 5) + 1)}.${i % 3}`,
        owner: i % 2 === 0 ? deal.client.relationshipManager : 'Institutional Documentation Desk',
        created: addDays(anchorDate, -40 + i),
        modified: addDays(anchorDate, -18 + i),
        signatureStatus,
        fileSizeMB: 1.6 + (i % 7) * 0.9,
        confidentiality: i % 6 === 0 ? 'Restricted' : i % 4 === 0 ? 'Confidential' : i % 3 === 0 ? 'Internal' : 'Public',
        retentionDate: addDays(anchorDate, 365 + i * 25),
        country: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Bahrain'][i % 4],
        rm: i % 2 === 0 ? deal.client.relationshipManager : ['R. Sinha', 'M. Patel', 'A. Khan'][i % 3],
        uploader: i % 2 === 0 ? 'ATLAS OCR Ingestion' : 'Institutional Documentation Team',
        ocrText: `${names[i % names.length]} linked to ${clients[i % clients.length]} and ${counterparties[i % counterparties.length]} with clause references and signature routing metadata`,
        linkedDealHref: '/atlas/deals',
        linkedClientHref: '/atlas/clients',
        linkedLegalHref: '/atlas/deals?module=legal',
        linkedMemoHref: '/atlas/deals?module=credit-memo',
      };
    });
  }, [deal, anchorDate]);

  const options = useMemo(() => {
    const unique = (arr: string[]) => Array.from(new Set(arr));

    return {
      countries: ['All', ...unique(documents.map((d) => d.country))],
      clients: ['All', ...unique(documents.map((d) => d.client))],
      counterparties: ['All', ...unique(documents.map((d) => d.counterparty))],
      rms: ['All', ...unique(documents.map((d) => d.rm))],
      categories: ['All', ...unique(documents.map((d) => d.category))],
      createdDates: ['All', ...unique(documents.map((d) => d.created))],
      modifiedDates: ['All', ...unique(documents.map((d) => d.modified))],
      statuses: ['All', ...unique(documents.map((d) => d.status))],
    };
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    const base = documents
      .filter((doc) => {
        if (!query) return true;
        const searchable = [
          doc.id,
          doc.name,
          doc.deal,
          doc.client,
          doc.counterparty,
          doc.category,
          doc.rm,
          doc.owner,
          doc.uploader,
          doc.ocrText,
          doc.status,
          doc.signatureStatus,
          doc.confidentiality,
        ]
          .join(' ')
          .toLowerCase();
        return searchable.includes(query);
      })
      .filter((doc) => (countryFilter === 'All' ? true : doc.country === countryFilter))
      .filter((doc) => (clientFilter === 'All' ? true : doc.client === clientFilter))
      .filter((doc) => (counterpartyFilter === 'All' ? true : doc.counterparty === counterpartyFilter))
      .filter((doc) => (rmFilter === 'All' ? true : doc.rm === rmFilter))
      .filter((doc) => (documentTypeFilter === 'All' ? true : doc.category === documentTypeFilter))
      .filter((doc) => (createdDateFilter === 'All' ? true : doc.created === createdDateFilter))
      .filter((doc) => (modifiedDateFilter === 'All' ? true : doc.modified === modifiedDateFilter))
      .filter((doc) => (statusFilter === 'All' ? true : doc.status === statusFilter))
      .filter((doc) => (executedFilter === 'All' ? true : executedFilter === 'Executed Only' ? doc.status === 'Executed' : true))
      .filter((doc) => (pendingFilter === 'All' ? true : pendingFilter === 'Pending Only' ? doc.status === 'Pending' : true))
      .filter((doc) => (archivedFilter === 'All' ? true : archivedFilter === 'Archived Only' ? doc.status === 'Archived' : true))
      .filter((doc) => (legalFilter === 'All' ? true : legalFilter === 'Legal Only' ? doc.category === 'Legal Package' : true))
      .filter((doc) => (treasuryFilter === 'All' ? true : treasuryFilter === 'Treasury Only' ? doc.category === 'Funding Document' : true))
      .filter((doc) => (riskFilter === 'All' ? true : riskFilter === 'Risk Only' ? doc.name.toLowerCase().includes('risk') : true))
      .filter((doc) => (collectionsFilter === 'All' ? true : collectionsFilter === 'Collections Only' ? doc.category === 'Collection Record' : true));

    const tabFiltered = base.filter((doc) => {
      if (activeTab === 'Legal Documents') return doc.category === 'Legal Package';
      if (activeTab === 'Credit Memos') return doc.category === 'Credit Memo';
      if (activeTab === 'Term Sheets') return doc.category === 'Term Sheet';
      if (activeTab === 'Funding Documents') return doc.category === 'Funding Document';
      if (activeTab === 'Collections') return doc.category === 'Collection Record';
      if (activeTab === 'Compliance') return doc.category === 'Compliance Certificate';
      if (activeTab === 'Templates') return doc.category === 'Template';
      if (activeTab === 'Archive') return doc.status === 'Archived';
      return true;
    });

    return [...tabFiltered].sort((left, right) => {
      const a = left[sortColumn];
      const b = right[sortColumn];

      if (typeof a === 'number' && typeof b === 'number') {
        return sortDirection === 'asc' ? a - b : b - a;
      }

      const leftValue = String(a).toLowerCase();
      const rightValue = String(b).toLowerCase();

      if (leftValue < rightValue) return sortDirection === 'asc' ? -1 : 1;
      if (leftValue > rightValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [
    documents,
    search,
    countryFilter,
    clientFilter,
    counterpartyFilter,
    rmFilter,
    documentTypeFilter,
    createdDateFilter,
    modifiedDateFilter,
    statusFilter,
    executedFilter,
    pendingFilter,
    archivedFilter,
    legalFilter,
    treasuryFilter,
    riskFilter,
    collectionsFilter,
    activeTab,
    sortColumn,
    sortDirection,
  ]);

  const selectedDocument = filteredDocuments[0] ?? documents[0];

  const kpis = useMemo(() => {
    const total = documents.length;
    const today = documents.filter((d) => d.created === toIsoDate(anchorDate) || d.modified === toIsoDate(anchorDate)).length;
    const legalPackages = documents.filter((d) => d.category === 'Legal Package').length;
    const creditMemos = documents.filter((d) => d.category === 'Credit Memo').length;
    const termSheets = documents.filter((d) => d.category === 'Term Sheet').length;
    const executed = documents.filter((d) => d.status === 'Executed').length;
    const pending = documents.filter((d) => d.signatureStatus === 'Pending').length;
    const storage = documents.reduce((sum, d) => sum + d.fileSizeMB, 0);

    return [
      { label: 'Total Documents', value: String(total) },
      { label: 'Documents Today', value: String(today || 6) },
      { label: 'Legal Packages', value: String(legalPackages) },
      { label: 'Credit Memos', value: String(creditMemos) },
      { label: 'Term Sheets', value: String(termSheets) },
      { label: 'Executed Agreements', value: String(executed) },
      { label: 'Pending Signatures', value: String(pending) },
      { label: 'Storage Used', value: `${storage.toFixed(1)} MB` },
    ];
  }, [documents, anchorDate]);

  const aiInsights = useMemo(
    () => [
      { title: 'Missing Signatures', detail: '7 legal documents require signer escalation before EOD.', tone: 'pending' as const },
      { title: 'Expiring Documents', detail: '4 compliance packs expire in next 15 days.', tone: 'critical' as const },
      { title: 'Clause Deviations', detail: '3 agreements include non-standard indemnity wording.', tone: 'recommendation' as const },
      { title: 'Missing Annexures', detail: '5 term sheet packs missing annexure B uploads.', tone: 'pending' as const },
      { title: 'Compliance Issues', detail: '2 KYC packs contain outdated beneficial ownership declarations.', tone: 'critical' as const },
      { title: 'Duplicate Documents', detail: '6 duplicate uploads detected by OCR signature hash.', tone: 'recommendation' as const },
    ],
    [],
  );

  const overviewTopCards = useMemo(
    () => [
      {
        title: 'Recent Documents',
        lines: filteredDocuments.slice(0, 3).map((d) => `${d.id} | ${d.name}`),
      },
      {
        title: 'Pending Signatures',
        lines: filteredDocuments
          .filter((d) => d.signatureStatus === 'Pending')
          .slice(0, 3)
          .map((d) => `${d.id} | ${d.client}`),
      },
      {
        title: 'Recently Modified',
        lines: filteredDocuments.slice(0, 3).map((d) => `${d.modified} | ${d.name}`),
      },
      {
        title: 'AI Document Alerts',
        lines: [
          'Clause deviation detected in receivables purchase agreement.',
          'Duplicate signature page bundle identified.',
          'Retention policy mismatch on one archived legal pack.',
        ],
      },
    ],
    [filteredDocuments],
  );

  const storageUsed = documents.reduce((sum, d) => sum + d.fileSizeMB, 0);
  const storageCap = 512;
  const storagePercent = Math.round((storageUsed / storageCap) * 100);

  const onSort = (column: keyof VaultDocument) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortColumn(column);
    setSortDirection('asc');
  };

  const sortHint = (column: keyof VaultDocument) => (sortColumn === column ? ` (${sortDirection})` : '');

  const execDate = toIsoDate(anchorDate);

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1850px] space-y-6 pb-24">
        <SectionCard title="Institutional Document Vault" icon={FileStack}>
          <p className="text-sm text-slate-300">Enterprise Knowledge & Document Repository</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            {kpis.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Universal Search" icon={FileSearch}>
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by Deal ID, Document Name, Client, Counterparty, Invoice, Agreement, Clause, Keyword, RM, Uploader, OCR Text"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>
        </SectionCard>

        <SectionCard title="Advanced Filters" icon={Filter}>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.countries.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.clients.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={counterpartyFilter} onChange={(e) => setCounterpartyFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.counterparties.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={rmFilter} onChange={(e) => setRmFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.rms.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={documentTypeFilter} onChange={(e) => setDocumentTypeFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.categories.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={createdDateFilter} onChange={(e) => setCreatedDateFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.createdDates.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={modifiedDateFilter} onChange={(e) => setModifiedDateFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.modifiedDates.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.statuses.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={executedFilter} onChange={(e) => setExecutedFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{['All', 'Executed Only'].map((v) => <option key={v}>{v}</option>)}</select>
            <select value={pendingFilter} onChange={(e) => setPendingFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{['All', 'Pending Only'].map((v) => <option key={v}>{v}</option>)}</select>
            <select value={archivedFilter} onChange={(e) => setArchivedFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{['All', 'Archived Only'].map((v) => <option key={v}>{v}</option>)}</select>
            <select value={legalFilter} onChange={(e) => setLegalFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{['All', 'Legal Only'].map((v) => <option key={v}>{v}</option>)}</select>
            <select value={treasuryFilter} onChange={(e) => setTreasuryFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{['All', 'Treasury Only'].map((v) => <option key={v}>{v}</option>)}</select>
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{['All', 'Risk Only'].map((v) => <option key={v}>{v}</option>)}</select>
            <select value={collectionsFilter} onChange={(e) => setCollectionsFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{['All', 'Collections Only'].map((v) => <option key={v}>{v}</option>)}</select>
          </div>
        </SectionCard>

        <SectionCard title="Workspace Tabs" icon={Files}>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  activeTab === tab
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {activeTab === 'Overview' ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {overviewTopCards.map((card) => (
                    <div key={card.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.title}</p>
                      <div className="mt-3 space-y-2">
                        {card.lines.map((line) => (
                          <p key={`${card.title}-${line}`} className="text-sm text-slate-200">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Institutional Document Grid</p>
                <table className="mt-3 min-w-[2200px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('id')}>Document ID{sortHint('id')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('name')}>Document Name{sortHint('name')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('category')}>Category{sortHint('category')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('deal')}>Deal{sortHint('deal')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('client')}>Client{sortHint('client')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('counterparty')}>Counterparty{sortHint('counterparty')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('status')}>Status{sortHint('status')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('version')}>Version{sortHint('version')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('owner')}>Owner{sortHint('owner')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('created')}>Created{sortHint('created')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('modified')}>Last Modified{sortHint('modified')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('signatureStatus')}>Signature Status{sortHint('signatureStatus')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('fileSizeMB')}>File Size{sortHint('fileSizeMB')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('confidentiality')}>Confidentiality{sortHint('confidentiality')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('retentionDate')}>Retention Date{sortHint('retentionDate')}</th>
                      <th className="px-2 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-t border-slate-800">
                        <td className="px-2 py-2 font-semibold text-cyan-300">{doc.id}</td>
                        <td className="px-2 py-2">{doc.name}</td>
                        <td className="px-2 py-2">{doc.category}</td>
                        <td className="px-2 py-2">{doc.deal}</td>
                        <td className="px-2 py-2">{doc.client}</td>
                        <td className="px-2 py-2">{doc.counterparty}</td>
                        <td className={`px-2 py-2 font-semibold ${statusColor(doc.status)}`}>{doc.status}</td>
                        <td className="px-2 py-2">{doc.version}</td>
                        <td className="px-2 py-2">{doc.owner}</td>
                        <td className="px-2 py-2">{doc.created}</td>
                        <td className="px-2 py-2">{doc.modified}</td>
                        <td className={`px-2 py-2 font-semibold ${signatureColor(doc.signatureStatus)}`}>{doc.signatureStatus}</td>
                        <td className="px-2 py-2">{moneyMb(doc.fileSizeMB)}</td>
                        <td className="px-2 py-2">{doc.confidentiality}</td>
                        <td className="px-2 py-2">{doc.retentionDate}</td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <button type="button" className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-300"><Eye className="h-3.5 w-3.5" /></button>
                            <button type="button" className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-300"><Download className="h-3.5 w-3.5" /></button>
                            <button type="button" className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-300"><Share2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <SectionCard title="Version Control" icon={RefreshCw}>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current Version</p>
                      <p className="mt-1 text-sm font-semibold text-slate-100">{selectedDocument.version} | Edited by {selectedDocument.owner}</p>
                      <p className="mt-1 text-xs text-slate-400">Updated: {selectedDocument.modified}</p>
                    </div>
                    {[1, 2, 3].map((offset) => (
                      <div key={`version-${offset}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">Previous Version v{Math.max(1, Number(selectedDocument.version.split('.')[0].slice(1)) - offset)}.0</p>
                        <p className="mt-1 text-xs text-slate-400">Editor: {offset % 2 === 0 ? selectedDocument.owner : 'Institutional Documentation Desk'}</p>
                        <p className="text-xs text-slate-400">Date: {addDays(anchorDate, -(offset * 3))}</p>
                        <p className="mt-1 text-xs text-slate-300">Change Summary: Clause alignment update and signer routing metadata correction.</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button type="button" className="rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-2 py-1 text-xs text-cyan-200">Restore Version</button>
                          <button type="button" className="rounded-lg border border-fuchsia-700/40 bg-fuchsia-950/30 px-2 py-1 text-xs text-fuchsia-200">Compare Versions</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="AI Document Insights" icon={Bot}>
                  <div className="space-y-2">
                    {aiInsights.map((insight) => (
                      <div key={insight.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className={`text-xs uppercase tracking-[0.2em] ${insight.tone === 'critical' ? 'text-rose-300' : insight.tone === 'pending' ? 'text-amber-300' : insight.tone === 'recommendation' ? 'text-fuchsia-300' : 'text-cyan-300'}`}>
                          {insight.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-200">{insight.detail}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              <SectionCard title="Document Relationship Map" icon={GitCompare}>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {RELATIONSHIP_FLOW.map((item, index) => (
                    <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <Link href={item.href} className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                        {item.label}
                      </Link>
                      {index < RELATIONSHIP_FLOW.length - 1 ? <ArrowRight className="mt-2 h-4 w-4 text-slate-500" /> : null}
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            <div className="space-y-4">
              <SectionCard title="Document Preview Panel" icon={Eye}>
                <div className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Document Summary</p>
                    <p className="mt-1 font-semibold text-slate-100">{selectedDocument.id} | {selectedDocument.name}</p>
                    <p className="mt-1 text-xs text-slate-400">Category: {selectedDocument.category} | Version: {selectedDocument.version}</p>
                  </div>
                  <div className="rounded-xl border border-fuchsia-900/50 bg-fuchsia-950/20 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">AI Summary</p>
                    <p className="mt-1 text-xs text-fuchsia-100">Document is structurally valid. One non-standard clause detected in indemnity section; signature routing pending for 2 approvers.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Linked Deal</p>
                    <Link href={selectedDocument.linkedDealHref} className="mt-1 block text-cyan-300">{selectedDocument.deal}</Link>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Linked Client</p>
                    <Link href={selectedDocument.linkedClientHref} className="mt-1 block text-cyan-300">{selectedDocument.client}</Link>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Linked Legal Package</p>
                    <Link href={selectedDocument.linkedLegalHref} className="mt-1 block text-cyan-300">Open Legal Workspace</Link>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Linked Credit Memo</p>
                    <Link href={selectedDocument.linkedMemoHref} className="mt-1 block text-cyan-300">Open Credit Memo</Link>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Version History</p>
                    <p className="mt-1 text-xs text-slate-300">{`${selectedDocument.version} -> v2.1 -> v1.4 -> v1.0`}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest Activity</p>
                    <p className="mt-1 text-xs text-slate-300">{execDate} 11:20 | Signature reminder triggered for pending approvers.</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Storage Usage" icon={HardDrive}>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Repository Usage</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">{storageUsed.toFixed(1)} MB / {storageCap} MB</p>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-cyan-500/80" style={{ width: `${Math.min(storagePercent, 100)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{storagePercent}% utilized</p>
                </div>
              </SectionCard>

              <SectionCard title="Right Sidebar" icon={Clock3}>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-slate-200">Recent Activity: 14 document updates in last 4 hours.</div>
                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-amber-100">Pending Reviews: 9 legal packs waiting internal review.</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-100">Expiring Documents: 4 documents expire within 15 days.</div>
                  <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-3 text-cyan-100">Today&apos;s Uploads: 6 OCR uploads completed.</div>
                  <div className="rounded-lg border border-fuchsia-900/60 bg-fuchsia-950/20 p-3 text-fuchsia-100">AI Warnings: Clause deviations and duplicate bundles detected.</div>
                </div>
              </SectionCard>

              <SectionCard title="Vault Signals" icon={ShieldAlert}>
                <div className="space-y-2 text-sm text-slate-200">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Workflow Health: <span className="text-cyan-300">{orchestration.analytics.workflowHealthScore}%</span></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Next Recommended Action: {orchestration.analytics.nextRecommendedAction}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Overall Risk: <span className="text-amber-300">{orchestration.analytics.overallWorkflowRisk}</span></div>
                </div>
              </SectionCard>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/50 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><Upload className="h-4 w-4" />Upload</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-700/50 bg-fuchsia-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-200"><FileCheck2 className="h-4 w-4" />Generate</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Download className="h-4 w-4" />Download</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Eye className="h-4 w-4" />Preview</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Share2 className="h-4 w-4" />Share</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-700/50 bg-fuchsia-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-200"><ArrowDownUp className="h-4 w-4" />Compare Versions</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-amber-700/50 bg-amber-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200"><Signature className="h-4 w-4" />Request Signature</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-rose-700/50 bg-rose-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200"><Archive className="h-4 w-4" />Archive</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-emerald-700/50 bg-emerald-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200"><RefreshCw className="h-4 w-4" />Restore</button>
        </div>
      </div>
    </div>
  );
}
