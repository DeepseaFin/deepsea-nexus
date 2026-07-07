'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Command,
  FileSearch,
  FolderOpen,
  Gauge,
  Gavel,
  HandCoins,
  Landmark,
  ListChecks,
  Mic,
  Pin,
  Plus,
  ReceiptText,
  RefreshCcw,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type CommandCategory =
  | 'Deals'
  | 'Clients'
  | 'Counterparties'
  | 'Risk'
  | 'Treasury'
  | 'Collections'
  | 'Legal'
  | 'Approvals'
  | 'Documents'
  | 'Reports'
  | 'Settings';

type AtlasCommand = {
  id: string;
  title: string;
  module: string;
  description: string;
  shortcut: string;
  href: string;
  category: CommandCategory;
  icon: LucideIcon;
};

type RecentSearch = {
  text: string;
  time: number;
};

type AIResponse = {
  question: string;
  answer: string;
  totalFunding: string;
  highestPriority: string;
  risk: string;
  recommendedAction: string;
};

const SEARCH_EXAMPLES = [
  'Show funding due this week',
  'Open ABC Limited',
  'Pending legal approvals',
  'Collections overdue more than AED 100,000',
  'Generate Credit Memo',
  'Show portfolio exposure by country',
];

const SUGGESTED_QUESTIONS = [
  'Funding Today',
  'Pending Collections',
  'Credit Committee',
  'Legal Risks',
  'Top Clients',
  'Expected Cashflow',
  'Generate Report',
  'Portfolio Exposure',
];

const QUICK_COMMANDS = [
  'Create new deal',
  'Generate term sheet',
  'Open Treasury',
  'Open Approval Center',
  'Show pending collections',
  'Create new client',
  'Show legal alerts',
  'Show funding queue',
  'Generate report',
];

const SMART_NAVIGATION = [
  { title: 'ABC Limited Client', module: 'Clients', href: '/atlas/clients' },
  { title: 'ABC Receivable Facility', module: 'Deals', href: '/atlas/deals' },
  { title: 'ABC Documents', module: 'Documents', href: '/atlas/documents' },
  { title: 'ABC Collections', module: 'Collections', href: '/atlas/collections' },
];

const COMMANDS: AtlasCommand[] = [
  {
    id: 'deals-active',
    title: 'Open Active Deals',
    module: 'Deal Workspace',
    description: 'View active facilities, credit memos, and pipeline status.',
    shortcut: 'GD',
    href: '/atlas/deals',
    category: 'Deals',
    icon: FolderOpen,
  },
  {
    id: 'clients-open',
    title: 'Open Client Directory',
    module: 'Client Hub',
    description: 'Search clients, ownership maps, and onboarding status.',
    shortcut: 'GC',
    href: '/atlas/clients',
    category: 'Clients',
    icon: Users,
  },
  {
    id: 'counterparties-open',
    title: 'Open Counterparties',
    module: 'Counterparty Center',
    description: 'Review buyer/supplier health, limits, and payment behavior.',
    shortcut: 'GY',
    href: '/atlas/counterparties',
    category: 'Counterparties',
    icon: Building2,
  },
  {
    id: 'risk-open',
    title: 'Open Risk Dashboard',
    module: 'Risk Operations',
    description: 'Monitor risk drift, covenant pressure, and concentration.',
    shortcut: 'GR',
    href: '/atlas/relationship-graph',
    category: 'Risk',
    icon: ShieldAlert,
  },
  {
    id: 'treasury-open',
    title: 'Open Treasury',
    module: 'Treasury Command',
    description: 'Funding queue, liquidity outlook, and line utilization.',
    shortcut: 'GT',
    href: '/atlas/work-queue',
    category: 'Treasury',
    icon: Wallet,
  },
  {
    id: 'collections-open',
    title: 'Open Collections',
    module: 'Collections Control',
    description: 'Track overdue buckets, expected cashflow, and recovery playbooks.',
    shortcut: 'GO',
    href: '/atlas/collections',
    category: 'Collections',
    icon: HandCoins,
  },
  {
    id: 'legal-open',
    title: 'Open Legal Issues',
    module: 'Legal Operations',
    description: 'Monitor legal blockers, signatures, and agreement exceptions.',
    shortcut: 'GL',
    href: '/atlas/documents',
    category: 'Legal',
    icon: Gavel,
  },
  {
    id: 'approvals-open',
    title: 'Open Approval Center',
    module: 'Approval Workflows',
    description: 'Route approvals by limit, stage, and escalation rules.',
    shortcut: 'GA',
    href: '/atlas/approval-center',
    category: 'Approvals',
    icon: CheckCircle2,
  },
  {
    id: 'documents-open',
    title: 'Open Document Vault',
    module: 'Document Center',
    description: 'Search legal packs, versions, OCR, and requirement status.',
    shortcut: 'GV',
    href: '/atlas/documents',
    category: 'Documents',
    icon: FileSearch,
  },
  {
    id: 'reports-open',
    title: 'Open Reports',
    module: 'BI Center',
    description: 'Generate executive reports and portfolio analytics.',
    shortcut: 'GP',
    href: '/atlas/reports',
    category: 'Reports',
    icon: ReceiptText,
  },
  {
    id: 'settings-open',
    title: 'Open Settings',
    module: 'System Settings',
    description: 'Manage platform settings, controls, and policies.',
    shortcut: 'GS',
    href: '/atlas/settings',
    category: 'Settings',
    icon: Settings,
  },
];

