'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSearchRegistry } from './SearchRegistry';

export type PaletteCommand = {
  id: string;
  title: string;
  href?: string;
  action?: () => void;
};

const defaultCommands: PaletteCommand[] = [
  { id: 'go-intelligence', title: 'Go to Intelligence', href: '/atlas/intelligence' },
  { id: 'go-dashboard', title: 'Go to Dashboard', href: '/atlas/dashboard' },
  { id: 'go-deals', title: 'Go to Deals', href: '/atlas/deals' },
  { id: 'go-documents', title: 'Go to Documents', href: '/atlas/documents' },
  { id: 'go-relationship-graph', title: 'Go to Relationship Graph', href: '/atlas/relationship-graph' },
  { id: 'go-relationship-intelligence', title: 'Go to Relationship Intelligence', href: '/atlas/relationship-intelligence' },
  { id: 'go-identity-access', title: 'Go to Identity & Access', href: '/atlas/identity-access' },
  { id: 'go-approval-center', title: 'Go to Approval Center', href: '/atlas/approval-center' },
  { id: 'go-notification-center', title: 'Go to Notification Center', href: '/atlas/notification-center' },
  { id: 'go-clients', title: 'Go to Clients', href: '/atlas/clients' },
  { id: 'go-counterparties', title: 'Go to Counterparties', href: '/atlas/counterparties' },
  { id: 'go-work-queue', title: 'Go to Work Queue', href: '/atlas/work-queue' },
  { id: 'go-treasury', title: 'Go to Treasury', href: '/atlas/treasury' },
  { id: 'go-collections', title: 'Go to Collections', href: '/atlas/collections' },
  { id: 'create-deal', title: 'Create New Deal', href: '/atlas/deals/new' },
  { id: 'create-client', title: 'Create Client', href: '/atlas/clients' },
  { id: 'generate-term-sheet', title: 'Generate Term Sheet', href: '/atlas/term-sheets' },
  { id: 'generate-credit-memo', title: 'Generate Credit Memo', href: '/atlas/deals?action=credit-memo' },
  { id: 'generate-legal-package', title: 'Generate Legal Package', href: '/atlas/deals?action=legal-package' },
];

export default function CommandPalette({
  open,
  onClose,
  commands = defaultCommands,
}: {
  open: boolean;
  onClose: () => void;
  commands?: PaletteCommand[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { search } = useSearchRegistry();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) {
          onClose();
        }
      }
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open, onClose]);

  const entityCommands = useMemo<PaletteCommand[]>(() => {
    return search(query).map((entity) => ({
      id: `entity-${entity.id}`,
      title: `Open ${entity.title}`,
      href: entity.href,
    }));
  }, [query, search]);

  const filtered = useMemo<PaletteCommand[]>(() => {
    const q = query.trim().toLowerCase();
    const merged: PaletteCommand[] = [...commands, ...entityCommands];
    if (!q) {
      return merged;
    }
    return merged.filter((cmd) => cmd.title.toLowerCase().includes(q));
  }, [commands, entityCommands, query]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 p-6 pt-24 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-cyan-300" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands and entities"
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <span className="rounded-md border border-slate-700 px-2 py-0.5 text-xs text-slate-400">Esc</span>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {filtered.map((command) => (
            <button
              key={command.id}
              type="button"
              onClick={() => {
                if (command.action) {
                  command.action();
                }
                if (command.href) {
                  router.push(command.href);
                }
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              <span>{command.title}</span>
              <span className="text-xs uppercase tracking-wide text-slate-500">Command</span>
            </button>
          ))}
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-sm text-slate-500">No results found.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
