"use client";

const documents = [
  {
    name: "Invoice_2026_001.pdf",
    uploadedAt: "2026-06-28",
    uploadedBy: "Aisha Khan",
    status: "Verified",
    statusTone: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    icon: "📄",
  },
  {
    name: "KYC_Documents.zip",
    uploadedAt: "2026-06-29",
    uploadedBy: "Mina Haddad",
    status: "Pending Review",
    statusTone: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    icon: "🗂️",
  },
  {
    name: "Board_Resolution.pdf",
    uploadedAt: "Pending",
    uploadedBy: "Legal Team",
    status: "Missing",
    statusTone: "border-rose-500/30 bg-rose-500/15 text-rose-400",
    icon: "⚠️",
  },
  {
    name: "Credit_Summary.docx",
    uploadedAt: "2026-06-30",
    uploadedBy: "AI Extractor",
    status: "AI Extracted",
    statusTone: "border-cyan-500/30 bg-cyan-500/15 text-cyan-400",
    icon: "🤖",
  },
];

export default function DocumentVault() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Document Vault</h2>
        <p className="mt-1 text-sm text-slate-400">All documents attached to this deal.</p>
      </div>

      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.name}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xl">
                {document.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-white">{document.name}</p>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${document.statusTone}`}>
                    {document.status}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>Uploaded: {document.uploadedAt}</span>
                  <span>By: {document.uploadedBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
