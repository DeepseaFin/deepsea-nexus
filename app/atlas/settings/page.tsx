'use client';

import SectionCard from '@/components/atlas/intelligence/SectionCard';

const userPreferences = [
  { label: 'Profile', value: 'Deepak Menon | Chief Executive Officer' },
  { label: 'Language', value: 'English (United Arab Emirates)' },
  { label: 'Theme', value: 'Atlas Institutional Dark' },
  { label: 'Time Zone', value: 'Gulf Standard Time (UTC+04:00)' },
];

const organization = [
  { label: 'Company Information', value: 'Deepsea Nexus Capital | Trade Finance Platform' },
  { label: 'Branches', value: 'Dubai HQ | Riyadh Desk | Doha Desk | Bahrain Operations' },
  { label: 'Users', value: '148 active users across business, risk, and operations' },
  { label: 'Roles', value: 'Executive, Credit, Legal, Operations, Treasury, Compliance' },
];

const riskConfiguration = [
  { label: 'Risk Parameters', value: 'Portfolio VaR cap 6.5% | Sector concentration cap 30%' },
  { label: 'Credit Policies', value: 'Institutional obligor-first underwriting standard v3.2' },
  { label: 'Approval Thresholds', value: 'Auto-route: > AED 5M or DCI < 70 to committee review' },
];

const aiConfiguration = [
  { label: 'Engine Status', value: 'Document: Active | Credit: Active | Legal: Monitoring | Fraud: Active' },
  { label: 'Decision Policies', value: 'Policy profile: Balanced Governance with human override enabled' },
  { label: 'Learning Controls', value: 'Continuous learning in supervised mode with weekly validation cycle' },
];

const integrations = [
  { label: 'Banking', value: '3 partner bank connectors configured | 2 active settlement rails' },
  { label: 'OCR', value: 'Primary OCR pipeline active | fallback engine standby' },
  { label: 'Email', value: 'Institutional SMTP relay connected with approval notifications enabled' },
  { label: 'Storage', value: 'Encrypted document vault with 7-year retention policy active' },
];

const notifications = [
  { label: 'Email', value: 'Executive digests daily at 07:30 GST | critical events instant' },
  { label: 'Dashboard Alerts', value: 'Credit, fraud, legal, and maturity alerts enabled' },
  { label: 'Escalations', value: 'SLA breaches escalate to Credit Head and Operations Director' },
];

const auditGovernance = [
  { label: 'Audit Logs', value: 'Immutable activity journal retention: 10 years' },
  { label: 'Access Control', value: 'RBAC + SSO enforced | privileged access quarterly review' },
  { label: 'Compliance', value: 'Policy attestations current | last compliance review: 02 Jul 2026' },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Settings Workspace">
          <p className="text-sm text-slate-300">
            Institutional platform configuration and governance controls.
          </p>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <SettingsSection title="1. User Preferences" items={userPreferences} />
          <SettingsSection title="2. Organization" items={organization} />
          <SettingsSection title="3. Risk Configuration" items={riskConfiguration} />
          <SettingsSection title="4. AI Configuration" items={aiConfiguration} />
          <SettingsSection title="5. Integrations" items={integrations} />
          <SettingsSection title="6. Notifications" items={notifications} />
          <div className="xl:col-span-2">
            <SettingsSection title="7. Audit & Governance" items={auditGovernance} columns="grid-cols-1 md:grid-cols-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  items,
  columns = 'grid-cols-1 md:grid-cols-2',
}: {
  title: string;
  items: Array<{ label: string; value: string }>;
  columns?: string;
}) {
  return (
    <SectionCard title={title}>
      <div className={`grid gap-3 ${columns}`}>
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
