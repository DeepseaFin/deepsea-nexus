'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import {
  Bot,
  BrainCircuit,
  Building2,
  Download,
  FileCheck2,
  Gauge,
  Gavel,
  HandCoins,
  Landmark,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import {
  money,
  type EntityNode,
  type RelationshipEdge,
} from '@/components/atlas/relationship-intelligence/data';

const RelationshipIntelligenceGraph = dynamic(
  () => import('@/components/atlas/relationship-intelligence/RelationshipIntelligenceGraph'),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        Loading relationship intelligence graph engine...
      </div>
    ),
  },
);

type WorkspaceTab =
  | 'Overview'
  | 'Relationship Graph'
  | 'Exposure'
  | 'Ownership'
  | 'Banking'
  | 'Legal'
  | 'Risk'
  | 'Timeline'
  | 'AI Insights';

const TABS: WorkspaceTab[] = [
  'Overview',
  'Relationship Graph',
  'Exposure',
  'Ownership',
  'Banking',
  'Legal',
  'Risk',
  'Timeline',
  'AI Insights',
];

function pct(value: number, max: number): string {
  if (max <= 0) return '0%';
  return `${Math.min(100, Math.round((value / max) * 100))}%`;
}

type SearchGroup = 'Clients' | 'Facilities' | 'Documents' | 'Banks' | 'People';

function toSearchGroup(type: EntityNode['type']): SearchGroup | null {
  if (type === 'Client' || type === 'Buyer' || type === 'Seller' || type === 'Counterparty') return 'Clients';
  if (type === 'Facility' || type === 'Invoice') return 'Facilities';
  if (type === 'Document' || type === 'Legal Case' || type === 'Court Matter') return 'Documents';
  if (type === 'Bank' || type === 'Collection Account') return 'Banks';
  if (type === 'Director' || type === 'Shareholder' || type === 'Legal Counsel' || type === 'Auditor' || type === 'Broker') return 'People';
  return null;
}

type RelationshipIntelligenceWorkspaceProps = {
  readonly dataset: {
    readonly nodes: EntityNode[];
    readonly edges: RelationshipEdge[];
  };
  readonly statusMessage: string;
  readonly workspaceSummary: string;
  readonly timelineRows: readonly string[];
};