const CATEGORY_ORDER: CommandCategory[] = [
  'Deals',
  'Clients',
  'Counterparties',
  'Risk',
  'Treasury',
  'Collections',
  'Legal',
  'Approvals',
  'Documents',
  'Reports',
  'Settings',
];

const HISTORY_KEY = 'atlas.ask.history.v1';

function classifyRisk(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('overdue') || lower.includes('legal')) return 'High';
  if (lower.includes('funding') || lower.includes('approval')) return 'Medium';
  return 'Low';
}

export default function IntelligencePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    if (typeof window === 'undefined') return [];

    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as RecentSearch[];
      return parsed.slice(0, 10);
    } catch {
      return [];
    }
  });
  const [voiceMessage, setVoiceMessage] = useState('');
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);

  useEffect(() => {
    const handleHotkey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }

      if (event.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleHotkey);
    return () => window.removeEventListener('keydown', handleHotkey);
  }, []);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return COMMANDS;

    return COMMANDS.filter((command) => {
      return (
        command.title.toLowerCase().includes(normalized)
        || command.description.toLowerCase().includes(normalized)
        || command.module.toLowerCase().includes(normalized)
        || command.category.toLowerCase().includes(normalized)
      );
    });
  }, [query]);

  const smartSuggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return SMART_NAVIGATION.filter((item) => item.title.toLowerCase().includes(normalized)).slice(0, 4);
  }, [query]);

  const groupedCommands = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      results: filteredCommands.filter((command) => command.category === category),
    })).filter((bucket) => bucket.results.length > 0);
  }, [filteredCommands]);

  const flatCommands = useMemo(() => groupedCommands.flatMap((bucket) => bucket.results), [groupedCommands]);

  const saveRecent = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const next = [{ text: trimmed, time: Date.now() }, ...recentSearches.filter((item) => item.text.toLowerCase() !== trimmed.toLowerCase())].slice(0, 10);
    setRecentSearches(next);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    window.localStorage.removeItem(HISTORY_KEY);
  };

  const buildResponse = (rawQuery: string): AIResponse => {
    const normalized = rawQuery.trim().toLowerCase();

    if (normalized.includes('which facilities require funding today') || normalized.includes('funding today')) {
      return {
        question: 'Which facilities require funding today?',
        answer: '4 facilities require funding today.',
        totalFunding: 'AED 8.7 Million',
        highestPriority: 'ABC Receivables',
        risk: 'Medium',
        recommendedAction: 'Approve treasury allocation.',
      };
    }

    if (normalized.includes('pending collections')) {
      return {
        question: rawQuery,
        answer: '9 collection items are pending with 3 above urgent threshold.',
        totalFunding: 'AED 6.1 Million',
        highestPriority: 'Orion Logistics',
        risk: 'High',
        recommendedAction: 'Assign escalation officer and trigger reminder workflows.',
      };
    }

    if (normalized.includes('legal')) {
      return {
        question: rawQuery,
        answer: '7 legal approvals are pending across 4 high-value facilities.',
        totalFunding: 'AED 4.3 Million',
        highestPriority: 'Kestrel Trade Finance',
        risk: 'High',
        recommendedAction: 'Prioritize signature completion before next funding cycle.',
      };
    }

    return {
      question: rawQuery,
      answer: `ATLAS processed your request and identified 12 relevant entities for ${rawQuery}.`,
      totalFunding: 'AED 5.4 Million',
      highestPriority: 'Harbor Receivables Program',
      risk: classifyRisk(rawQuery),
      recommendedAction: 'Review top-ranked result and launch associated workflow.',
    };
  };

  const executeCommand = (raw: string) => {
    const normalized = raw.trim().toLowerCase();
    if (!normalized) return;

    saveRecent(raw);

    if (normalized.includes('create new deal')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/deals');
      return;
    }

    if (normalized.includes('generate term sheet')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/term-sheets');
      return;
    }

    if (normalized.includes('open treasury') || normalized.includes('funding queue')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/work-queue');
      return;
    }

    if (normalized.includes('open approval center')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/approval-center');
      return;
    }

    if (normalized.includes('pending collections')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/collections');
      return;
    }

    if (normalized.includes('create new client') || normalized.includes('abc limited')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/clients');
      return;
    }

    if (normalized.includes('show legal alerts') || normalized.includes('legal approvals')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/documents');
      return;
    }

    if (normalized.includes('generate report') || normalized.includes('portfolio exposure')) {
      setAIResponse(buildResponse(raw));
      router.push('/atlas/reports');
      return;
    }

    const exactCommand = COMMANDS.find((command) => {
      return command.title.toLowerCase().includes(normalized) || normalized.includes(command.category.toLowerCase());
    });

    if (exactCommand) {
      setAIResponse(buildResponse(raw));
      router.push(exactCommand.href);
      return;
    }

    setAIResponse(buildResponse(raw));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    executeCommand(query);
  };

  const activeCommand = flatCommands[selectedIndex] ?? null;

  const onPaletteKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((prev) => (prev + 1 >= flatCommands.length ? 0 : prev + 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prev) => (prev - 1 < 0 ? Math.max(flatCommands.length - 1, 0) : prev - 1));
    }

    if (event.key === 'Enter' && activeCommand) {
      event.preventDefault();
      saveRecent(query || activeCommand.title);
      setPaletteOpen(false);
      setAIResponse(buildResponse(query || activeCommand.title));
      router.push(activeCommand.href);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_42%,#030712_100%)] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1880px] space-y-4">
        <SectionCard title="Ask ATLAS" icon={Sparkles}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-slate-100">Enterprise AI Command Center</p>
              <p className="text-sm text-slate-400">Primary navigation and decision assistant for the entire ATLAS platform.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
              <Command className="h-3.5 w-3.5" />
              Cmd+K / Ctrl+K
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-4 rounded-2xl border border-cyan-900/40 bg-slate-950/90 p-2 shadow-[0_0_0_1px_rgba(14,116,144,0.15),0_12px_38px_rgba(3,7,18,0.8)]">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
              <Search className="h-4 w-4 text-cyan-300" />
              <input
                ref={inputRef}
                value={query}
                onFocus={() => setPaletteOpen(true)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedIndex(0);
                  setPaletteOpen(true);
                }}
                onKeyDown={onPaletteKeyDown}
                placeholder="Ask ATLAS anything..."
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => {
                  setVoiceMessage('Voice search coming soon.');
                  setTimeout(() => setVoiceMessage(''), 2400);
                }}
                className="rounded-md border border-slate-700 bg-slate-800/70 p-1.5 text-slate-300 transition hover:border-cyan-700/50 hover:text-cyan-200"
                aria-label="Voice search"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button type="submit" className="rounded-md border border-cyan-700/50 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                Run
              </button>
            </div>
          </form>

          {voiceMessage && (
            <div className="mt-2 rounded-lg border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
              {voiceMessage}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {SEARCH_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setQuery(example);
                  setPaletteOpen(true);
                }}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-700/40 hover:text-cyan-200"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setQuery(chip);
                  executeCommand(chip);
                }}
                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-cyan-700/50 hover:text-cyan-200"
              >
                {chip}
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr_340px]">
          <div className="space-y-4">
            <SectionCard title="Quick Commands" icon={Command}>
              <div className="grid gap-2 sm:grid-cols-2">
                {QUICK_COMMANDS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      executeCommand(item);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-cyan-700/40 hover:text-cyan-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Global Action Buttons" icon={Plus}>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <button type="button" onClick={() => router.push('/atlas/deals')} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Plus className="h-3.5 w-3.5" />New Deal</button>
                <button type="button" onClick={() => router.push('/atlas/clients')} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><UserPlus className="h-3.5 w-3.5" />New Client</button>
                <button type="button" onClick={() => router.push('/atlas/reports')} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><ReceiptText className="h-3.5 w-3.5" />Generate Report</button>
                <button type="button" onClick={() => router.push('/atlas/deals')} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><ListChecks className="h-3.5 w-3.5" />Create Credit Memo</button>
                <button type="button" onClick={() => router.push('/atlas/term-sheets')} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><ArrowUpRight className="h-3.5 w-3.5" />Generate Term Sheet</button>
              </div>
            </SectionCard>

            {aiResponse && (
              <SectionCard title="AI Response Panel" icon={Sparkles}>
                <div className="space-y-3 rounded-xl border border-cyan-900/40 bg-cyan-950/10 p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Question</p>
                    <p className="text-sm text-slate-100">{aiResponse.question}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Response</p>
                    <p className="text-sm text-cyan-100">{aiResponse.answer}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Total Funding</p>
                      <p className="text-sm font-semibold text-slate-100">{aiResponse.totalFunding}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Highest Priority</p>
                      <p className="text-sm font-semibold text-slate-100">{aiResponse.highestPriority}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Risk</p>
                      <p className="text-sm font-semibold text-slate-100">{aiResponse.risk}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Recommended Action</p>
                      <p className="text-sm font-semibold text-slate-100">{aiResponse.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}
          </div>

          <div className="space-y-4">
            <SectionCard title="Command Palette" icon={Command}>
              <div className="space-y-2">
                {groupedCommands.map((bucket) => (
                  <div key={bucket.category} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">{bucket.category}</p>
                    <div className="space-y-1">
                      {bucket.results.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              saveRecent(item.title);
                              setPaletteOpen(false);
                              setAIResponse(buildResponse(item.title));
                              router.push(item.href);
                            }}
                            className="flex w-full items-center justify-between rounded-md border border-slate-800 bg-slate-900/80 px-2 py-2 text-left transition hover:border-cyan-700/40"
                          >
                            <span className="inline-flex items-start gap-2">
                              <Icon className="mt-0.5 h-3.5 w-3.5 text-cyan-300" />
                              <span>
                                <span className="block text-xs font-semibold text-slate-100">{item.title}</span>
                                <span className="block text-[11px] text-slate-400">{item.module} | {item.description}</span>
                              </span>
                            </span>
                            <span className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">{item.shortcut}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Recent Searches" icon={Clock3}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">Last 10 searches stored locally.</p>
                  <button type="button" onClick={clearRecent} className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-300 hover:border-slate-500">
                    <RefreshCcw className="h-3 w-3" />
                    Clear history
                  </button>
                </div>

                {recentSearches.length === 0 && (
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-500">No recent searches yet.</div>
                )}

                {recentSearches.map((item) => (
                  <button
                    key={`${item.text}-${item.time}`}
                    type="button"
                    onClick={() => {
                      setQuery(item.text);
                      executeCommand(item.text);
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-left hover:border-cyan-700/30"
                  >
                    <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                      <Clock3 className="h-3.5 w-3.5 text-slate-500" />
                      {item.text}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Smart Navigation" icon={Gauge}>
              <div className="space-y-2">
                {smartSuggestions.length === 0 && (
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-500">Type client or facility keywords like ABC to get smart suggestions.</div>
                )}
                {smartSuggestions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      saveRecent(item.title);
                      setAIResponse(buildResponse(item.title));
                      router.push(item.href);
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-left hover:border-cyan-700/30"
                  >
                    <span>
                      <span className="block text-xs font-semibold text-slate-200">{item.title}</span>
                      <span className="block text-[11px] text-slate-500">{item.module}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-cyan-300" />
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Recent Activity" icon={Activity}>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Credit memo generated for Apex Materials.</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Treasury allocation approved for two facilities.</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Legal review escalated for Delta Trading.</div>
              </div>
            </SectionCard>

            <SectionCard title="Saved Searches" icon={Search}>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Funding due this week</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Collections above AED 100,000</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Pending legal approvals</div>
              </div>
            </SectionCard>

            <SectionCard title="Favourite Clients" icon={Users}>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">ABC Limited</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Apex Holdings</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">North Bay Logistics</div>
              </div>
            </SectionCard>

            <SectionCard title="Pinned Deals" icon={Pin}>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Receivable Program 1012</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Bridge Funding 981</div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">Export Flow 212</div>
              </div>
            </SectionCard>

            <SectionCard title="AI Notifications" icon={Sparkles}>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-2 text-amber-100">3 deals near covenant threshold.</div>
                <div className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-2 text-cyan-100">Funding spread opportunity detected in healthcare portfolio.</div>
                <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-2 text-rose-100">Collections risk spike in 2 counterparties.</div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {paletteOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px]" onClick={() => setPaletteOpen(false)}>
          <div className="mx-auto mt-20 max-w-[980px] px-4" onClick={(event) => event.stopPropagation()}>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/95 p-3 shadow-[0_20px_70px_rgba(2,6,23,0.8)]">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Institutional Command Palette</p>
                <button type="button" onClick={() => setPaletteOpen(false)} className="rounded-md border border-slate-700 bg-slate-900 p-1 text-slate-300">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">
                {groupedCommands.map((bucket) => (
                  <div key={bucket.category} className="rounded-xl border border-slate-800 bg-slate-900/70 p-2">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">{bucket.category}</p>
                    <div className="space-y-1">
                      {bucket.results.map((item) => {
                        const Icon = item.icon;
                        const commandIndex = flatCommands.findIndex((command) => command.id === item.id);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              saveRecent(item.title);
                              setPaletteOpen(false);
                              setAIResponse(buildResponse(item.title));
                              router.push(item.href);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg border px-2 py-2 text-left transition ${
                              commandIndex === selectedIndex
                                ? 'border-cyan-700/50 bg-cyan-950/25'
                                : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                            }`}
                          >
                            <span className="inline-flex items-start gap-2">
                              <Icon className="mt-0.5 h-4 w-4 text-cyan-300" />
                              <span>
                                <span className="block text-xs font-semibold text-slate-100">{item.title}</span>
                                <span className="block text-[11px] text-slate-400">{item.module} | {item.description}</span>
                              </span>
                            </span>
                            <span className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">{item.shortcut}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur sm:grid-cols-5">
          <button type="button" onClick={() => router.push('/atlas/deals')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><Building2 className="h-3.5 w-3.5" />New Deal</button>
          <button type="button" onClick={() => router.push('/atlas/clients')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><Users className="h-3.5 w-3.5" />New Client</button>
          <button type="button" onClick={() => router.push('/atlas/reports')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><ReceiptText className="h-3.5 w-3.5" />Generate Report</button>
          <button type="button" onClick={() => router.push('/atlas/deals')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-200"><ListChecks className="h-3.5 w-3.5" />Credit Memo</button>
          <button type="button" onClick={() => router.push('/atlas/term-sheets')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-cyan-200"><Landmark className="h-3.5 w-3.5" />Term Sheet</button>
        </div>
      </div>
    </div>
  );
}
