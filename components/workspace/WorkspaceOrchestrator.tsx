'use client';

import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  CircleDot,
  Link2,
  Landmark,
  Sparkles,
  Timer,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type ContextItem = {
  label: string;
  status: string;
  owner: string;
  progress: string;
};

type GraphStage = {
  label: string;
  completion: string;
  dependencies: string;
  stage: string;
};

type SharedContextItem = {
  label: string;
  value: string;
};

type EngineState = {
  label: string;
  detail: string;
};

type EventItem = {
  title: string;
  detail: string;
  time: string;
};

type MetricItem = {
  label: string;
  value: string;
};

type CoordinationItem = {
  label: string;
  value: string;
};

const institutionContext: readonly ContextItem[] = [
  { label: 'Customer', status: 'Synced', owner: 'Relationship Manager', progress: '100%' },
  { label: 'Relationship', status: 'Active', owner: 'Relationship Team', progress: '96%' },
  { label: 'Business Passport', status: 'Updated', owner: 'Passport Team', progress: '92%' },
  { label: 'Facility', status: 'Aligned', owner: 'Credit Team', progress: '88%' },
  { label: 'Deal', status: 'In Progress', owner: 'Deal Team', progress: '84%' },
  { label: 'Execution', status: 'Running', owner: 'Operations', progress: '76%' },
  { label: 'Documents', status: 'In Review', owner: 'Document Control', progress: '90%' },
  { label: 'Evidence', status: 'Linked', owner: 'Compliance', progress: '85%' },
  { label: 'ORACLE', status: 'Refreshed', owner: 'ORACLE', progress: '91%' },
] as const;

const workflowGraph: readonly GraphStage[] = [
  { label: 'Customer', completion: '100%', dependencies: 'Base identity loaded', stage: 'Current stage: Customer' },
  { label: 'Relationship', completion: '96%', dependencies: 'Customer context', stage: 'Current stage: Relationship' },
  { label: 'Passport', completion: '92%', dependencies: 'Corporate profile', stage: 'Current stage: Business Passport' },
  { label: 'Facility', completion: '88%', dependencies: 'Limits and utilization', stage: 'Current stage: Facility' },
  { label: 'Deal', completion: '84%', dependencies: 'Credit memo and approvals', stage: 'Current stage: Deal' },
  { label: 'Execution', completion: '76%', dependencies: 'Documentation complete', stage: 'Current stage: Execution' },
  { label: 'Documents', completion: '90%', dependencies: 'Verified document pack', stage: 'Current stage: Documents' },
  { label: 'Evidence', completion: '85%', dependencies: 'Linked evidence set', stage: 'Current stage: Evidence' },
  { label: 'ORACLE', completion: '91%', dependencies: 'Decision intelligence refreshed', stage: 'Current stage: ORACLE' },
] as const;

const workspaceSynchronization = [
  { title: 'Relationship updated', detail: 'Relationship context propagated to deal and execution workspaces.' },
  { title: 'Facility changed', detail: 'Facility state synchronized with approval and utilization records.' },
  { title: 'Documents received', detail: 'Document workspace received new institutional evidence inputs.' },
  { title: 'Evidence linked', detail: 'Evidence workspace linked verification to active transaction history.' },
  { title: 'ORACLE refreshed', detail: 'Decision intelligence recomputed the institutional recommendation context.' },
] as const;

const sharedContext: readonly SharedContextItem[] = [
  { label: 'Current customer', value: 'Crescent Trade Holdings FZ-LLC' },
  { label: 'Current deal', value: 'Crescent Receivables Growth Facility 2026' },
  { label: 'Current facility', value: 'Invoice Discounting Programme' },
  { label: 'Current execution', value: 'Funding release in progress' },
  { label: 'Current evidence set', value: 'Verified institutional pack' },
  { label: 'Active workspace', value: 'Execution Workspace' },
] as const;

const institutionStates: readonly EngineState[] = [
  { label: 'Healthy', detail: 'Workflow connections are stable and aligned.' },
  { label: 'Waiting', detail: 'A small set of dependencies are queued for closure.' },
  { label: 'Blocked', detail: 'Blocking conditions exist in legal and compliance handoffs.' },
  { label: 'Completed', detail: 'Core path milestones have been completed.' },
  { label: 'Pending review', detail: 'Remaining items await approval and validation.' },
] as const;

const crossWorkspaceEvents: readonly EventItem[] = [
  { title: 'Relationship updated', detail: 'Customer context refreshed across the institutional hub.', time: '09:00' },
  { title: 'Facility approved', detail: 'Approved facility state propagated to downstream workspaces.', time: '09:35' },
  { title: 'Execution started', detail: 'Execution state activated after approval and condition checks.', time: '10:15' },
  { title: 'Evidence uploaded', detail: 'Evidence pack synchronized into the shared context engine.', time: '11:40' },
  { title: 'ORACLE recommendation', detail: 'Decision layer refreshed and linked to the orchestration path.', time: '13:05' },
] as const;

const metrics: readonly MetricItem[] = [
  { label: 'Completion', value: '87%' },
  { label: 'Connected workspaces', value: '9' },
  { label: 'Shared objects', value: '42' },
  { label: 'Open dependencies', value: '6' },
  { label: 'Workflow health', value: 'Stable' },
] as const;

const coordinationItems: readonly CoordinationItem[] = [
  { label: 'Recommended workspace', value: 'Execution Workspace' },
  { label: 'Next required action', value: 'Resolve legal and compliance dependencies' },
  { label: 'Missing dependencies', value: 'Insurance confirmation and final legal note' },
  { label: 'Institution health', value: 'Operationally healthy with controlled bottlenecks' },
] as const;

export default function WorkspaceOrchestrator() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Workspace Orchestrator</h1>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Open Workflow
            </button>
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Configure
            </button>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">Unified institutional workflow across every DNOS workspace.</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Building2 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Current Institutional Context</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {institutionContext.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.label}</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Status</span>
                  <span className="font-semibold text-slate-100">{item.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Owner</span>
                  <span className="font-semibold text-slate-100">{item.owner}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Progress</span>
                  <span className="font-semibold text-slate-100">{item.progress}</span>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-50"
              >
                Continue
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ArrowRight className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Workflow Graph</h2>
        </div>

        <div className="space-y-3">
          {workflowGraph.map((stage, index) => (
            <div key={stage.label} className="space-y-3">
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{stage.label}</p>
                    <p className="mt-1 text-sm text-slate-300">{stage.dependencies}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                      {stage.completion}
                    </span>
                    <span className="rounded-full border border-cyan-700/40 bg-cyan-900/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
                      {stage.stage}
                    </span>
                  </div>
                </div>
              </article>
              {index < workflowGraph.length - 1 ? <div className="flex justify-center"><ArrowRight className="h-4 w-4 text-slate-600" /></div> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Timer className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Workspace Synchronization</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {workspaceSynchronization.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Link2 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Shared Context</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sharedContext.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CircleDot className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institution State Engine</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {institutionStates.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.label}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CheckCircle2 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Cross Workspace Events</h2>
        </div>

        <div className="space-y-3">
          {crossWorkspaceEvents.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.time}</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institution Metrics</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <BookOpen className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">AI Coordination</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {coordinationItems.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Next Recommended Action</h2>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Institutional recommendation</p>
          <p className="mt-3 text-sm text-slate-300">
            Continue the orchestrated workflow from the active execution context and resolve the remaining legal and compliance
            dependencies before advancing the next workspace handoff.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Orchestration
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
