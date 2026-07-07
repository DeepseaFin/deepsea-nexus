'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  UserRoundCheck,
  Users,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type Tab =
  | 'Users'
  | 'Roles'
  | 'Departments'
  | 'Permission Matrix'
  | 'Approval Matrix'
  | 'Audit'
  | 'Security';

type UserStatus = 'Active' | 'Pending Approval' | 'Locked' | 'Inactive';
type MfaStatus = 'Enabled' | 'Disabled';

type UserRecord = {
  userId: string;
  name: string;
  department: string;
  role: string;
  manager: string;
  status: UserStatus;
  lastLogin: string;
  mfa: MfaStatus;
  country: string;
  email: string;
  phone: string;
};

type PermissionCell = {
  view: boolean;
  create: boolean;
  edit: boolean;
  approve: boolean;
  delete: boolean;
  export: boolean;
  admin: boolean;
};

type AuditRecord = {
  event: string;
  timestamp: string;
  user: string;
  ip: string;
  detail: string;
};

const TABS: Tab[] = [
  'Users',
  'Roles',
  'Departments',
  'Permission Matrix',
  'Approval Matrix',
  'Audit',
  'Security',
];

const ROLES = [
  'Relationship Manager',
  'Credit Analyst',
  'Credit Committee',
  'Risk Officer',
  'Legal Officer',
  'Treasury Officer',
  'Collections Officer',
  'Operations',
  'Compliance',
  'Audit',
  'Management',
  'CEO',
  'Administrator',
  'System',
];

const DEPARTMENTS = [
  'Origination',
  'Credit',
  'Risk',
  'Legal',
  'Treasury',
  'Operations',
  'Collections',
  'Portfolio',
  'Compliance',
  'Finance',
  'Administration',
];

const MODULES = [
  'Dashboard',
  'Clients',
  'Deals',
  'Risk',
  'Pricing',
  'Credit Memo',
  'Term Sheet',
  'Legal',
  'Treasury',
  'Collections',
  'Portfolio',
  'Reports',
  'Administration',
];

function boolCell(value: boolean) {
  return value ? <span className="text-emerald-300">Yes</span> : <span className="text-slate-500">No</span>;
}

function statusClass(status: UserStatus): string {
  if (status === 'Active') return 'text-emerald-300';
  if (status === 'Pending Approval') return 'text-amber-300';
  if (status === 'Locked') return 'text-rose-300';
  return 'text-slate-400';
}

function makePermission(seed: number): PermissionCell {
  return {
    view: true,
    create: seed % 2 === 0,
    edit: seed % 3 !== 0,
    approve: seed % 4 === 0,
    delete: seed % 5 === 0,
    export: seed % 3 === 0,
    admin: seed % 7 === 0,
  };
}

