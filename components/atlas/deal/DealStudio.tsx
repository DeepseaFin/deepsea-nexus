'use client';

import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  FileText,
  Handshake,
  Search,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  UserPlus,
} from 'lucide-react';
import { useDeal } from '@/components/atlas/common/DealContext';
import type { DealModel, DealWorkflowStep } from '@/atlas-core/deals/DealModel';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';
import ExecutiveVerdict from '@/components/atlas/intelligence/ExecutiveVerdict';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import TrustScore from '@/components/atlas/intelligence/TrustScore';
import DocumentUploadZone, { type UploadedFileView } from '@/components/atlas/documents/DocumentUploadZone';
import FinancialSummary from './FinancialSummary';
import PricingEditor from './PricingEditor';

const workflowSteps: DealWorkflowStep[] = [
  'Client',
  'Counterparty',
  'Commercial Terms',
  'Documents',
  'Intelligence',
  'Recommendation',
  'Term Sheet',
  'Approval',
] as const;

interface DealStudioProps {
  onCancel?: () => void;
}

export default function DealStudio({ onCancel }: DealStudioProps) {
  const {
    deal,
    updateDeal,
    updateClient,
    updateCounterparty,
    updateDocuments,
    updateWorkflow,
  } = useDeal();
  const [clientErrors, setClientErrors] = useState<Partial<Record<'legalName' | 'country' | 'industry' | 'tradeLicense' | 'relationshipManager', string>>>({});
  const [counterpartyErrors, setCounterpartyErrors] = useState<Partial<Record<'name' | 'country' | 'industry' | 'relationshipType', string>>>({});
  const activeStep = deal.workflow.currentStep;
  const activeStepIndex = Math.max(0, workflowSteps.indexOf(activeStep));
  const completedStepSet = new Set(deal.workflow.completedSteps);
  const completion = Math.round(((activeStepIndex + 1) / workflowSteps.length) * 100);

  const outstandingItems = [
    {
      id: 'out-001',
      title: 'Finalize client onboarding checklist',
      description: 'Two KYC artifacts are still pending verification.',
      owner: 'Operations',
      dueDate: '2026-07-06T10:00:00.000Z',
      priority: 'high' as const,
      status: 'in-progress' as const,
    },
    {
      id: 'out-002',
      title: 'Complete legal enforceability confirmation',
      description: 'Awaiting jurisdiction-specific clause confirmation.',
      owner: 'Legal Desk',
      dueDate: '2026-07-07T11:30:00.000Z',
      priority: 'medium' as const,
      status: 'pending' as const,
    },
  ];

  const markStep = (nextStep: DealWorkflowStep, completedSteps: DealWorkflowStep[]) => {
    const dedupedCompleted = Array.from(new Set(completedSteps));
    updateWorkflow({
      currentStep: nextStep,
      completedSteps: dedupedCompleted,
      lastUpdated: new Date().toISOString(),
    });
    updateDeal({ stage: nextStep });
  };

  const movePrevious = () => {
    const prevIndex = Math.max(activeStepIndex - 1, 0);
    markStep(workflowSteps[prevIndex], deal.workflow.completedSteps);
  };

  const moveNext = () => {
    const nextIndex = Math.min(activeStepIndex + 1, workflowSteps.length - 1);
    const current = workflowSteps[activeStepIndex];
    markStep(workflowSteps[nextIndex], [...deal.workflow.completedSteps, current]);
  };

  const jumpToStep = (index: number) => {
    if (index > activeStepIndex) {
      return;
    }

    markStep(workflowSteps[index], deal.workflow.completedSteps);
  };

  const handleClientField = (
    field:
      | 'legalName'
      | 'tradingName'
      | 'country'
      | 'industry'
      | 'registrationNumber'
      | 'tradeLicense'
      | 'website'
      | 'relationshipManager'
      | 'primaryContact'
      | 'email'
      | 'phone'
      | 'clientId'
  ) =>
    (value: string) => {
      updateClient({ [field]: value });
      if (field in clientErrors) {
        setClientErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleCounterpartyField = (
    field:
      | 'name'
      | 'country'
      | 'industry'
      | 'relationshipType'
      | 'paymentTerms'
      | 'internalRating'
      | 'creditLimit'
      | 'existingExposure'
      | 'website'
      | 'primaryContact'
  ) =>
    (value: string) => {
      updateCounterparty({ [field]: value });
      if (field in counterpartyErrors) {
        setCounterpartyErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleDocumentsChange = (files: UploadedFileView[]) => {
    updateDocuments({ uploadedDocuments: files.map((file) => file.name) });
  };

  const validateClientStep = () => {
    const errors: Partial<Record<'legalName' | 'country' | 'industry' | 'tradeLicense' | 'relationshipManager', string>> = {};

    if (!deal.client.legalName.trim()) {
      errors.legalName = 'Legal Name is required.';
    }

    if (!deal.client.country.trim()) {
      errors.country = 'Country is required.';
    }

    if (!deal.client.industry.trim()) {
      errors.industry = 'Industry is required.';
    }

    if (!deal.client.tradeLicense.trim()) {
      errors.tradeLicense = 'Trade License is required.';
    }

    if (!deal.client.relationshipManager.trim()) {
      errors.relationshipManager = 'Relationship Manager is required.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const continueFromClient = () => {
    if (!validateClientStep()) {
      return;
    }

    moveNext();
  };

  const validateCounterpartyStep = () => {
    const errors: Partial<Record<'name' | 'country' | 'industry' | 'relationshipType', string>> = {};

    if (!deal.counterparty.name.trim()) {
      errors.name = 'Counterparty Name is required.';
    }

    if (!deal.counterparty.country.trim()) {
      errors.country = 'Country is required.';
    }

    if (!deal.counterparty.industry.trim()) {
      errors.industry = 'Industry is required.';
    }

    if (!deal.counterparty.relationshipType.trim()) {
      errors.relationshipType = 'Relationship Type is required.';
    }

    setCounterpartyErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const continueFromCounterparty = () => {
    if (!validateCounterpartyStep()) {
      return;
    }

    moveNext();
  };

  const renderActiveWorkspace = () => {
    switch (activeStep) {
      case 'Client':
        return (
          <div className="space-y-6">
            <SectionCard title="Client Search" icon={Search}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <Search className="h-4 w-4 text-cyan-300" />
                  <input
                    type="text"
                    placeholder="Search by Client Name, Registration Number, Trade License, or Tax Number"
                    className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Client Name', 'Registration Number', 'Trade License', 'Tax Number'].map((item) => (
                    <span key={item} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Client Details" icon={UserPlus}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <InputField label="Legal Name" value={deal.client.legalName} onChange={handleClientField('legalName')} placeholder="ABC Limited" error={clientErrors.legalName} required />
                <InputField label="Trading Name" value={deal.client.tradingName} onChange={handleClientField('tradingName')} placeholder="ABC Trading" />
                <InputField label="Country" value={deal.client.country} onChange={handleClientField('country')} placeholder="United Arab Emirates" error={clientErrors.country} required />
                <InputField label="Industry" value={deal.client.industry} onChange={handleClientField('industry')} placeholder="Industrial Trading" error={clientErrors.industry} required />
                <InputField label="Registration Number" value={deal.client.registrationNumber} onChange={handleClientField('registrationNumber')} placeholder="REG-2026-00128" />
                <InputField label="Trade License" value={deal.client.tradeLicense} onChange={handleClientField('tradeLicense')} placeholder="TL-778231" error={clientErrors.tradeLicense} required />
                <InputField label="Website" value={deal.client.website} onChange={handleClientField('website')} placeholder="https://abc.example.com" />
                <InputField label="Relationship Manager" value={deal.client.relationshipManager} onChange={handleClientField('relationshipManager')} placeholder="Deepak Menon" error={clientErrors.relationshipManager} required />
                <InputField label="Primary Contact" value={deal.client.primaryContact} onChange={handleClientField('primaryContact')} placeholder="Rashid Al Mansoor" />
                <InputField label="Email" value={deal.client.email} onChange={handleClientField('email')} placeholder="rashid@abc.example.com" />
                <InputField label="Phone" value={deal.client.phone} onChange={handleClientField('phone')} placeholder="+971 50 123 4567" />
              </div>
            </SectionCard>
          </div>
        );

      case 'Counterparty':
        return (
          <SectionCard title="Counterparty Workspace" icon={Handshake}>
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-300">Counterparty details in the shared deal model.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <InputField label="Counterparty Name" value={deal.counterparty.name} onChange={handleCounterpartyField('name')} placeholder="Mashreq Bank PJSC" error={counterpartyErrors.name} required />
                <InputField label="Country" value={deal.counterparty.country} onChange={handleCounterpartyField('country')} placeholder="United Arab Emirates" error={counterpartyErrors.country} required />
                <InputField label="Industry" value={deal.counterparty.industry} onChange={handleCounterpartyField('industry')} placeholder="Banking" error={counterpartyErrors.industry} required />
                <InputField label="Relationship Type" value={deal.counterparty.relationshipType} onChange={handleCounterpartyField('relationshipType')} placeholder="Primary Buyer Bank" error={counterpartyErrors.relationshipType} required />
                <InputField label="Payment Terms" value={deal.counterparty.paymentTerms} onChange={handleCounterpartyField('paymentTerms')} placeholder="Net 45" />
                <InputField label="Internal Rating" value={deal.counterparty.internalRating} onChange={handleCounterpartyField('internalRating')} placeholder="A" />
                <InputField label="Credit Limit" value={deal.counterparty.creditLimit} onChange={handleCounterpartyField('creditLimit')} placeholder="4500000" />
                <InputField label="Existing Exposure" value={deal.counterparty.existingExposure} onChange={handleCounterpartyField('existingExposure')} placeholder="1800000" />
                <InputField label="Website" value={deal.counterparty.website} onChange={handleCounterpartyField('website')} placeholder="https://counterparty.example.com" />
                <InputField label="Primary Contact" value={deal.counterparty.primaryContact} onChange={handleCounterpartyField('primaryContact')} placeholder="Fatima Al Nuaimi" />
              </div>
            </div>
          </SectionCard>
        );

      case 'Commercial Terms':
        return (
          <div className="space-y-6">
            <FinancialSummary />
            <SectionCard title="Pricing Workspace" icon={ClipboardList}>
              <PricingEditor />
            </SectionCard>
          </div>
        );

      case 'Documents':
        return (
          <SectionCard title="Documents Workspace" icon={FileText}>
            <DocumentUploadZone onFilesChange={handleDocumentsChange} />
          </SectionCard>
        );

      case 'Intelligence':
        return (
          <SectionCard title="Intelligence Workspace" icon={ShieldCheck}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Trust Score</p>
                <div className="mt-2">
                  <TrustScore score={deal.intelligence.trustScore} label="Transaction Trust" size="sm" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Deal Confidence Index</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">{deal.intelligence.dealConfidenceIndex}</p>
                <p className="mt-1 text-xs text-slate-500">Composite confidence placeholder for intelligence step.</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Intelligence Summary</p>
                <p className="mt-2 text-sm text-slate-300">No critical anomalies detected; proceed to recommendation with conditions.</p>
              </div>
            </div>
          </SectionCard>
        );

      case 'Recommendation':
        return (
          <ExecutiveVerdict
            title="Executive Recommendation"
            recommendation={deal.intelligence.recommendation}
            overallReadiness={82}
            riskLevel="Medium"
            criticalBlockers={[
              'Pending final legal rider sign-off',
              'Counterparty concentration comment required in approval memo',
            ]}
            estimatedFundingTime="1-2 Business Days"
          />
        );

      case 'Term Sheet':
        return (
          <SectionCard title="Term Sheet Workspace" icon={FileCheck2}>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-300">Professional placeholder for term sheet generation and review workflow.</p>
              <p className="mt-2 text-xs text-slate-500">Template population, legal markup, and approval circulation are intentionally not wired in this sprint.</p>
            </div>
          </SectionCard>
        );

      case 'Approval':
        return (
          <SectionCard title="Approval Workspace" icon={CheckCircle2}>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-300">Professional placeholder for approval routing and committee decision workflow.</p>
              <p className="mt-2 text-xs text-slate-500">Approval statuses and routing logic remain intentionally unconnected in this composition-only implementation.</p>
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Deal Header" className="border-cyan-900/30 bg-slate-950/70">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <HeaderItem label="Client" value={deal.client.legalName} />
          <HeaderItem label="Counterparty" value={deal.counterparty.name} />
          <HeaderItem label="Product" value={deal.deal.product} />
          <HeaderItem label="Stage" value={activeStep} />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
          {workflowSteps.map((step, index) => {
            const selected = activeStepIndex === index;
            const completed = completedStepSet.has(step);
            const disabled = index > activeStepIndex;

            return (
              <button
                key={step}
                type="button"
                disabled={disabled}
                onClick={() => jumpToStep(index)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? 'border-cyan-700/60 bg-cyan-950/30 text-cyan-100'
                    : completed
                      ? 'border-emerald-800/50 bg-emerald-950/20 text-emerald-200 hover:border-emerald-700/60'
                      : 'border-slate-800 bg-slate-900/40 text-slate-500'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {completed ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-700 bg-emerald-900/40 text-emerald-200">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-cyan-700 bg-cyan-900/40 text-cyan-100' : 'border-slate-700 text-slate-400'}`}>
                      {index + 1}
                    </span>
                  )}
                  {step}
                </span>
              </button>
            );
          })}
        </aside>

        <main className="min-w-0">
          <div className="space-y-6">{renderActiveWorkspace()}</div>
        </main>

        <aside className="space-y-4">{renderSidebar(activeStep, completion, outstandingItems, deal)}</aside>
      </div>

      {activeStepIndex === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <button
            type="button"
            onClick={movePrevious}
            disabled={activeStepIndex === 0}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={continueFromClient}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <button
            type="button"
            onClick={movePrevious}
            disabled={activeStepIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={activeStep === 'Counterparty' ? continueFromCounterparty : moveNext}
            disabled={activeStepIndex === workflowSteps.length - 1}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {activeStep === 'Counterparty' ? 'Continue' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={activeStepIndex < 5}
            className="rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Term Sheet
          </button>

          <button
            type="button"
            disabled={activeStepIndex < 6}
            className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit for Approval
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

function HeaderItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function WorkspaceField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-wide text-slate-400">
        {label} {required ? <span className="text-rose-400">*</span> : null}
      </span>
      <input
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 ${error ? 'border-rose-700' : 'border-slate-700'}`}
      />
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
    </label>
  );
}

function renderSidebar(
  activeStep: DealWorkflowStep,
  completion: number,
  outstandingItems: {
    id: string;
    title: string;
    description: string;
    owner: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in-progress' | 'completed';
  }[],
  deal: DealModel
) {
  if (activeStep === 'Client') {
    return (
      <>
        <SectionCard title="Client Status">
          <p className="text-sm font-semibold text-emerald-300">{deal.client.legalName || 'Not Set'}</p>
          <p className="mt-2 text-xs text-slate-400">Client Name</p>
        </SectionCard>

        <SectionCard title="Country">
          <p className="text-sm font-semibold text-cyan-200">{deal.client.country || 'Not Set'}</p>
          <p className="mt-2 text-xs text-slate-400">Client Country</p>
        </SectionCard>

        <SectionCard title="Industry">
          <p className="text-sm font-semibold text-slate-100">{deal.client.industry || 'Not Set'}</p>
          <p className="mt-2 text-xs text-slate-400">Client Industry</p>
        </SectionCard>

        <SectionCard title="Internal Rating">
          <p className="text-sm font-semibold text-emerald-300">{deal.client.internalRating || 'Not Rated'}</p>
          <p className="mt-2 text-xs text-slate-400">Internal Rating</p>
        </SectionCard>

        <SectionCard title="Relationship Status">
          <p className="text-sm font-semibold text-slate-100">{deal.client.relationshipStatus || 'Not Set'}</p>
          <p className="mt-2 text-xs text-slate-400">Relationship Status</p>
        </SectionCard>
      </>
    );
  }

  if (activeStep === 'Counterparty') {
    const creditLimit = Number(deal.counterparty.creditLimit || 0);
    const existingExposure = Number(deal.counterparty.existingExposure || 0);
    const availableHeadroom = Math.max(creditLimit - existingExposure, 0);

    return (
      <>
        <SectionCard title="Counterparty">
          <p className="text-sm font-semibold text-emerald-300">{deal.counterparty.name || 'Not Set'}</p>
          <p className="mt-2 text-xs text-slate-400">Counterparty</p>
        </SectionCard>

        <SectionCard title="Country">
          <p className="text-sm font-semibold text-cyan-200">{deal.counterparty.country || 'Not Set'}</p>
          <p className="mt-2 text-xs text-slate-400">Counterparty Country</p>
        </SectionCard>

        <SectionCard title="Industry">
          <p className="text-sm font-semibold text-slate-100">{deal.counterparty.industry || 'Not Set'}</p>
          <p className="mt-2 text-xs text-slate-400">Counterparty Industry</p>
        </SectionCard>

        <SectionCard title="Internal Rating">
          <p className="text-sm font-semibold text-emerald-300">{deal.counterparty.internalRating || 'Not Rated'}</p>
          <p className="mt-2 text-xs text-slate-400">Internal Rating</p>
        </SectionCard>

        <SectionCard title="Current Exposure">
          <p className="text-sm font-semibold text-slate-100">AED {new Intl.NumberFormat('en-AE').format(existingExposure)}</p>
          <p className="mt-2 text-xs text-slate-400">Current Exposure</p>
        </SectionCard>

        <SectionCard title="Available Headroom">
          <p className="text-sm font-semibold text-cyan-200">AED {new Intl.NumberFormat('en-AE').format(availableHeadroom)}</p>
          <p className="mt-2 text-xs text-slate-400">Available Headroom</p>
        </SectionCard>
      </>
    );
  }

  return (
    <>
      <SectionCard title="Deal Completion" icon={CheckCircle2}>
        <p className="text-4xl font-semibold text-emerald-300">{completion}%</p>
        <p className="mt-2 text-sm text-slate-400">Placeholder completion status.</p>
        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${completion}%` }} />
        </div>
      </SectionCard>

      <SectionCard title="Trust Score">
        <TrustScore score={deal.intelligence.trustScore} label="Transaction Trust" size="sm" />
      </SectionCard>

      <SectionCard title="DCI" icon={Sparkles}>
        <p className="text-4xl font-semibold text-emerald-300">{deal.intelligence.dealConfidenceIndex}</p>
        <p className="mt-2 text-sm text-slate-400">Placeholder confidence index.</p>
      </SectionCard>

      <ActionPanel actions={outstandingItems} title="Outstanding Items" />

      <SectionCard title="Next Recommended Action">
        <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-4">
          <p className="text-sm font-semibold text-cyan-100">Close legal and onboarding exceptions before term sheet release.</p>
          <p className="mt-2 text-xs text-slate-400">Owner: Deal Manager | Target: Within 24 hours</p>
        </div>
      </SectionCard>
    </>
  );
}
