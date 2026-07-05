'use client';

import {
  Activity,
  FileText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  WandSparkles,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';
import TrustScore from '@/components/atlas/intelligence/TrustScore';

const kpis = [
  { label: 'Total Term Sheets', value: '132', note: 'Institutional portfolio-wide documents' },
  { label: 'Draft', value: '28', note: 'In drafting and internal structuring' },
  { label: 'Pending Approval', value: '19', note: 'Awaiting committee or legal sign-off' },
  { label: 'Executed', value: '85', note: 'Signed and operationally active' },
];

const termSheets = [
  {
    referenceNo: 'TS-2026-0047',
    client: 'Apex Industrial Supplies LLC',
    counterparty: 'Mashreq Bank PJSC',
    product: 'Receivables Financing',
    fundingAmount: 'AED 12.5M',
    status: 'Pending Approval',
    lastModified: '05 Jul 2026 10:12',
    owner: 'Legal Operations',
  },
  {
    referenceNo: 'TS-2026-0044',
    client: 'Falcon Maritime Services WLL',
    counterparty: 'Gulf Maritime Logistics LLC',
    product: 'Invoice Discounting',
    fundingAmount: 'AED 7.9M',
    status: 'Draft',
    lastModified: '05 Jul 2026 09:26',
    owner: 'Deal Manager',
  },
  {
    referenceNo: 'TS-2026-0039',
    client: 'Crescent Health Procurement Ltd',
    counterparty: 'Crescent Healthcare Distribution SPC',
    product: 'Purchase Order Finance',
    fundingAmount: 'AED 9.4M',
    status: 'Executed',
    lastModified: '04 Jul 2026 17:03',
    owner: 'Credit Secretariat',
  },
  {
    referenceNo: 'TS-2026-0032',
    client: 'Summit Infrastructure Trading LLC',
    counterparty: 'Northern Infrastructure Buyers Ltd.',
    product: 'Supply Chain Finance',
    fundingAmount: 'AED 14.8M',
    status: 'Pending Approval',
    lastModified: '04 Jul 2026 13:41',
    owner: 'Risk Team',
  },
  {
    referenceNo: 'TS-2026-0028',
    client: 'Blue Horizon Commodities DMCC',
    counterparty: 'Blue Horizon Trade Facilitators',
    product: 'Working Capital',
    fundingAmount: 'AED 6.3M',
    status: 'Draft',
    lastModified: '03 Jul 2026 16:55',
    owner: 'Structuring Office',
  },
];

const preview = {
  executiveSummary:
    'Structured receivables facility with institutional obligor backing, enforceable assignment mechanics, and policy-compliant pricing aligned to current risk posture.',
  commercialTerms: [
    'Facility Size: AED 12.5M',
    'Tenor: 90 Days',
    'Advance Rate: 90%',
    'Disbursement Mode: Controlled Account',
  ],
  pricing: [
    'Discount Rate: 1.65% p.a.',
    'Broker Commission: 2.00%',
    'Net Disbursement: AED 11.86M',
  ],
  security: [
    'Assignment of receivables',
    'Corporate guarantee',
    'Escrow collection waterfall',
  ],
  conditionsPrecedent: [
    'Executed assignment notice',
    'Updated board resolution',
    'Legal opinion on enforceability',
  ],
  approvals: [
    'Credit Committee: Approved with conditions',
    'Risk Review: Approved',
    'Legal: Pending final markup',
  ],
};

const generationStatuses = [
  { title: 'Document Generator', status: 'In Progress', note: 'Draft v3 generated with latest commercial terms.' },
  { title: 'Legal Review', status: 'Pending', note: 'Final legal markup and enforceability comments outstanding.' },
  { title: 'Credit Review', status: 'Completed', note: 'Credit committee conditions documented and accepted.' },
  { title: 'Risk Review', status: 'Completed', note: 'Risk policy checks passed for current structure.' },
  { title: 'Execution Status', status: 'Awaiting Sign-off', note: 'Counterparty signature window not yet opened.' },
];

const recentActivity = [
  {
    time: '09:15',
    title: 'Term sheet draft regenerated',
    detail: 'TS-2026-0047 regenerated after pricing adjustment approval.',
  },
  {
    time: '10:05',
    title: 'Legal markup request submitted',
    detail: 'External counsel comments requested for enforceability confirmation.',
  },
  {
    time: '11:22',
    title: 'Credit conditions appended',
    detail: 'Additional covenant language inserted into pending approval drafts.',
  },
  {
    time: '13:48',
    title: 'Execution checklist updated',
    detail: 'Signature sequencing and document control checklist finalized.',
  },
];

const nextActions = [
  {
    id: 'ts-act-001',
    title: 'Close legal markup on pending term sheets',
    description: 'Obtain final legal comments and move drafts to execution-ready status.',
    owner: 'Legal Operations',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    priority: 'critical' as const,
    status: 'in-progress' as const,
  },
  {
    id: 'ts-act-002',
    title: 'Validate commercial terms with deal managers',
    description: 'Reconfirm pricing and tenor assumptions before final approval circulation.',
    owner: 'Structuring Office',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high' as const,
    status: 'pending' as const,
  },
  {
    id: 'ts-act-003',
    title: 'Prepare execution pack for signatory workflow',
    description: 'Assemble signature copies and routing package for institutional signatories.',
    owner: 'Document Control',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium' as const,
    status: 'pending' as const,
  },
];

export default function TermSheetsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Term Sheet Management" icon={FileText}>
          <p className="text-sm text-slate-300">Generate, review and manage financing documents.</p>
        </SectionCard>

        <SectionCard title="Search & Filters" icon={SlidersHorizontal}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <Search className="h-4 w-4 text-cyan-300" />
                <input
                  type="text"
                  placeholder="Search by reference, client, deal, owner"
                  className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
              <option>Client</option>
              <option>Apex Industrial Supplies LLC</option>
              <option>Falcon Maritime Services WLL</option>
              <option>Crescent Health Procurement Ltd</option>
            </select>
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
              <option>Counterparty</option>
              <option>Mashreq Bank PJSC</option>
              <option>Gulf Maritime Logistics LLC</option>
              <option>Northern Infrastructure Buyers Ltd.</option>
            </select>
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
              <option>Deal</option>
              <option>DNX-2026-000188</option>
              <option>DNX-2026-000173</option>
              <option>DNX-2026-000161</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
                <option>Status</option>
                <option>Draft</option>
                <option>Pending Approval</option>
                <option>Executed</option>
              </select>
              <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
                <option>Product</option>
                <option>Receivables Financing</option>
                <option>Invoice Discounting</option>
                <option>Supply Chain Finance</option>
                <option>Working Capital</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="KPI Cards" icon={ShieldCheck}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{kpi.value}</p>
                <p className="mt-1 text-xs text-slate-500">{kpi.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
          <SectionCard title="Term Sheet Table" icon={FileText} className="h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-3">Reference No.</th>
                    <th className="px-3 py-3">Client</th>
                    <th className="px-3 py-3">Counterparty</th>
                    <th className="px-3 py-3">Product</th>
                    <th className="px-3 py-3">Funding Amount</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Last Modified</th>
                    <th className="px-3 py-3">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {termSheets.map((sheet) => (
                    <tr key={sheet.referenceNo} className="hover:bg-slate-900/60">
                      <td className="px-3 py-3 font-medium text-slate-100">{sheet.referenceNo}</td>
                      <td className="px-3 py-3">{sheet.client}</td>
                      <td className="px-3 py-3">{sheet.counterparty}</td>
                      <td className="px-3 py-3">{sheet.product}</td>
                      <td className="px-3 py-3">{sheet.fundingAmount}</td>
                      <td className="px-3 py-3">{sheet.status}</td>
                      <td className="px-3 py-3">{sheet.lastModified}</td>
                      <td className="px-3 py-3">{sheet.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Preview Panel" icon={WandSparkles}>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Executive Summary</p>
                <p className="mt-2 text-sm text-slate-300">{preview.executiveSummary}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Commercial Terms</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {preview.commercialTerms.map((term) => (
                    <li key={term}>{term}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Pricing</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {preview.pricing.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Security</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {preview.security.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Conditions Precedent</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {preview.conditionsPrecedent.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Approvals</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {preview.approvals.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <TrustScore score={87} label="Document Confidence" size="sm" />
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Generation Status" icon={ShieldCheck}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {generationStatuses.map((status) => (
              <div key={status.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm font-semibold text-slate-100">{status.title}</p>
                <p className="mt-2 inline-flex rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
                  {status.status}
                </p>
                <p className="mt-2 text-xs text-slate-500">{status.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionCard title="Recent Activity" icon={Activity}>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={`${item.time}-${item.title}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <ActionPanel actions={nextActions} title="Next Actions" />
        </div>
      </div>
    </div>
  );
}