export default function IdentityAccessPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Users');
  const [search, setSearch] = useState('');

  const users = useMemo<UserRecord[]>(() => {
    const names = [
      'Deepak Rao',
      'Riya Sinha',
      'Mohan Patel',
      'Anika Khan',
      'Suresh Menon',
      'Lina Farouk',
      'Karim Haddad',
      'Aisha Rahman',
      'Rohan Das',
      'Mira Thomas',
      'Nikhil Varma',
      'Sana Malik',
      'Arjun Pillai',
      'Karan Iyer',
      'Leena George',
      'Samir Qureshi',
    ];

    return names.map((name, i) => ({
      userId: `DNOS-U-${String(1000 + i)}`,
      name,
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      role: ROLES[i % ROLES.length],
      manager: i % 4 === 0 ? 'Executive Office' : names[(i + 3) % names.length],
      status: i % 13 === 0 ? 'Locked' : i % 7 === 0 ? 'Pending Approval' : i % 11 === 0 ? 'Inactive' : 'Active',
      lastLogin: `2026-07-${String(7 - (i % 6)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:2${i % 6}`,
      mfa: i % 5 === 0 ? 'Disabled' : 'Enabled',
      country: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Bahrain'][i % 4],
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@deepsea-nexus.com`,
      phone: `+971-5${(i % 8) + 1}-44${String(1000 + i)}`,
    }));
  }, []);

  const permissionMatrix = useMemo(() => {
    const matrix = new Map<string, PermissionCell>();
    MODULES.forEach((module, i) => matrix.set(module, makePermission(i + 1)));
    return matrix;
  }, []);

  const auditLog = useMemo<AuditRecord[]>(
    () => [
      { event: 'Login', timestamp: '2026-07-07 09:08', user: 'Deepak Rao', ip: '10.22.4.11', detail: 'Successful MFA challenge.' },
      { event: 'Permission Change', timestamp: '2026-07-07 09:22', user: 'Leena George', ip: '10.22.4.77', detail: 'Enabled export for Risk module.' },
      { event: 'Role Change', timestamp: '2026-07-07 09:35', user: 'Executive Office', ip: '10.22.3.4', detail: 'Assigned Treasury Officer role to Mohan Patel.' },
      { event: 'Approval', timestamp: '2026-07-07 10:02', user: 'Credit Committee', ip: '10.22.8.19', detail: 'Approved dual-approval matrix update.' },
      { event: 'Export', timestamp: '2026-07-07 10:28', user: 'Sana Malik', ip: '10.22.2.61', detail: 'Exported monthly permission snapshot.' },
      { event: 'Document Download', timestamp: '2026-07-07 11:10', user: 'Aisha Rahman', ip: '10.22.6.42', detail: 'Downloaded secure user access policy.' },
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (!q) return true;
      const haystack = [u.userId, u.name, u.department, u.role, u.manager, u.country, u.email, u.phone].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [users, search]);

  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'Active').length;
    const pendingApprovals = users.filter((u) => u.status === 'Pending Approval').length;
    const locked = users.filter((u) => u.status === 'Locked').length;
    const mfaEnabled = users.filter((u) => u.mfa === 'Enabled').length;
    const systemHealth = `${Math.max(90, 100 - locked - (users.length - mfaEnabled))}%`;

    return [
      { label: 'Total Users', value: String(totalUsers) },
      { label: 'Active Users', value: String(activeUsers) },
      { label: 'Departments', value: String(DEPARTMENTS.length) },
      { label: 'Roles', value: String(ROLES.length) },
      { label: 'Pending Approvals', value: String(pendingApprovals) },
      { label: 'Locked Accounts', value: String(locked) },
      { label: 'MFA Enabled', value: `${mfaEnabled}/${totalUsers}` },
      { label: 'System Health', value: systemHealth },
    ];
  }, [users]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1850px] space-y-6 pb-24">
        <SectionCard title="Identity & Access Management" icon={ShieldCheck}>
          <p className="text-sm text-slate-300">Enterprise Users, Roles, Permissions & Departments</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{m.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{m.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Workspace Tabs" icon={Users}>
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
              {activeTab === 'Users' ? (
                <>
                  <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search users, departments, role, manager, country, email"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Institutional User Grid</p>
                    <table className="mt-3 min-w-[1600px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-2 py-2">User ID</th>
                          <th className="px-2 py-2">Name</th>
                          <th className="px-2 py-2">Department</th>
                          <th className="px-2 py-2">Role</th>
                          <th className="px-2 py-2">Manager</th>
                          <th className="px-2 py-2">Status</th>
                          <th className="px-2 py-2">Last Login</th>
                          <th className="px-2 py-2">MFA</th>
                          <th className="px-2 py-2">Country</th>
                          <th className="px-2 py-2">Email</th>
                          <th className="px-2 py-2">Phone</th>
                          <th className="px-2 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-200">
                        {filteredUsers.map((u) => (
                          <tr key={u.userId} className="border-t border-slate-800">
                            <td className="px-2 py-2 font-semibold text-cyan-300">{u.userId}</td>
                            <td className="px-2 py-2">{u.name}</td>
                            <td className="px-2 py-2">{u.department}</td>
                            <td className="px-2 py-2">{u.role}</td>
                            <td className="px-2 py-2">{u.manager}</td>
                            <td className={`px-2 py-2 font-semibold ${statusClass(u.status)}`}>{u.status}</td>
                            <td className="px-2 py-2">{u.lastLogin}</td>
                            <td className={`px-2 py-2 ${u.mfa === 'Enabled' ? 'text-emerald-300' : 'text-rose-300'}`}>{u.mfa}</td>
                            <td className="px-2 py-2">{u.country}</td>
                            <td className="px-2 py-2">{u.email}</td>
                            <td className="px-2 py-2">{u.phone}</td>
                            <td className="px-2 py-2">
                              <div className="flex flex-wrap gap-1">
                                <button type="button" className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">Edit</button>
                                <button type="button" className="rounded border border-amber-700/40 bg-amber-950/30 px-2 py-1 text-xs text-amber-200">Reset Password</button>
                                <button type="button" className="rounded border border-rose-700/40 bg-rose-950/30 px-2 py-1 text-xs text-rose-200">Lock</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}

              {activeTab === 'Roles' ? (
                <SectionCard title="Role Catalog" icon={UserRoundCheck}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {ROLES.map((role) => (
                      <div key={role} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">{role}</p>
                        <p className="mt-1 text-xs text-slate-400">Scoped permissions configured for institutional controls.</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Departments' ? (
                <SectionCard title="Department Registry" icon={Users}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {DEPARTMENTS.map((dept, i) => (
                      <div key={dept} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">{dept}</p>
                        <p className="mt-1 text-xs text-slate-400">Users: {3 + (i % 8)} | Roles mapped: {2 + (i % 5)}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Permission Matrix' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Module Permission Matrix</p>
                  <table className="mt-3 min-w-[1200px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Module</th>
                        <th className="px-2 py-2">View</th>
                        <th className="px-2 py-2">Create</th>
                        <th className="px-2 py-2">Edit</th>
                        <th className="px-2 py-2">Approve</th>
                        <th className="px-2 py-2">Delete</th>
                        <th className="px-2 py-2">Export</th>
                        <th className="px-2 py-2">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {MODULES.map((module) => {
                        const p = permissionMatrix.get(module);
                        if (!p) return null;
                        return (
                          <tr key={module} className="border-t border-slate-800">
                            <td className="px-2 py-2 font-semibold text-slate-100">{module}</td>
                            <td className="px-2 py-2">{boolCell(p.view)}</td>
                            <td className="px-2 py-2">{boolCell(p.create)}</td>
                            <td className="px-2 py-2">{boolCell(p.edit)}</td>
                            <td className="px-2 py-2">{boolCell(p.approve)}</td>
                            <td className="px-2 py-2">{boolCell(p.delete)}</td>
                            <td className="px-2 py-2">{boolCell(p.export)}</td>
                            <td className="px-2 py-2">{boolCell(p.admin)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Approval Matrix' ? (
                <SectionCard title="Approval Configuration" icon={CheckCircle2}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Approval Levels</p><p className="mt-1 text-sm text-slate-100">{'L1 RM -> L2 Department Head -> L3 Committee'}</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Escalation</p><p className="mt-1 text-sm text-slate-100">Auto-escalate after 4 business hours</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Delegation</p><p className="mt-1 text-sm text-slate-100">Dual delegate model enabled for managers</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Approval Limits</p><p className="mt-1 text-sm text-slate-100">RM AED 2M | Head AED 10M | Committee Unlimited</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Dual Approval</p><p className="mt-1 text-sm text-slate-100">Required for legal + treasury overrides</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Committee Approval</p><p className="mt-1 text-sm text-slate-100">Credit + Risk quorum enforced</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Time Limits</p><p className="mt-1 text-sm text-slate-100">Critical items SLA 2 hours</p></div>
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Audit' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">IAM Audit Trail</p>
                  <table className="mt-3 min-w-[1000px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Event</th>
                        <th className="px-2 py-2">Timestamp</th>
                        <th className="px-2 py-2">User</th>
                        <th className="px-2 py-2">IP</th>
                        <th className="px-2 py-2">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {auditLog.map((row) => (
                        <tr key={`${row.event}-${row.timestamp}`} className="border-t border-slate-800">
                          <td className="px-2 py-2 font-semibold text-slate-100">{row.event}</td>
                          <td className="px-2 py-2">{row.timestamp}</td>
                          <td className="px-2 py-2">{row.user}</td>
                          <td className="px-2 py-2">{row.ip}</td>
                          <td className="px-2 py-2">{row.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Security' ? (
                <SectionCard title="Security Controls" icon={ShieldAlert}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Password Policy</p><p className="mt-1 text-sm text-slate-100">Min 14 chars, complexity + history 12</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">MFA</p><p className="mt-1 text-sm text-slate-100">Authenticator + device binding required</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Session Timeout</p><p className="mt-1 text-sm text-slate-100">15 min idle, 8 hour hard cap</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Device Management</p><p className="mt-1 text-sm text-slate-100">Managed endpoints only</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">IP Restrictions</p><p className="mt-1 text-sm text-slate-100">Corporate CIDR + approved VPN ranges</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Login History</p><p className="mt-1 text-sm text-slate-100">Full audit retention 7 years</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Failed Logins</p><p className="mt-1 text-sm text-slate-100">Auto lock after 5 attempts</p></div>
                  </div>
                </SectionCard>
              ) : null}
            </div>

            <div className="space-y-4">
              <SectionCard title="Right Sidebar" icon={AlertTriangle}>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-rose-100">Security Alerts: 3 high-priority alerts require review.</div>
                  <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-3 text-amber-100">Locked Users: {users.filter((u) => u.status === 'Locked').length}</div>
                  <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-3 text-amber-100">Expired Passwords: 5 accounts pending reset.</div>
                  <div className="rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-3 text-cyan-100">Recent Logins: 42 in last 60 minutes.</div>
                  <div className="rounded-lg border border-fuchsia-900/50 bg-fuchsia-950/20 p-3 text-fuchsia-100">Risk Alerts: Privilege escalation check triggered for one admin role.</div>
                </div>
              </SectionCard>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><UserPlus className="h-4 w-4" />New User</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><Users className="h-4 w-4" />New Role</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-700/40 bg-fuchsia-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-200"><UserRoundCheck className="h-4 w-4" />Assign Role</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-amber-700/40 bg-amber-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200"><KeyRound className="h-4 w-4" />Reset Password</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-rose-700/40 bg-rose-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200"><Lock className="h-4 w-4" />Lock User</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-emerald-700/40 bg-emerald-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200"><Lock className="h-4 w-4" />Unlock User</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Download className="h-4 w-4" />Export</button>
        </div>
      </div>
    </div>
  );
}
