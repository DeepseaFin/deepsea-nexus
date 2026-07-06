"use client";

import { useMemo } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import { TermSheetGenerationEngine } from "@/atlas-core/evaluation/TermSheetGenerationEngine";

const recommendationStyles: Record<string, string> = {
  Proceed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Proceed with Conditions": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Do Not Proceed": "border-red-500/40 bg-red-500/15 text-red-300",
};

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

function TermSheetSection({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <SectionTitle title={title} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${title}-item-${index + 1}`}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
          >
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TermSheetWorkspace() {
  const { deal } = useDeal();
  const termSheet = useMemo(() => TermSheetGenerationEngine.generateTermSheet(deal), [deal]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Term Sheet Workspace</h2>
      <p className="mt-2 text-slate-400">Institutional Term Sheet Memorandum (Read-Only)</p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Generated Term Sheet Reference</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
            Memo Ref: {termSheet.memoReference}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${recommendationStyles[termSheet.recommendation]}`}>
            {termSheet.recommendation}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <TermSheetSection title="Facility Details" items={termSheet.sections.facilityDetails.items} />
        <TermSheetSection title="Parties" items={termSheet.sections.parties.items} />
        <TermSheetSection title="Commercial Terms" items={termSheet.sections.commercialTerms.items} />
        <TermSheetSection title="Pricing" items={termSheet.sections.pricing.items} />
        <TermSheetSection title="Funding Structure" items={termSheet.sections.fundingStructure.items} />
        <TermSheetSection title="Conditions Precedent" items={termSheet.sections.conditionsPrecedent.items} />
        <TermSheetSection title="Covenants" items={termSheet.sections.covenants.items} />
        <TermSheetSection title="Events of Default" items={termSheet.sections.eventsOfDefault.items} />
        <TermSheetSection title="Representations & Warranties" items={termSheet.sections.representationsAndWarranties.items} />
        <TermSheetSection title="Security Package" items={termSheet.sections.securityPackage.items} />
        <TermSheetSection title="Collections Mechanism" items={termSheet.sections.collectionsMechanism.items} />
        <TermSheetSection title="Fees & Charges" items={termSheet.sections.feesAndCharges.items} />
        <TermSheetSection title="Governing Law" items={termSheet.sections.governingLaw.items} />
        <TermSheetSection title="Special Conditions" items={termSheet.sections.specialConditions.items} />

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Signature Blocks" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {termSheet.signatureBlocks.map((block, index) => (
              <div key={`signature-block-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{block.party}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{block.signatoryRole}</p>
                <p className="mt-1 text-xs text-slate-400">{block.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
