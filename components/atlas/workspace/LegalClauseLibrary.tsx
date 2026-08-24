"use client";

import {
  type ClauseCategory,
  type ReusableLegalClause,
} from "@/atlas-core/legal/LegalDocumentGenerator";

const CLAUSE_CATEGORIES: ClauseCategory[] = [
  "Commercial",
  "Security",
  "Guarantees",
  "Representations",
  "Warranties",
  "Conditions Precedent",
  "Events of Default",
  "Covenants",
  "Confidentiality",
  "Governing Law",
  "Jurisdiction",
  "Notices",
  "Dispute Resolution",
];

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

export default function LegalClauseLibrary({ clauses }: { clauses: ReusableLegalClause[] }) {
  const clauseGroups = CLAUSE_CATEGORIES.map((category) => ({
    category,
    clauses: (clauses ?? []).filter((clause) => clause.category === category),
  })).filter((group) => group.clauses.length > 0);

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Clause Library</h2>
      <p className="mt-2 text-slate-400">Institutional reusable legal clause repository</p>

      <div className="mt-6 space-y-6">
        {clauseGroups.map((group) => (
          <div key={group.category} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title={group.category} />

            <div className="mt-3 space-y-3">
              {group.clauses.map((clause) => (
                <div key={clause.clauseId} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{clause.clauseName}</p>
                      <p className="mt-1 text-xs text-slate-500">{clause.clauseId}</p>
                    </div>
                    <span className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-200">
                      {clause.category}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-md border border-slate-800 bg-slate-950/70 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Version</p>
                      <p className="mt-1 text-xs text-slate-300">{clause.version}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-950/70 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Owner</p>
                      <p className="mt-1 text-xs text-slate-300">{clause.owner}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-950/70 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Editable</p>
                      <p className="mt-1 text-xs text-slate-300">{clause.editable ? "Yes" : "No"}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-950/70 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Last Updated</p>
                      <p className="mt-1 text-xs text-slate-300">{clause.lastUpdated}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-950/70 p-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Source Engine</p>
                      <p className="mt-1 text-xs text-slate-300">{clause.sourceEngine}</p>
                    </div>
                    <div className="rounded-md border border-slate-800 bg-slate-950/70 p-2 sm:col-span-2 xl:col-span-3">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Used In Documents</p>
                      <p className="mt-1 text-xs text-slate-300">{clause.usedInDocuments.join(" | ")}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Clause Text</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{clause.clauseText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}