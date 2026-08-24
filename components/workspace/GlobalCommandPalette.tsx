'use client';

import {
  ArrowUp,
  Command,
  FileText,
  FolderKanban,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type CommandGroup = {
  title: string;
  commands: readonly string[];
};

const recentCommands = [
  'Open Crescent Trade Holdings',
  'Open Business Passport',
  'Run ORACLE Analysis',
  'Upload Documents',
  'Create Facility',
] as const;

const navigationCommands = [
  'Open Customer',
  'Open Facility',
  'Open Deal',
  'Open Execution',
  'Open Documents',
  'Open Evidence',
  'Open ORACLE',
  'Open Search',
] as const;

const quickActions = [
  'New Customer',
  'New Deal',
  'New Facility',
  'New Document',
  'Create Credit Memo',
  'Start Funding',
  'Generate Risk Report',
  'Run Compliance Review',
] as const;

const aiCommands = [
  'Run ORACLE',
  'Summarize Relationship',
  'Explain Credit Risk',
  'Generate Executive Summary',
  'Suggest Next Action',
  'Find Missing Documents',
] as const;

const suggestedCommands = [
  'Continue Crescent Trade Holdings',
  'Review pending funding',
  'Approve facility renewal',
  'Verify KYC',
  'Generate institution summary',
] as const;

const commandGroups: readonly CommandGroup[] = [
  { title: 'Recent Commands', commands: recentCommands },
  { title: 'Navigation Commands', commands: navigationCommands },
  { title: 'Quick Actions', commands: quickActions },
  { title: 'AI Commands', commands: aiCommands },
  { title: 'Suggested Commands', commands: suggestedCommands },
] as const;

const shortcuts = ['⌘K', 'Esc', 'Enter', 'Arrow Up', 'Arrow Down'] as const;

export default function GlobalCommandPalette() {
  return (
    <WorkspaceShell>
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-10">
        <section className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/40 p-7 shadow-[0_14px_32px_rgba(2,6,23,0.28)] sm:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 flex items-center justify-center gap-3 border-b border-slate-800/80 pb-3">
              <Command className="h-5 w-5 text-cyan-300" />
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">Command Palette</h1>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Navigate, search and execute actions across the institutional operating system.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-500" />
              <input
                type="text"
                value=""
                readOnly
                placeholder="Type a command..."
                className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {shortcuts.map((shortcut) => (
              <article key={shortcut} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-center">
                <p className="text-sm font-semibold text-slate-100">{shortcut}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <div className="space-y-4">
              {commandGroups.slice(0, 2).map((group) => (
                <article key={group.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                    {group.title === 'Recent Commands' ? (
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                    ) : (
                      <FolderKanban className="h-4 w-4 text-cyan-300" />
                    )}
                    <h2 className="text-sm font-semibold tracking-tight text-slate-100">{group.title}</h2>
                  </div>
                  <div className="space-y-2">
                    {group.commands.map((command) => (
                      <div key={command} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-100">
                        {command}
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-3 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  <h2 className="text-sm font-semibold tracking-tight text-slate-100">Keyboard Shortcuts</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shortcuts.map((shortcut) => (
                    <span key={shortcut} className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                      {shortcut}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <div className="space-y-4">
              {commandGroups.slice(2, 4).map((group) => (
                <article key={group.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                    {group.title === 'Quick Actions' ? (
                      <FileText className="h-4 w-4 text-cyan-300" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                    )}
                    <h2 className="text-sm font-semibold tracking-tight text-slate-100">{group.title}</h2>
                  </div>
                  <div className="space-y-2">
                    {group.commands.map((command) => (
                      <div key={command} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-100">
                        {command}
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-3 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <ArrowUp className="h-4 w-4 text-cyan-300" />
                  <h2 className="text-sm font-semibold tracking-tight text-slate-100">Search Tips</h2>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  Use the command palette to search institutional records, launch workflows, and execute approved actions from a single place.
                  Search results are optimized for speed and grouped by operating domain.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">Institutional search across DNOS</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">Type to execute actions instantly</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">Use shortcuts to navigate faster</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">Built for executive workflows</div>
                </div>
              </article>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="mb-3 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <h2 className="text-sm font-semibold tracking-tight text-slate-100">Suggested Commands</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {suggestedCommands.map((command) => (
                <article key={command} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3 text-sm font-medium text-slate-100">
                  {command}
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
