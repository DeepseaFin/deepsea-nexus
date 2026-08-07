'use client';

import {
  BriefcaseBusiness,
  CircleDot,
  FileText,
  Filter,
  Landmark,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type TaskStatus = 'Open' | 'In Progress' | 'Waiting Approval' | 'Completed';
type Department = 'Relationship' | 'Credit' | 'Risk' | 'Legal' | 'Compliance' | 'Treasury' | 'Operations' | 'Documents' | 'ORACLE';

type TaskItem = {
  priority: Priority;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  department: Department;
  linkedWorkspace: string;
  status: TaskStatus;
  primaryAction: string;
};

type TaskGroup = {
  title: "Today's Tasks" | 'Tomorrow' | 'This Week' | 'Later';
  items: readonly TaskItem[];
};

type SummaryCard = {
  label: string;
  value: string;
};

type QueueItem = {
  title: string;
  detail: string;
};

type WorkloadCard = {
  label: string;
  value: string;
};

type PriorityFilter = 'All' | 'Critical' | 'High' | 'Medium' | 'Low';

const summaryCards: readonly SummaryCard[] = [
  { label: 'Open Tasks', value: '42' },
  { label: 'Overdue', value: '8' },
  { label: 'Waiting Approval', value: '11' },
  { label: 'Completed Today', value: '16' },
] as const;

const priorityFilters: readonly PriorityFilter[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
const departmentFilters: readonly Department[] = ['Relationship', 'Credit', 'Risk', 'Legal', 'Compliance', 'Treasury', 'Operations', 'Documents', 'ORACLE'];

const taskBoard: readonly TaskGroup[] = [
  {
    title: "Today's Tasks",
    items: [
      {
        priority: 'Critical',
        title: 'Finalize credit memo',
        description: 'Complete memo commentary for the approved facility renewal.',
        owner: 'Credit Team',
        dueDate: 'Today 15:00',
        department: 'Credit',
        linkedWorkspace: 'Deal Workspace',
        status: 'Waiting Approval',
        primaryAction: 'Review Memo',
      },
      {
        priority: 'High',
        title: 'Upload insurance evidence',
        description: 'Attach the refreshed endorsement into the document pack.',
        owner: 'Operations',
        dueDate: 'Today 16:30',
        department: 'Documents',
        linkedWorkspace: 'Document Workspace',
        status: 'Open',
        primaryAction: 'Upload Now',
      },
      {
        priority: 'Medium',
        title: 'Validate KYC refresh',
        description: 'Confirm the latest KYC documents against the relationship file.',
        owner: 'Compliance',
        dueDate: 'Today 17:00',
        department: 'Compliance',
        linkedWorkspace: 'Document Workspace',
        status: 'In Progress',
        primaryAction: 'Verify KYC',
      },
    ],
  },
  {
    title: 'Tomorrow',
    items: [
      {
        priority: 'High',
        title: 'Treasury release prep',
        description: 'Prepare funding instruction and release confirmation notes.',
        owner: 'Treasury',
        dueDate: 'Tomorrow 10:00',
        department: 'Treasury',
        linkedWorkspace: 'Execution Workspace',
        status: 'Open',
        primaryAction: 'Prepare Release',
      },
      {
        priority: 'Low',
        title: 'Review relationship notes',
        description: 'Update customer relationship log with latest interaction summary.',
        owner: 'Relationship Manager',
        dueDate: 'Tomorrow 13:00',
        department: 'Relationship',
        linkedWorkspace: 'Relationship Workspace',
        status: 'Open',
        primaryAction: 'Review Notes',
      },
    ],
  },
  {
    title: 'This Week',
    items: [
      {
        priority: 'Critical',
        title: 'Resolve legal opinion gap',
        description: 'Obtain updated legal opinion before final execution release.',
        owner: 'Legal',
        dueDate: 'Thu 12:00',
        department: 'Legal',
        linkedWorkspace: 'Execution Workspace',
        status: 'Waiting Approval',
        primaryAction: 'Escalate Legal',
      },
      {
        priority: 'High',
        title: 'Check facility utilization',
        description: 'Confirm utilization remains within approved policy thresholds.',
        owner: 'Risk',
        dueDate: 'Fri 11:30',
        department: 'Risk',
        linkedWorkspace: 'Facility Workspace',
        status: 'In Progress',
        primaryAction: 'Review Utilization',
      },
    ],
  },
  {
    title: 'Later',
    items: [
      {
        priority: 'Medium',
        title: 'ORACLE summary review',
        description: 'Review ORACLE recommendations and map them into the task plan.',
        owner: 'ORACLE',
        dueDate: 'Next Week',
        department: 'ORACLE',
        linkedWorkspace: 'Oracle Workspace',
        status: 'Open',
        primaryAction: 'Open ORACLE',
      },
    ],
  },
] as const;

const approvalQueue: readonly QueueItem[] = [
  { title: 'Pending Credit', detail: '3 tasks require credit approval before proceeding.' },
  { title: 'Pending Treasury', detail: '2 tasks are waiting for treasury execution confirmation.' },
  { title: 'Pending Compliance', detail: '4 tasks remain in compliance review.' },
  { title: 'Pending Legal', detail: '1 task is awaiting legal sign-off.' },
  { title: 'Pending ORACLE', detail: '1 task is awaiting ORACLE recommendations.' },
] as const;

const myAssignments = [
  'Approve revised credit memo',
  'Confirm KYC checklist completion',
  'Close evidence linkage for funding',
] as const;

const departmentWorkload: readonly WorkloadCard[] = [
  { label: 'Relationship', value: '7' },
  { label: 'Credit', value: '9' },
  { label: 'Treasury', value: '5' },
  { label: 'Legal', value: '4' },
  { label: 'Compliance', value: '8' },
  { label: 'Operations', value: '6' },
] as const;

const aiPriorities = [
  'High-risk overdue tasks',
  'Funding delays',
  'Compliance bottlenecks',
  'Tasks blocking execution',
] as const;

const priorityTone: Record<Priority, string> = {
  Critical: 'border-amber-700/40 bg-amber-900/25 text-amber-100',
  High: 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100',
  Medium: 'border-slate-700 bg-slate-900/70 text-slate-300',
  Low: 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
};

export default function InstitutionalTaskCenter() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Task Center</h1>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Create Task
            </button>
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Bulk Actions
            </button>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">Manage every institutional responsibility from one place.</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Task Summary</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Filter className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Priority Filters</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {priorityFilters.map((filter, index) => (
            <span
              key={filter}
              className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                index === 0 ? 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100' : 'border-slate-700 bg-slate-900/70 text-slate-300'
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <BriefcaseBusiness className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Department Filters</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {departmentFilters.map((department) => (
            <span key={department} className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-100">
              {department}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileText className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Task Board</h2>
        </div>

        <div className="space-y-6">
          {taskBoard.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{group.title}</p>
              <div className="grid gap-3">
                {group.items.map((task) => (
                  <article key={task.title + task.dueDate} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${priorityTone[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-100">{task.title}</p>
                        <p className="text-sm text-slate-300">{task.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                          <span>{task.owner}</span>
                          <span>{task.dueDate}</span>
                          <span>{task.department}</span>
                          <span>{task.linkedWorkspace}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-5 py-2.5 text-sm font-semibold text-cyan-50"
                      >
                        {task.primaryAction}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Approval Queue</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {approvalQueue.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CircleDot className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">My Assignments</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {myAssignments.map((assignment) => (
            <article key={assignment} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{assignment}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Department Workload</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {departmentWorkload.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">AI Priorities</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {aiPriorities.map((item) => (
            <article key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Timer className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Next Recommended Action</h2>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Institutional recommendation</p>
          <p className="mt-3 text-sm text-slate-300">
            Close the highest priority approval items first, then sequence treasury and compliance tasks to keep the execution pipeline
            moving without interruption.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Task Review
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
