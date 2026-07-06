"use client";

import { useMemo, useState } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import { TermSheetGenerationEngine } from "@/atlas-core/evaluation/TermSheetGenerationEngine";
import { FinalTermSheetGenerationEngine } from "@/atlas-core/evaluation/FinalTermSheetGenerationEngine";

type TermSheetMode = "indicative" | "final";

const negotiationStatusStyles: Record<string, string> = {
  Draft: "border-slate-500/40 bg-slate-500/10 text-slate-200",
  "Under Negotiation": "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  "Commercially Agreed": "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

const matrixStatusStyles: Record<string, string> = {
  Open: "border-slate-600 bg-slate-800/70 text-slate-200",
  Countered: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  Agreed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Pending Review": "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

const timelineStatusStyles: Record<string, string> = {
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  current: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  upcoming: "border-slate-600 bg-slate-800/70 text-slate-200",
};

const conditionStatusStyles: Record<string, string> = {
  Satisfied: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Waived: "border-slate-500/40 bg-slate-500/10 text-slate-200",
};

const executionStatusStyles: Record<string, string> = {
  Draft: "border-slate-500/40 bg-slate-500/10 text-slate-200",
  "Ready for Execution": "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  "Signed by Deepsea": "border-blue-500/30 bg-blue-500/10 text-blue-300",
  "Signed by Client": "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  "Fully Executed": "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
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
          <div key={`${title}-item-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpenItemsSection({
  items,
}: {
  items: Array<{ item: string; deepseaPosition: string; negotiationStatus: string }>;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <SectionTitle title="OPEN COMMERCIAL ITEMS" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((row, index) => (
          <div key={`open-item-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{row.item}</p>
            <p className="mt-1 text-sm text-slate-200">{row.deepseaPosition}</p>
            <span className="mt-2 inline-flex rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-300">
              {row.negotiationStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WordingSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <SectionTitle title={title} />
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div key={`${title}-item-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-sm text-slate-200">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndicativeTermSheetView({
  termSheet,
  negotiationStatus,
}: {
  termSheet: ReturnType<typeof TermSheetGenerationEngine.generateTermSheet>;
  negotiationStatus: string;
}) {
  const negotiatedRows = termSheet.negotiationMatrix.filter((row) => row.status === "Agreed").length;
  const totalRows = termSheet.negotiationMatrix.length;
  const trackerSummary = `${negotiatedRows}/${totalRows} items agreed`;

  const approvalWorkflow = ["RM", "Credit", "Risk", "Legal", "Treasury", "Investment Committee"];

  const versionHistory = [
    {
      version: "V1.0",
      date: "2026-07-07",
      author: "Relationship Manager",
      summary: "Initial indicative term sheet issued for commercial discussion.",
    },
    {
      version: "V1.1",
      date: "2026-07-07",
      author: "Credit",
      summary: "Commercial terms aligned with current policy and risk conditions.",
    },
  ];

  const changeLog = [
    "Status model changed from credit recommendation to negotiation lifecycle (Draft / Under Negotiation).",
    "Negotiation matrix expanded for original, counter, and agreed positions.",
    "Approval workflow and version controls added for institutional traceability.",
  ];

  return (
    <>
      <h2 className="text-2xl font-semibold text-white">{termSheet.title}</h2>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{termSheet.prejudiceNotice}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{termSheet.discussionNotice}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{termSheet.bindingNotice}</p>
      <p className="mt-2 text-sm text-slate-400">{termSheet.bindingException}</p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Generated Term Sheet Reference</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
            Facility Ref: {termSheet.facilityReference}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${negotiationStatusStyles[negotiationStatus]}`}>
            Status: {negotiationStatus}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <TermSheetSection title="Executive Summary" items={termSheet.executiveSummary.items} />
        <TermSheetSection title="Commercial Terms" items={termSheet.commercialTerms.items} />
        <TermSheetSection title="Pricing Summary" items={termSheet.pricingSummary.items} />
        <TermSheetSection title="Security Package" items={termSheet.securityPackage.items} />
        <TermSheetSection title="Conditions Precedent" items={termSheet.conditionsPrecedent.items} />
        <TermSheetSection title="Commercial Assumptions" items={termSheet.commercialAssumptions.items} />

        <OpenItemsSection items={termSheet.openCommercialItems} />

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="NEGOTIATION MATRIX" />
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Commercial Item</th>
                  <th className="px-3 py-2 font-medium">Original Proposal</th>
                  <th className="px-3 py-2 font-medium">Counter Proposal</th>
                  <th className="px-3 py-2 font-medium">Agreed Position</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {termSheet.negotiationMatrix.map((row, index) => (
                  <tr key={`matrix-row-${index + 1}`} className="border-b border-slate-800/70 text-slate-200">
                    <td className="px-3 py-3">{row.clause}</td>
                    <td className="px-3 py-3">{row.deepseaProposal}</td>
                    <td className="px-3 py-3">{row.counterpartyProposal}</td>
                    <td className="px-3 py-3">{row.agreedValue}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${matrixStatusStyles[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="COMMERCIAL NEGOTIATION TRACKER" />
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Negotiation Status</p>
              <p className="mt-1 text-sm text-slate-100">{negotiationStatus}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Progress</p>
              <p className="mt-1 text-sm text-slate-100">{trackerSummary}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Current Step</p>
              <p className="mt-1 text-sm text-slate-100">Client Counter Offer</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="APPROVAL WORKFLOW" />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
            {approvalWorkflow.map((stage, index) => (
              <div key={`approval-stage-${index + 1}`} className="flex items-center gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">{stage}</span>
                {index < approvalWorkflow.length - 1 ? <span className="text-slate-500">→</span> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="VERSION HISTORY" />
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Version</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Author</th>
                  <th className="px-3 py-2 font-medium">Summary of Changes</th>
                </tr>
              </thead>
              <tbody>
                {versionHistory.map((row, index) => (
                  <tr key={`version-row-${index + 1}`} className="border-b border-slate-800/70 text-slate-200">
                    <td className="px-3 py-3">{row.version}</td>
                    <td className="px-3 py-3">{row.date}</td>
                    <td className="px-3 py-3">{row.author}</td>
                    <td className="px-3 py-3">{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="NEGOTIATION TIMELINE" />
          <div className="mt-3 space-y-2">
            {termSheet.negotiationTimeline.map((event, index) => (
              <div key={`timeline-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-100">{event.step}</p>
                  <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-medium ${timelineStatusStyles[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{event.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="NEGOTIATION COMMENTS / INTERNAL NOTES" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {termSheet.comments.map((entry, index) => (
              <div key={`comment-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{entry.role}</p>
                <p className="mt-1 text-sm text-slate-200">{entry.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="CHANGE LOG" />
          <div className="mt-3 space-y-2">
            {changeLog.map((item, index) => (
              <div key={`change-log-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-sm text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="DECISION ACTIONS" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
              Save Draft
            </button>
            <button type="button" className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
              Send to Client
            </button>
            <button type="button" className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
              Mark Under Negotiation
            </button>
            <button type="button" className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Generate Final Term Sheet
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="NEGOTIATION STATUS" />
          <div className="mt-3 space-y-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${negotiationStatusStyles[negotiationStatus]}`}>
              {negotiationStatus}
            </span>
            <p className="text-sm text-slate-300">
              Indicative term sheet remains a commercial negotiation document and does not represent a credit decision.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function FinalExecutableTermSheetView({
  finalTermSheet,
}: {
  finalTermSheet: ReturnType<typeof FinalTermSheetGenerationEngine.generateFinalTermSheet>;
}) {
  return (
    <>
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <p className="text-sm font-semibold text-emerald-200">
          EXECUTION VERSION - This document becomes legally binding only after execution by both parties.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-white">{finalTermSheet.title}</h2>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{finalTermSheet.legalNotice}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{finalTermSheet.executionNotice}</p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Execution Status</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${executionStatusStyles[finalTermSheet.executionStatus.current]}`}>
            {finalTermSheet.executionStatus.current}
          </span>
          {finalTermSheet.executionStatus.all.map((status, index) => (
            <span key={`exec-status-${index + 1}`} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-300">
              {status}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <TermSheetSection title="Executive Summary" items={finalTermSheet.executiveSummary.items} />
        <TermSheetSection title="Parties" items={finalTermSheet.parties.items} />
        <TermSheetSection title="Facility Details" items={finalTermSheet.facilityDetails.items} />
        <TermSheetSection title="Commercial Terms" items={finalTermSheet.commercialTerms.items} />
        <TermSheetSection title="Pricing" items={finalTermSheet.pricing.items} />
        <TermSheetSection title="Security Package" items={finalTermSheet.securityPackage.items} />

        <TermSheetSection title="Execution Header" items={finalTermSheet.executionSection.items} />

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Conditions Precedent" />
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Condition</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Responsible Party</th>
                  <th className="px-3 py-2 font-medium">Evidence</th>
                  <th className="px-3 py-2 font-medium">Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {finalTermSheet.conditionsPrecedent.map((row, index) => (
                  <tr key={`cp-row-${index + 1}`} className="border-b border-slate-800/70 text-slate-200">
                    <td className="px-3 py-3">{row.condition}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${conditionStatusStyles[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">{row.responsibleParty}</td>
                    <td className="px-3 py-3">{row.evidence}</td>
                    <td className="px-3 py-3">{row.completionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Conditions Subsequent" />
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Condition</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Responsible Party</th>
                  <th className="px-3 py-2 font-medium">Evidence</th>
                  <th className="px-3 py-2 font-medium">Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {finalTermSheet.conditionsSubsequent.map((row, index) => (
                  <tr key={`cs-row-${index + 1}`} className="border-b border-slate-800/70 text-slate-200">
                    <td className="px-3 py-3">{row.condition}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${conditionStatusStyles[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">{row.responsibleParty}</td>
                    <td className="px-3 py-3">{row.evidence}</td>
                    <td className="px-3 py-3">{row.completionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <WordingSection title="Representations & Warranties" items={finalTermSheet.representationsAndWarranties} />
        <WordingSection title="Covenants" items={finalTermSheet.covenants} />
        <WordingSection title="Events of Default" items={finalTermSheet.eventsOfDefault} />

        <TermSheetSection title="Payment Waterfall" items={finalTermSheet.paymentWaterfall.items} />
        <TermSheetSection title="Collection Account" items={finalTermSheet.collectionAccount.items} />
        <TermSheetSection title="Governing Law" items={finalTermSheet.governingLaw.items} />
        <TermSheetSection title="Jurisdiction" items={finalTermSheet.jurisdiction.items} />
        <TermSheetSection title="Confidentiality" items={finalTermSheet.confidentiality.items} />
        <TermSheetSection title="Assignment" items={finalTermSheet.assignment.items} />
        <TermSheetSection title="Amendments" items={finalTermSheet.amendments.items} />
        <TermSheetSection title="Entire Agreement" items={finalTermSheet.entireAgreement.items} />
        <TermSheetSection title="Costs & Expenses" items={finalTermSheet.costsAndExpenses.items} />
        <TermSheetSection title="Notices" items={finalTermSheet.notices.items} />
        <TermSheetSection title="Force Majeure" items={finalTermSheet.forceMajeure.items} />
        <TermSheetSection title="Dispute Resolution" items={finalTermSheet.disputeResolution.items} />
        <TermSheetSection title="Execution Section" items={finalTermSheet.executionSection.items} />

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Institutional Signature Section" />
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Entity</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Designation</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Signature</th>
                </tr>
              </thead>
              <tbody>
                {finalTermSheet.signatures.map((row, index) => (
                  <tr key={`signature-row-${index + 1}`} className="border-b border-slate-800/70 text-slate-200">
                    <td className="px-3 py-3">{row.entity}</td>
                    <td className="px-3 py-3">{row.role}</td>
                    <td className="px-3 py-3">{row.name}</td>
                    <td className="px-3 py-3">{row.designation}</td>
                    <td className="px-3 py-3">{row.date}</td>
                    <td className="px-3 py-3">{row.signature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Document Actions" />
          <div className="mt-3 flex flex-wrap gap-2">
            {finalTermSheet.documentActions.map((action, index) => (
              <button key={`final-action-${index + 1}`} type="button" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function TermSheetWorkspace() {
  const { deal } = useDeal();
  const [mode, setMode] = useState<TermSheetMode>("indicative");

  const termSheet = useMemo(() => TermSheetGenerationEngine.generateTermSheet(deal), [deal]);
  const finalTermSheet = useMemo(() => FinalTermSheetGenerationEngine.generateFinalTermSheet(deal), [deal]);

  const negotiationStatus = termSheet.commercialStatus;

  const workflow: Array<
    "Negotiation"
    | "Indicative Term Sheet"
    | "Commercial Approval"
    | "Final Executable Term Sheet"
    | "Signatures"
    | "Funding"
  > = [
    "Negotiation",
    "Indicative Term Sheet",
    "Commercial Approval",
    "Final Executable Term Sheet",
    "Signatures",
    "Funding",
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <SectionTitle title="Term Sheet Mode" />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("indicative")}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide ${mode === "indicative" ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-800 text-slate-200"}`}
          >
            Indicative Term Sheet
          </button>
          <button
            type="button"
            onClick={() => setMode("final")}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide ${mode === "final" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-slate-700 bg-slate-800 text-slate-200"}`}
          >
            Final Executable Term Sheet
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>Availability:</span>
          <span className={`rounded-full border px-2 py-1 ${negotiationStatusStyles[negotiationStatus]}`}>{negotiationStatus}</span>
          <span>Both modes are available for demonstration.</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <SectionTitle title="Institutional Workflow" />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
          {workflow.map((step: string, index: number) => (
            <div key={`workflow-step-${index + 1}`} className="flex items-center gap-2">
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">{step}</span>
              {index < workflow.length - 1 ? <span className="text-slate-500">↓</span> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {mode === "indicative" ? (
          <IndicativeTermSheetView termSheet={termSheet} negotiationStatus={negotiationStatus} />
        ) : (
          <FinalExecutableTermSheetView finalTermSheet={finalTermSheet} />
        )}
      </div>
    </div>
  );
}
