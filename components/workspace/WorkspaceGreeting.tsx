"use client";

import { CalendarDays } from 'lucide-react';
import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

export default function WorkspaceGreeting() {
  const context = useWorkspaceContext();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Greeting</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
        {context.greeting.greeting}, {context.user.name}
      </h1>
      <p className="mt-4 text-base text-slate-200">{context.greeting.welcomeMessage}</p>
      <p className="mt-2 text-sm text-slate-400">{context.greeting.attentionMessage}</p>

      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-5">
        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
          {context.role}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
          <CalendarDays className="h-3.5 w-3.5 text-cyan-300" />
          {context.greeting.date}
        </span>
        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
          {context.institution}
        </span>
      </div>
    </section>
  );
}
