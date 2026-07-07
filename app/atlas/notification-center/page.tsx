'use client';

import { useMemo, useState } from 'react';
import {
  Archive,
  BellRing,
  CheckCircle2,
  ClipboardList,
  Download,
  Filter,
  ListChecks,
  Megaphone,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type Tab =
  | 'Inbox'
  | 'My Tasks'
  | 'Approvals'
  | 'Reminders'
  | 'Escalations'
  | 'Announcements'
  | 'History'
  | 'Analytics';

type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
type Status = 'Unread' | 'Read' | 'Open' | 'In Progress' | 'Completed' | 'Overdue' | 'Escalated' | 'Archived';

type NotificationRecord = {
  id: string;
  priority: Priority;
  notification: string;
  module: string;
  deal: string;
  client: string;
  created: string;
  assignedTo: string;
  status: Status;
  action: string;
  department: string;
  owner: string;
  country: string;
  rm: string;
};

type TaskRecord = {
  taskId: string;
  task: string;
  module: string;
  client: string;
  deal: string;
  owner: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  progress: number;
  department: string;
  country: string;
  rm: string;
};

const TABS: Tab[] = [
  'Inbox',
  'My Tasks',
  'Approvals',
  'Reminders',
  'Escalations',
  'Announcements',
  'History',
  'Analytics',
];

function priorityClass(priority: Priority): string {
  if (priority === 'Critical') return 'text-rose-300';
  if (priority === 'High') return 'text-amber-300';
  if (priority === 'Medium') return 'text-cyan-300';
  return 'text-slate-400';
}

function statusClass(status: Status): string {
  if (status === 'Completed') return 'text-emerald-300';
  if (status === 'In Progress' || status === 'Read') return 'text-cyan-300';
  if (status === 'Unread' || status === 'Open') return 'text-amber-300';
  if (status === 'Overdue') return 'text-rose-300';
  if (status === 'Escalated') return 'text-fuchsia-300';
  return 'text-slate-400';
}

export default function NotificationCenterPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Inbox');
  const [search, setSearch] = useState('');

  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [rmFilter, setRmFilter] = useState('All');

  const notifications = useMemo<NotificationRecord[]>(
    () => [
      {
        id: 'NTF-2026-1101',
        priority: 'Critical',
        notification: 'Collection overdue above AED 1M requires immediate recovery action.',
        module: 'Collections',
        deal: 'DNX-2026-178',
        client: 'Apex Trade Group',
        created: '2026-07-07 08:12',
        assignedTo: 'Deepak Rao',
        status: 'Unread',
        action: 'Escalate recovery call',
        department: 'Collections',
        owner: 'Deepak Rao',
        country: 'Saudi Arabia',
        rm: 'Riya Sinha',
      },
      {
        id: 'NTF-2026-1102',
        priority: 'High',
        notification: 'Legal signature pending for receivables purchase agreement.',
        module: 'Legal',
        deal: 'DNX-2026-181',
        client: 'Blue Horizon Procurement',
        created: '2026-07-07 08:21',
        assignedTo: 'Anika Khan',
        status: 'Open',
        action: 'Trigger signer reminder',
        department: 'Legal',
        owner: 'Anika Khan',
        country: 'United Arab Emirates',
        rm: 'Deepak Rao',
      },
      {
        id: 'NTF-2026-1103',
        priority: 'Medium',
        notification: 'Funding deadline within 4 hours for scheduled tranche.',
        module: 'Treasury',
        deal: 'DNX-2026-190',
        client: 'Crescent Healthcare',
        created: '2026-07-07 08:36',
        assignedTo: 'Mohan Patel',
        status: 'In Progress',
        action: 'Confirm disbursement window',
        department: 'Treasury',
        owner: 'Mohan Patel',
        country: 'Qatar',
        rm: 'Mohan Patel',
      },
      {
        id: 'NTF-2026-1104',
        priority: 'High',
        notification: 'Approval queue item approaching SLA breach in 45 minutes.',
        module: 'Approvals',
        deal: 'DNX-2026-201',
        client: 'Falcon Energy Trade',
        created: '2026-07-07 09:02',
        assignedTo: 'Leena George',
        status: 'Escalated',
        action: 'Assign deputy reviewer',
        department: 'Credit',
        owner: 'Leena George',
        country: 'Bahrain',
        rm: 'Suresh Menon',
      },
      {
        id: 'NTF-2026-1105',
        priority: 'Low',
        notification: 'Policy update published for treasury collateral margining.',
        module: 'Announcements',
        deal: '-',
        client: 'Institutional Portfolio',
        created: '2026-07-07 09:24',
        assignedTo: 'All Users',
        status: 'Read',
        action: 'Acknowledge policy',
        department: 'Compliance',
        owner: 'Compliance Office',
        country: 'United Arab Emirates',
        rm: 'System',
      },
      {
        id: 'NTF-2026-1106',
        priority: 'Medium',
        notification: 'KYC document set expires tomorrow for strategic client.',
        module: 'Clients',
        deal: 'DNX-2026-211',
        client: 'Atlas Regional Distribution',
        created: '2026-07-07 09:46',
        assignedTo: 'Sana Malik',
        status: 'Unread',
        action: 'Initiate KYC refresh',
        department: 'Compliance',
        owner: 'Sana Malik',
        country: 'United Arab Emirates',
        rm: 'Deepak Rao',
      },
    ],
    [],
  );

  const tasks = useMemo<TaskRecord[]>(
    () => [
      {
        taskId: 'TSK-2026-8801',
        task: 'Finalize legal signer routing for DNX-2026-181',
        module: 'Legal',
        client: 'Blue Horizon Procurement',
        deal: 'DNX-2026-181',
        owner: 'Anika Khan',
        dueDate: '2026-07-07 12:00',
        priority: 'High',
        status: 'In Progress',
        progress: 72,
        department: 'Legal',
        country: 'United Arab Emirates',
        rm: 'Deepak Rao',
      },
      {
        taskId: 'TSK-2026-8802',
        task: 'Execute collection call with Buyer ABC',
        module: 'Collections',
        client: 'Apex Trade Group',
        deal: 'DNX-2026-178',
        owner: 'Deepak Rao',
        dueDate: '2026-07-07 11:30',
        priority: 'Critical',
        status: 'Overdue',
        progress: 45,
        department: 'Collections',
        country: 'Saudi Arabia',
        rm: 'Riya Sinha',
      },
      {
        taskId: 'TSK-2026-8803',
        task: 'Approve treasury release for tranche FND-903',
        module: 'Treasury',
        client: 'Crescent Healthcare',
        deal: 'DNX-2026-190',
        owner: 'Mohan Patel',
        dueDate: '2026-07-07 13:00',
        priority: 'High',
        status: 'Open',
        progress: 30,
        department: 'Treasury',
        country: 'Qatar',
        rm: 'Mohan Patel',
      },
      {
        taskId: 'TSK-2026-8804',
        task: 'Review risk policy exception submission',
        module: 'Risk',
        client: 'Summit Industrial Procurement',
        deal: 'DNX-2026-207',
        owner: 'Leena George',
        dueDate: '2026-07-07 15:00',
        priority: 'Medium',
        status: 'Open',
        progress: 40,
        department: 'Risk',
        country: 'Saudi Arabia',
        rm: 'Arjun Pillai',
      },
      {
        taskId: 'TSK-2026-8805',
        task: 'Prepare committee agenda notes',
        module: 'Approvals',
        client: 'Institutional Portfolio',
        deal: '-',
        owner: 'Committee Secretariat',
        dueDate: '2026-07-07 14:30',
        priority: 'Medium',
        status: 'Completed',
        progress: 100,
        department: 'Operations',
        country: 'United Arab Emirates',
        rm: 'System',
      },
      {
        taskId: 'TSK-2026-8806',
        task: 'Complete KYC refresh checklist',
        module: 'Clients',
        client: 'Atlas Regional Distribution',
        deal: 'DNX-2026-211',
        owner: 'Sana Malik',
        dueDate: '2026-07-08 09:00',
        priority: 'Low',
        status: 'Open',
        progress: 25,
        department: 'Compliance',
        country: 'United Arab Emirates',
        rm: 'Deepak Rao',
      },
    ],
    [],
  );

  const reminders = [
    'KYC expires tomorrow',
    'Legal signature pending',
    'Funding deadline',
    'Collection reminder',
    'Bank limit renewal',
    'Insurance expiry',
    'Trade licence renewal',
    'Passport expiry',
    'Board Resolution expiry',
    'Power of Attorney expiry',
  ];

  const escalations = [
    'Tasks breaching SLA',
    'Manager Escalation',
    'Executive Escalation',
    'Committee Escalation',
    'Legal Escalation',
  ];

  const announcements = [
    'System Updates',
    'Policy Changes',
    'Interest Rate Changes',
    'Holiday Calendar',
    'Bank Circulars',
    'Management Messages',
  ];

  const options = useMemo(() => {
    const source = [...notifications.map((n) => ({
      department: n.department,
      owner: n.owner,
      module: n.module,
      status: n.status,
      country: n.country,
      rm: n.rm,
      date: n.created.slice(0, 10),
      priority: n.priority,
    })), ...tasks.map((t) => ({
      department: t.department,
      owner: t.owner,
      module: t.module,
      status: t.status,
      country: t.country,
      rm: t.rm,
      date: t.dueDate.slice(0, 10),
      priority: t.priority,
    }))];

    const unique = (values: string[]) => ['All', ...Array.from(new Set(values))];
    return {
      departments: unique(source.map((s) => s.department)),
      priorities: ['All', 'Low', 'Medium', 'High', 'Critical'],
      owners: unique(source.map((s) => s.owner)),
      modules: unique(source.map((s) => s.module)),
      statuses: unique(source.map((s) => s.status)),
      dates: unique(source.map((s) => s.date)),
      countries: unique(source.map((s) => s.country)),
      rms: unique(source.map((s) => s.rm)),
    };
  }, [notifications, tasks]);

  const filteredNotifications = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notifications
      .filter((n) => {
        if (!q) return true;
        const text = [n.id, n.notification, n.module, n.deal, n.client, n.assignedTo, n.status, n.action].join(' ').toLowerCase();
        return text.includes(q);
      })
      .filter((n) => (departmentFilter === 'All' ? true : n.department === departmentFilter))
      .filter((n) => (priorityFilter === 'All' ? true : n.priority === priorityFilter))
      .filter((n) => (ownerFilter === 'All' ? true : n.owner === ownerFilter))
      .filter((n) => (moduleFilter === 'All' ? true : n.module === moduleFilter))
      .filter((n) => (statusFilter === 'All' ? true : n.status === statusFilter))
      .filter((n) => (dateFilter === 'All' ? true : n.created.slice(0, 10) === dateFilter))
      .filter((n) => (countryFilter === 'All' ? true : n.country === countryFilter))
      .filter((n) => (rmFilter === 'All' ? true : n.rm === rmFilter));
  }, [
    notifications,
    search,
    departmentFilter,
    priorityFilter,
    ownerFilter,
    moduleFilter,
    statusFilter,
    dateFilter,
    countryFilter,
    rmFilter,
  ]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (!q) return true;
        const text = [t.taskId, t.task, t.module, t.client, t.deal, t.owner, t.status].join(' ').toLowerCase();
        return text.includes(q);
      })
      .filter((t) => (departmentFilter === 'All' ? true : t.department === departmentFilter))
      .filter((t) => (priorityFilter === 'All' ? true : t.priority === priorityFilter))
      .filter((t) => (ownerFilter === 'All' ? true : t.owner === ownerFilter))
      .filter((t) => (moduleFilter === 'All' ? true : t.module === moduleFilter))
      .filter((t) => (statusFilter === 'All' ? true : t.status === statusFilter))
      .filter((t) => (dateFilter === 'All' ? true : t.dueDate.slice(0, 10) === dateFilter))
      .filter((t) => (countryFilter === 'All' ? true : t.country === countryFilter))
      .filter((t) => (rmFilter === 'All' ? true : t.rm === rmFilter));
  }, [
    tasks,
    search,
    departmentFilter,
    priorityFilter,
    ownerFilter,
    moduleFilter,
    statusFilter,
    dateFilter,
    countryFilter,
    rmFilter,
  ]);

  const metrics = useMemo(() => {
    const unreadNotifications = notifications.filter((n) => n.status === 'Unread').length;
    const openTasks = tasks.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
    const dueToday = tasks.filter((t) => t.dueDate.startsWith('2026-07-07')).length;
    const overdue = tasks.filter((t) => t.status === 'Overdue').length;
    const completedToday = tasks.filter((t) => t.status === 'Completed' && t.dueDate.startsWith('2026-07-07')).length;
    const escalated = notifications.filter((n) => n.status === 'Escalated').length + tasks.filter((t) => t.status === 'Escalated').length;
    const averageResponseTime = '2.4h';
    const taskSla = '93.1%';

    return [
      { label: 'Unread Notifications', value: String(unreadNotifications) },
      { label: 'Open Tasks', value: String(openTasks) },
      { label: 'Due Today', value: String(dueToday) },
      { label: 'Overdue', value: String(overdue) },
      { label: 'Completed Today', value: String(completedToday) },
      { label: 'Escalated', value: String(escalated) },
      { label: 'Average Response Time', value: averageResponseTime },
      { label: 'Task SLA', value: taskSla },
    ];
  }, [notifications, tasks]);

  const dailyBrief = {
    greeting: 'Good Morning Deepak',
    priorities: 'Resolve critical collection escalation and pending legal signature.',
    collections: '2 overdue high-value items need direct buyer engagement.',
    funding: '1 tranche approaching treasury deadline in 4 hours.',
    legal: '3 signature packets pending legal finalization.',
    approvals: '4 approvals require same-day action.',
    meetings: 'Credit Committee at 14:00, Treasury sync at 12:30.',
    expectedYieldImpact: '+0.18% if escalated collections close today.',
    recommendedFirstAction: 'Start with Buyer ABC recovery call and legal signer escalation.',
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1850px] space-y-6 pb-24">
        <SectionCard title="Notification & Task Center" icon={BellRing}>
          <p className="text-sm text-slate-300">Enterprise Operational Inbox</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{m.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{m.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Filters & Search" icon={Filter}>
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications and tasks by module, client, deal, owner, status, action"
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.departments.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.priorities.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.owners.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.modules.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.statuses.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.dates.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.countries.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={rmFilter} onChange={(e) => setRmFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.rms.map((x) => <option key={x}>{x}</option>)}</select>
          </div>
        </SectionCard>

        <SectionCard title="Workspace Tabs" icon={ListChecks}>
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

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {activeTab === 'Inbox' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Institutional Inbox Grid</p>
                  <table className="mt-3 min-w-[1400px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Priority</th>
                        <th className="px-2 py-2">Notification</th>
                        <th className="px-2 py-2">Module</th>
                        <th className="px-2 py-2">Deal</th>
                        <th className="px-2 py-2">Client</th>
                        <th className="px-2 py-2">Created</th>
                        <th className="px-2 py-2">Assigned To</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {filteredNotifications.map((item) => (
                        <tr key={item.id} className="border-t border-slate-800">
                          <td className={`px-2 py-2 font-semibold ${priorityClass(item.priority)}`}>{item.priority}</td>
                          <td className="px-2 py-2">{item.notification}</td>
                          <td className="px-2 py-2">{item.module}</td>
                          <td className="px-2 py-2">{item.deal}</td>
                          <td className="px-2 py-2">{item.client}</td>
                          <td className="px-2 py-2">{item.created}</td>
                          <td className="px-2 py-2">{item.assignedTo}</td>
                          <td className={`px-2 py-2 font-semibold ${statusClass(item.status)}`}>{item.status}</td>
                          <td className="px-2 py-2">{item.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'My Tasks' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">My Task Grid</p>
                  <table className="mt-3 min-w-[1500px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Task ID</th>
                        <th className="px-2 py-2">Task</th>
                        <th className="px-2 py-2">Module</th>
                        <th className="px-2 py-2">Client</th>
                        <th className="px-2 py-2">Deal</th>
                        <th className="px-2 py-2">Owner</th>
                        <th className="px-2 py-2">Due Date</th>
                        <th className="px-2 py-2">Priority</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {filteredTasks.map((task) => (
                        <tr key={task.taskId} className="border-t border-slate-800">
                          <td className="px-2 py-2 font-semibold text-cyan-300">{task.taskId}</td>
                          <td className="px-2 py-2">{task.task}</td>
                          <td className="px-2 py-2">{task.module}</td>
                          <td className="px-2 py-2">{task.client}</td>
                          <td className="px-2 py-2">{task.deal}</td>
                          <td className="px-2 py-2">{task.owner}</td>
                          <td className="px-2 py-2">{task.dueDate}</td>
                          <td className={`px-2 py-2 font-semibold ${priorityClass(task.priority)}`}>{task.priority}</td>
                          <td className={`px-2 py-2 font-semibold ${statusClass(task.status)}`}>{task.status}</td>
                          <td className="px-2 py-2">
                            <div className="w-24 rounded-full bg-slate-800">
                              <div className="h-2 rounded-full bg-cyan-500/80" style={{ width: `${task.progress}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-400">{task.progress}%</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Approvals' ? (
                <SectionCard title="Approval Tasks" icon={UserCheck}>
                  <div className="space-y-2">
                    {filteredNotifications
                      .filter((n) => n.module === 'Approvals' || n.module === 'Legal' || n.module === 'Risk')
                      .map((n) => (
                        <div key={`approval-${n.id}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">
                          <p className="font-semibold text-slate-100">{n.id} | {n.client}</p>
                          <p className="text-xs text-slate-400">{n.notification}</p>
                        </div>
                      ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Reminders' ? (
                <SectionCard title="Operational Reminders" icon={RefreshCw}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {reminders.map((item) => (
                      <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">{item}</p>
                        <p className="mt-1 text-xs text-slate-400">Auto-generated from compliance and workflow event stream.</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Escalations' ? (
                <SectionCard title="Escalation Channels" icon={ShieldAlert}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {escalations.map((item) => (
                      <div key={item} className="rounded-xl border border-fuchsia-900/40 bg-fuchsia-950/20 p-3">
                        <p className="text-sm font-semibold text-fuchsia-100">{item}</p>
                        <p className="mt-1 text-xs text-fuchsia-200">SLA and priority-based routing is active.</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Announcements' ? (
                <SectionCard title="Announcements" icon={Megaphone}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {announcements.map((item) => (
                      <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">{item}</p>
                        <p className="mt-1 text-xs text-slate-400">Published through enterprise bulletin service.</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'History' ? (
                <SectionCard title="Notification & Task History" icon={ClipboardList}>
                  <div className="space-y-2 text-sm">
                    {[...filteredNotifications, ...filteredTasks.map((t) => ({
                      id: t.taskId,
                      notification: t.task,
                      module: t.module,
                      created: t.dueDate,
                      status: t.status,
                    }))]
                      .slice(0, 10)
                      .map((row) => (
                        <div key={`history-${row.id}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-slate-200">
                          <p className="font-semibold text-slate-100">{row.id}</p>
                          <p className="text-xs text-slate-400">{row.notification}</p>
                          <p className="text-xs text-slate-500">{row.module} | {row.created} | {row.status}</p>
                        </div>
                      ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Analytics' ? (
                <SectionCard title="Operational Analytics" icon={Sparkles}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Inbox Throughput</p><p className="text-sm text-slate-100">{notifications.length} events today</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Task Completion Rate</p><p className="text-sm text-emerald-300">{Math.round((tasks.filter((t) => t.status === 'Completed').length / tasks.length) * 100)}%</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Escalation Ratio</p><p className="text-sm text-fuchsia-300">{Math.round((notifications.filter((n) => n.status === 'Escalated').length / notifications.length) * 100)}%</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Average Response</p><p className="text-sm text-cyan-300">2.4 hours</p></div>
                  </div>
                </SectionCard>
              ) : null}
            </div>

            <div className="space-y-4">
              <SectionCard title="ATLAS Daily Brief" icon={Sparkles}>
                <div className="space-y-2 text-sm text-slate-200">
                  <p className="font-semibold text-slate-100">{dailyBrief.greeting}</p>
                  <p>{dailyBrief.priorities}</p>
                  <p><span className="text-cyan-300">Collections:</span> {dailyBrief.collections}</p>
                  <p><span className="text-cyan-300">Funding:</span> {dailyBrief.funding}</p>
                  <p><span className="text-cyan-300">Legal:</span> {dailyBrief.legal}</p>
                  <p><span className="text-cyan-300">Approvals:</span> {dailyBrief.approvals}</p>
                  <p><span className="text-cyan-300">Meetings:</span> {dailyBrief.meetings}</p>
                  <p><span className="text-cyan-300">Expected Yield Impact:</span> {dailyBrief.expectedYieldImpact}</p>
                  <p><span className="text-cyan-300">Recommended First Action:</span> {dailyBrief.recommendedFirstAction}</p>
                </div>
              </SectionCard>

              <SectionCard title="Right Sidebar" icon={ShieldAlert}>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-amber-100">Today&apos;s Priorities: {notifications.filter((n) => n.priority === 'Critical' || n.priority === 'High').length} critical/high events</div>
                  <div className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-3 text-cyan-100">Upcoming Deadlines: {tasks.filter((t) => t.status === 'Open' || t.status === 'In Progress').length} tasks in next 24h</div>
                  <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-3 text-rose-100">High Risk Tasks: {tasks.filter((t) => t.priority === 'Critical' || t.status === 'Overdue').length}</div>
                  <div className="rounded-lg border border-fuchsia-900/40 bg-fuchsia-950/20 p-3 text-fuchsia-100">AI Suggestions: Prioritize overdue collection and pending legal signature before committee window.</div>
                </div>
              </SectionCard>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-emerald-700/40 bg-emerald-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200"><CheckCircle2 className="h-4 w-4" />Complete</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><UserCheck className="h-4 w-4" />Assign</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><UserCheck className="h-4 w-4" />Reassign</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-700/40 bg-fuchsia-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-200"><ShieldAlert className="h-4 w-4" />Escalate</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><BellRing className="h-4 w-4" />Mark Read</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Archive className="h-4 w-4" />Archive</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><Download className="h-4 w-4" />Generate Task Report</button>
        </div>
      </div>
    </div>
  );
}