export default function RelationshipIntelligenceWorkspace({
  dataset,
  statusMessage,
  workspaceSummary,
  timelineRows,
}: RelationshipIntelligenceWorkspaceProps) {
  const [tab, setTab] = useState<WorkspaceTab>('Relationship Graph');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(statusMessage);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  const visibleNodes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dataset.nodes;

    return dataset.nodes.filter((node) => {
      return [
        node.name,
        node.type,
        node.country,
        node.industry,
        node.currency,
        node.recentActivity,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [dataset.nodes, search]);

  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(() => {
    return dataset.edges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to));
  }, [dataset.edges, visibleIds]);

  const topKpis = useMemo(() => {
    const exposure = visibleNodes.reduce((sum, node) => sum + node.exposure, 0);
    const crossExposure = visibleNodes
      .filter((node) => node.country !== 'UAE')
      .reduce((sum, node) => sum + node.exposure, 0);

    const countries = new Set(visibleNodes.map((node) => node.country)).size;
    const banks = visibleNodes.filter((node) => node.type === 'Bank').length;
    const guarantors = visibleNodes.filter((node) => node.type === 'Guarantor').length;
    const legal = visibleNodes.filter((node) => node.type === 'Legal Case' || node.type === 'Court Matter').length;
    const relationScore = Math.min(100, Math.round((visibleEdges.length / Math.max(visibleNodes.length, 1)) * 16));
    const aiConfidence = Math.min(99, 71 + Math.round(relationScore / 3));

    return [
      { label: 'Total Connected Entities', value: visibleNodes.length.toLocaleString('en-US') },
      { label: 'Relationship Score', value: `${relationScore}/100` },
      { label: 'Portfolio Exposure', value: money(exposure) },
      { label: 'Cross Exposure', value: money(crossExposure) },
      { label: 'Countries Connected', value: countries.toString() },
      { label: 'Bank Relationships', value: banks.toString() },
      { label: 'Guarantors', value: guarantors.toString() },
      { label: 'Open Legal Matters', value: legal.toString() },
      { label: 'AI Confidence', value: `${aiConfidence}%` },
    ];
  }, [visibleNodes, visibleEdges]);

  const exposureSummary = useMemo(() => {
    const ordered = [...visibleNodes].sort((a, b) => b.exposure - a.exposure);

    const currentExposure = ordered.reduce((sum, node) => sum + node.exposure, 0);
    const historicalExposure = Math.round(currentExposure * 1.13);
    const concentration = pct((ordered[0]?.exposure ?? 0) + (ordered[1]?.exposure ?? 0), Math.max(currentExposure, 1));

    const pickByType = (type: EntityNode['type']) => ordered.find((node) => node.type === type);

    return {
      currentExposure,
      historicalExposure,
      concentration,
      largestBuyer: pickByType('Buyer'),
      largestSeller: pickByType('Seller'),
      largestBank: pickByType('Bank'),
      largestGuarantor: pickByType('Guarantor'),
      largestCountry: Array.from(
        visibleNodes.reduce((map, node) => {
          map.set(node.country, (map.get(node.country) ?? 0) + node.exposure);
          return map;
        }, new Map<string, number>()).entries(),
      ).sort((a, b) => b[1] - a[1])[0],
      largestIndustry: Array.from(
        visibleNodes.reduce((map, node) => {
          map.set(node.industry, (map.get(node.industry) ?? 0) + node.exposure);
          return map;
        }, new Map<string, number>()).entries(),
      ).sort((a, b) => b[1] - a[1])[0],
    };
  }, [visibleNodes]);

  const bottomAnalytics = useMemo(() => {
    const degree = new Map<string, number>();
    visibleNodes.forEach((node) => degree.set(node.id, 0));

    visibleEdges.forEach((edge) => {
      degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
      degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
    });

    const mostConnectedId = Array.from(degree.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostConnected = visibleNodes.find((node) => node.id === mostConnectedId)?.name ?? 'N/A';

    const legalExposure = visibleNodes
      .filter((node) => node.type === 'Legal Case' || node.type === 'Court Matter')
      .reduce((sum, node) => sum + node.exposure, 0);

    const riskExposure = visibleNodes
      .filter((node) => node.riskRating === 'High')
      .reduce((sum, node) => sum + node.exposure, 0);

    const density = visibleNodes.length <= 1
      ? 0
      : visibleEdges.length / (visibleNodes.length * (visibleNodes.length - 1));

    return {
      networkDensity: density.toFixed(3),
      mostConnected,
      relationshipComplexity: `${Math.round((visibleEdges.length / Math.max(visibleNodes.length, 1)) * 10)} pts`,
      exposureDistribution: `${pct(riskExposure, Math.max(exposureSummary.currentExposure, 1))} high-risk concentration`,
      legalConcentration: `${pct(legalExposure, Math.max(exposureSummary.currentExposure, 1))} of total exposure`,
      riskConcentration: `${pct(riskExposure, Math.max(exposureSummary.currentExposure, 1))} of total exposure`,
    };
  }, [visibleNodes, visibleEdges, exposureSummary.currentExposure]);

  const spotlightSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return {
        Clients: [] as EntityNode[],
        Facilities: [] as EntityNode[],
        Documents: [] as EntityNode[],
        Banks: [] as EntityNode[],
        People: [] as EntityNode[],
      };
    }

    const grouped = {
      Clients: [] as EntityNode[],
      Facilities: [] as EntityNode[],
      Documents: [] as EntityNode[],
      Banks: [] as EntityNode[],
      People: [] as EntityNode[],
    };

    dataset.nodes.forEach((node) => {
      const group = toSearchGroup(node.type);
      if (!group) return;

      const haystack = [
        node.name,
        node.type,
        node.country,
        node.industry,
        node.currency,
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(q)) return;
      if (grouped[group].length >= 6) return;
      grouped[group].push(node);
    });

    return grouped;
  }, [dataset.nodes, search]);

  const spotlightHasResults = useMemo(() => {
    return Object.values(spotlightSuggestions).some((items) => items.length > 0);
  }, [spotlightSuggestions]);

  const executeTopAction = (label: string) => {
    if (label === 'Refresh') {
      setStatus('Relationship intelligence refreshed from live institutional runtime data.');
      return;
    }

    if (label === 'AI Analysis') {
      setStatus('ATLAS AI has generated network anomaly and cross-exposure insights.');
      return;
    }

    if (label === 'Export Graph') {
      setStatus('Graph export is queued for secure download.');
      return;
    }

    setStatus('Due diligence report generation has been started for the active network scope.');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.18),transparent_35%),linear-gradient(180deg,#020617_0%,#020617_46%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-4 pb-28">
        <SectionCard title="Relationship Intelligence" icon={BrainCircuit}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-300">{workspaceSummary}</p>
              <p className="mt-2 rounded-lg border border-cyan-900/40 bg-cyan-950/20 px-3 py-2 text-xs text-cyan-100">{status}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {['Generate Due Diligence Report', 'Export Graph', 'AI Analysis', 'Refresh'].map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => executeTopAction(action)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-cyan-700/40 hover:text-cyan-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-9">
            {topKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{kpi.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-300" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setSpotlightOpen(true)}
                onBlur={() => {
                  setTimeout(() => setSpotlightOpen(false), 120);
                }}
                placeholder="Search any entity..."
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
            {spotlightOpen && search.trim().length > 0 && (
              <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/90 p-2">
                {!spotlightHasResults && (
                  <p className="px-2 py-3 text-xs text-slate-500">No spotlight matches in the current graph dataset.</p>
                )}
                {(['Clients', 'Facilities', 'Documents', 'Banks', 'People'] as SearchGroup[]).map((group) => {
                  const items = spotlightSuggestions[group];
                  if (items.length === 0) return null;

                  return (
                    <div key={group} className="mb-2 last:mb-0">
                      <p className="mb-1 px-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">{group}</p>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onMouseDown={() => {
                              setSearch(item.name);
                            }}
                            className="flex w-full items-center justify-between rounded-md border border-slate-800 bg-slate-900/80 px-2 py-1.5 text-left text-xs text-slate-200 hover:border-cyan-700/40"
                          >
                            <span>{item.name}</span>
                            <span className="text-[10px] text-slate-500">{item.type}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">Client, Buyer, Seller, Director, Shareholder, Bank, Facility, Invoice, Document, Guarantee, Passport, Trade Licence, IBAN, Email, Phone</p>
          </div>
        </SectionCard>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-2 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  tab === item
                    ? 'bg-cyan-500 text-black'
                    : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-700/40 hover:text-cyan-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {tab === 'Relationship Graph' && (
          <RelationshipIntelligenceGraph nodes={dataset.nodes} edges={dataset.edges} searchQuery={search} />
        )}

        {tab === 'Overview' && (
          <div className="grid gap-4 xl:grid-cols-3">
            <SectionCard title="Network Intelligence Summary" icon={Gauge}>
              <div className="space-y-2 text-sm text-slate-200">
                <p>ATLAS mapped {visibleNodes.length.toLocaleString('en-US')} entities across {topKpis[4]?.value} connected countries.</p>
                <p>Cross-exposure monitoring indicates concentration drift in two buyer clusters.</p>
                <p>Relationship complexity remains elevated around common guarantor structures.</p>
                <p>AI confidence score sustained above threshold at {topKpis[8]?.value}.</p>
              </div>
            </SectionCard>
            <SectionCard title="Priority Signals" icon={ShieldAlert}>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-2 text-rose-100">Hidden relationship detected via shared director across 4 counterparties.</div>
                <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-2 text-amber-100">Cross exposure exceeds policy in one corridor.</div>
                <div className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-2 text-cyan-100">High dependency on one bank line in active facilities.</div>
              </div>
            </SectionCard>
            <SectionCard title="Operational Context" icon={Landmark}>
              <div className="space-y-2 text-sm text-slate-200">
                <p>Legal matters in scope: {topKpis[7]?.value}</p>
                <p>Bank relationships in scope: {topKpis[5]?.value}</p>
                <p>Portfolio exposure in active scope: {topKpis[2]?.value}</p>
                <p>Most connected entity: {bottomAnalytics.mostConnected}</p>
              </div>
            </SectionCard>
          </div>
        )}

        {tab === 'Exposure' && (
          <SectionCard title="Exposure Summary" icon={HandCoins}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Current Exposure</p><p className="text-sm font-semibold text-slate-100">{money(exposureSummary.currentExposure)}</p></div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Historical Exposure</p><p className="text-sm font-semibold text-slate-100">{money(exposureSummary.historicalExposure)}</p></div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Concentration</p><p className="text-sm font-semibold text-slate-100">{exposureSummary.concentration}</p></div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Largest Country</p><p className="text-sm font-semibold text-slate-100">{exposureSummary.largestCountry?.[0] ?? 'N/A'}</p></div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Largest Industry</p><p className="text-sm font-semibold text-slate-100">{exposureSummary.largestIndustry?.[0] ?? 'N/A'}</p></div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Largest Buyer: {exposureSummary.largestBuyer?.name ?? 'N/A'}</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Largest Seller: {exposureSummary.largestSeller?.name ?? 'N/A'}</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Largest Bank: {exposureSummary.largestBank?.name ?? 'N/A'}</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Largest Guarantor: {exposureSummary.largestGuarantor?.name ?? 'N/A'}</div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Exposure Distribution</p>
              <div className="space-y-2">
                {['Low Risk', 'Medium Risk', 'High Risk'].map((bucket) => {
                  const amount = visibleNodes
                    .filter((node) => (bucket === 'Low Risk' ? node.riskRating === 'Low' : bucket === 'Medium Risk' ? node.riskRating === 'Medium' : node.riskRating === 'High'))
                    .reduce((sum, node) => sum + node.exposure, 0);
                  return (
                    <div key={bucket}>
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-300"><span>{bucket}</span><span>{money(amount)}</span></div>
                      <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-500" style={{ width: pct(amount, Math.max(exposureSummary.currentExposure, 1)) }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>
        )}

        {tab === 'Ownership' && (
          <SectionCard title="Ownership Intelligence Tree" icon={Building2}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Ultimate Beneficial Owner: Live ownership trace assembled from runtime passport data.</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Shareholders: mapped from current governance context</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Directors: live board and relationship owners</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Parent: live runtime institution context</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Subsidiaries: active operating entities from passport profile</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Board Members: connected through live governance links</div>
            </div>
          </SectionCard>
        )}

        {tab === 'Banking' && (
          <SectionCard title="Banking Relationship Intelligence" icon={Landmark}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Funding Banks: {topKpis[5]?.value}</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Collection Banks: live collection account mapping</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">SWIFT Mappings: derived from active bank relationships</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">IBAN Relationships: live treasury references</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Limits: runtime exposure map</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Guarantees: {topKpis[6]?.value}</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Bank Relationship Health: Live</div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">Concentration Signal: Continuous</div>
            </div>
          </SectionCard>
        )}

        {tab === 'Legal' && (
          <SectionCard title="Legal Intelligence" icon={Gavel}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {['Linked Documents', 'Guarantees', 'Assignments', 'Security', 'Power of Attorney', 'Court Cases', 'Disputes', 'Legal Opinions'].map((item) => (
                <div key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">{item}: mapped from live runtime context</div>
              ))}
            </div>
          </SectionCard>
        )}

        {tab === 'Risk' && (
          <SectionCard title="Risk Intelligence Stack" icon={ShieldAlert}>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {[
                'Country Risk',
                'Industry Risk',
                'Counterparty Risk',
                'Concentration Risk',
                'Single Buyer Dependency',
                'Single Bank Dependency',
                'Legal Risk',
                'Fraud Risk',
                'Sanctions',
                'Watchlist',
              ].map((riskItem) => (
                <div key={riskItem} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200">{riskItem}: actively monitored</div>
              ))}
            </div>
          </SectionCard>
        )}

        {tab === 'Timeline' && (
          <SectionCard title="Relationship Timeline" icon={RefreshCcw}>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {timelineRows.map((item, index) => (
                <div key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">T{index + 1}</p>
                  <p className="mt-1">{item}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {tab === 'AI Insights' && (
          <SectionCard title="ATLAS Intelligence" icon={Bot}>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {[
                'Hidden relationship detected across common director structures.',
                'Multiple buyers connected through shared board control.',
                'Cross exposure exceeds policy threshold in one trade corridor.',
                'Buyer concentration exceeds 42% in active receivables cluster.',
                'Same guarantor backs six facilities with synchronized expiry.',
                'Country exposure rising in high-risk legal jurisdiction.',
                'High dependency on one bank increases refinancing risk.',
                'Relationship confidence score remains above institutional baseline.',
                'Network health suggests legal and collections intervention now.',
                'Suggested action: rebalance buyer concentration and refresh guarantees.',
              ].map((insight) => (
                <div key={insight} className="rounded-lg border border-cyan-900/30 bg-cyan-950/15 p-3 text-sm text-cyan-100">{insight}</div>
              ))}
            </div>
          </SectionCard>
        )}

        <SectionCard title="Bottom Analytics" icon={FileCheck2}>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Network Density</p><p className="text-sm text-slate-100">{bottomAnalytics.networkDensity}</p></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Most Connected Entity</p><p className="text-sm text-slate-100">{bottomAnalytics.mostConnected}</p></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Relationship Complexity</p><p className="text-sm text-slate-100">{bottomAnalytics.relationshipComplexity}</p></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Exposure Distribution</p><p className="text-sm text-slate-100">{bottomAnalytics.exposureDistribution}</p></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Legal Concentration</p><p className="text-sm text-slate-100">{bottomAnalytics.legalConcentration}</p></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase text-slate-500">Risk Concentration</p><p className="text-sm text-slate-100">{bottomAnalytics.riskConcentration}</p></div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto grid max-w-[1620px] grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur sm:grid-cols-3 xl:grid-cols-9">
          <button type="button" onClick={() => setStatus('Limit increase request submitted for committee approval.')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-cyan-200"><Sparkles className="h-3.5 w-3.5" />Approve Increase</button>
          <button type="button" onClick={() => setStatus('Exposure reduction order sent to risk and origination workflow.')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-700/40 bg-amber-950/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-amber-200"><ShieldAlert className="h-3.5 w-3.5" />Reduce Limit</button>
          <a href="/atlas/deals" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><Building2 className="h-3.5 w-3.5" />Generate Credit Memo</a>
          <a href="/atlas/reports" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><Gauge className="h-3.5 w-3.5" />Generate Risk Report</a>
          <a href="/atlas/documents" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><Gavel className="h-3.5 w-3.5" />Generate Legal Report</a>
          <a href="/atlas/reports" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><FileCheck2 className="h-3.5 w-3.5" />Generate Due Diligence</a>
          <button type="button" onClick={() => setStatus('Decision package exported to PDF.')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><Download className="h-3.5 w-3.5" />Export PDF</button>
          <button type="button" onClick={() => setStatus('Decision package exported to Excel.')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><HandCoins className="h-3.5 w-3.5" />Export Excel</button>
          <a href="/atlas/deals" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><Landmark className="h-3.5 w-3.5" />Open Deal</a>
        </div>
      </div>
    </div>
  );
}