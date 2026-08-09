'use client';

import {
  useMemo,
  useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Search,
  UserPlus,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import TrustScore from '@/components/atlas/intelligence/TrustScore';
import PricingEditor from '@/components/atlas/deal/PricingEditor';
import DocumentUploadZone, { type UploadedFileView } from '@/components/atlas/documents/DocumentUploadZone';

const steps = [
  'Select Client',
  'Select Counterparty',
  'Deal Details',
  'Pricing',
  'Documents',
  'AI Review',
  'Review & Create Deal',
] as const;

const clients = [
  'Apex Industrial Supplies LLC',
  'Falcon Maritime Services WLL',
  'Crescent Health Procurement Ltd',
  'Blue Horizon Commodities DMCC',
];

const counterparties = [
  'Mashreq Bank PJSC',
  'Gulf Maritime Logistics LLC',
  'Crescent Healthcare Distribution SPC',
  'Northern Infrastructure Buyers Ltd.',
];

const products = [
  'Receivables Financing',
  'Invoice Discounting',
  'Supply Chain Finance',
  'Purchase Order Finance',
] as const;

const currencies = ['AED', 'USD', 'SAR', 'QAR', 'BHD'] as const;

export default function NewDealWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [selectedCounterparty, setSelectedCounterparty] = useState(counterparties[0]);

  const [product, setProduct] = useState<(typeof products)[number]>(products[0]);
  const [currency, setCurrency] = useState<(typeof currencies)[number]>(currencies[0]);
  const [invoiceAmount, setInvoiceAmount] = useState('2500000');
  const [fundingRequired, setFundingRequired] = useState('2250000');
  const [tenure, setTenure] = useState('90');

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileView[]>([]);
  const [created, setCreated] = useState(false);

  const totalSteps = steps.length;

  const canGoBack = currentStep > 1;
  const isLastStep = currentStep === totalSteps;

  const aiPreview = useMemo(() => {
    const completion = uploadedFiles.length === 0 ? 0 : Math.min(100, 40 + uploadedFiles.length * 12);
    const trustScore = uploadedFiles.length === 0 ? 62 : Math.min(95, 70 + uploadedFiles.length * 4);
    const dci = Math.round((completion + trustScore) / 2);

    return {
      completion,
      trustScore,
      dci,
      verdict: uploadedFiles.length >= 3 ? 'Proceed with Conditions' : 'Await Documents',
    };
  }, [uploadedFiles]);

  const goNext = () => {
    if (isLastStep) {
      setCreated(true);
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, totalSteps));
    setCreated(false);
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
    setCreated(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SectionCard title="Step 1 - Select Client" iconKey="users">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <Search className="h-4 w-4 text-cyan-300" />
                <input
                  type="text"
                  placeholder="Search existing client"
                  className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>

              <select
                value={selectedClient}
                onChange={(event) => setSelectedClient(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
              >
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-200"
              >
                <UserPlus className="h-4 w-4" />
                Create new client shortcut
              </button>
            </div>
          </SectionCard>
        );

      case 2:
        return (
          <SectionCard title="Step 2 - Select Counterparty" iconKey="building-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <Search className="h-4 w-4 text-cyan-300" />
                <input
                  type="text"
                  placeholder="Search existing counterparty"
                  className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>

              <select
                value={selectedCounterparty}
                onChange={(event) => setSelectedCounterparty(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
              >
                {counterparties.map((counterparty) => (
                  <option key={counterparty} value={counterparty}>
                    {counterparty}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-200"
              >
                <UserPlus className="h-4 w-4" />
                Add new counterparty shortcut
              </button>
            </div>
          </SectionCard>
        );

      case 3:
        return (
          <SectionCard title="Step 3 - Deal Details" iconKey="clipboard-list">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Product</span>
                <select
                  value={product}
                  onChange={(event) => setProduct(event.target.value as (typeof products)[number])}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                >
                  {products.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Currency</span>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value as (typeof currencies)[number])}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                >
                  {currencies.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Invoice Amount</span>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(event) => setInvoiceAmount(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Funding Required</span>
                <input
                  type="number"
                  value={fundingRequired}
                  onChange={(event) => setFundingRequired(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Tenure (Days)</span>
                <input
                  type="number"
                  value={tenure}
                  onChange={(event) => setTenure(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                />
              </label>
            </div>
          </SectionCard>
        );

      case 4:
        return (
          <SectionCard title="Step 4 - Pricing" iconKey="sparkles">
            <PricingEditor />
          </SectionCard>
        );

      case 5:
        return (
          <SectionCard title="Step 5 - Documents" iconKey="folder-open">
            <DocumentUploadZone onFilesChange={setUploadedFiles} />
          </SectionCard>
        );

      case 6:
        return (
          <div className="space-y-6">
            <SectionCard title="Step 6 - AI Review" iconKey="shield-check">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Document Intelligence</p>
                  <p className="mt-2 text-lg font-semibold text-slate-100">{aiPreview.completion}% Complete</p>
                  <p className="mt-1 text-xs text-slate-500">Placeholder summary from uploaded documents.</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <TrustScore score={aiPreview.trustScore} label="Trust Score" size="sm" />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Deal Confidence Index</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-300">{aiPreview.dci}</p>
                  <p className="mt-1 text-xs text-slate-500">Composite placeholder DCI signal.</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Executive Verdict</p>
                  <p className="mt-2 text-lg font-semibold text-cyan-200">{aiPreview.verdict}</p>
                  <p className="mt-1 text-xs text-slate-500">Await final human approval after full review.</p>
                </div>
              </div>
            </SectionCard>
          </div>
        );

      case 7:
        return (
          <SectionCard title="Step 7 - Review & Create Deal" iconKey="file-text">
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <SummaryRow label="Client" value={selectedClient} />
                <SummaryRow label="Counterparty" value={selectedCounterparty} />
                <SummaryRow label="Product" value={product} />
                <SummaryRow label="Currency" value={currency} />
                <SummaryRow label="Invoice Amount" value={invoiceAmount} />
                <SummaryRow label="Funding Required" value={fundingRequired} />
                <SummaryRow label="Tenure" value={`${tenure} Days`} />
                <SummaryRow label="Uploaded Documents" value={`${uploadedFiles.length} file(s)`} />
              </div>

              <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-4 text-sm text-cyan-100">
                Summary only. Final creation action is intentionally placeholder in this sprint.
              </div>

              {created && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-800/40 bg-emerald-950/20 px-4 py-2 text-sm font-medium text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Deal creation submitted (placeholder).
                </div>
              )}
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">ATLAS Deal Onboarding</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100 sm:text-2xl">New Deal Wizard</h2>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
        {steps.map((stepLabel, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <div
              key={stepLabel}
              className={`rounded-xl border px-3 py-2 text-xs ${
                isCurrent
                  ? 'border-cyan-700/60 bg-cyan-950/30 text-cyan-100'
                  : isComplete
                    ? 'border-emerald-800/50 bg-emerald-950/20 text-emerald-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
              }`}
            >
              <p className="font-semibold">{stepNumber}. {stepLabel}</p>
            </div>
          );
        })}
      </div>

      {renderStep()}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40"
        >
          {isLastStep ? 'Create Deal' : 'Next'}
          {!isLastStep && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
