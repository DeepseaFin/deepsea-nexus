"use client";

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, FileUp, FileWarning, ListChecks, Sparkles, UploadCloud } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const KPI_CARDS = [
  { label: 'Pending Intake Sessions', value: '24', tone: 'text-cyan-200' },
  { label: 'Uploading Now', value: '0', tone: 'text-cyan-200' },
  { label: 'Human Review Required', value: '9', tone: 'text-amber-200' },
  { label: 'Expiring Documents', value: '17', tone: 'text-rose-200' },
  { label: 'Mock Storage Ready', value: 'Yes', tone: 'text-indigo-200' },
  { label: 'Completed Today', value: '0', tone: 'text-emerald-200' },
];

const WORK_ITEMS = [
  'Upload source packs into ORACLE intake.',
  'Validate file type and size compliance.',
  'Monitor upload progress and completion status.',
  'Review recent documents in mock storage queue.',
  'Prepare handoff for future OCR enablement.',
];

type RecentDocument = {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG';
  sizeLabel: string;
  progress: number;
  status: 'Uploading' | 'Stored';
  uploadedAt: string;
};

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'] as const;

const INITIAL_RECENT_DOCUMENTS: RecentDocument[] = [
  {
    id: 'DOC-21018',
    name: 'Trade-License-Renewal.pdf',
    type: 'PDF',
    sizeLabel: '1.2 MB',
    progress: 100,
    status: 'Stored',
    uploadedAt: '09:22',
  },
  {
    id: 'DOC-21017',
    name: 'Board-Resolution.docx',
    type: 'DOCX',
    sizeLabel: '640 KB',
    progress: 100,
    status: 'Stored',
    uploadedAt: '08:40',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapExtensionToType(extension: string): RecentDocument['type'] {
  if (extension === 'pdf') return 'PDF';
  if (extension === 'docx') return 'DOCX';
  if (extension === 'xlsx') return 'XLSX';
  if (extension === 'png') return 'PNG';
  return 'JPG';
}

function statusTone(status: RecentDocument['status']): string {
  if (status === 'Stored') return 'border-emerald-700/40 bg-emerald-950/20 text-emerald-200';
  return 'border-cyan-700/40 bg-cyan-950/20 text-cyan-200';
}

export default function OraclePage() {
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>(INITIAL_RECENT_DOCUMENTS);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadTimersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    const timerStore = uploadTimersRef.current;

    return () => {
      const timers = Object.values(timerStore);
      timers.forEach((timer) => clearInterval(timer));
    };
  }, []);

  const uploadingNow = recentDocuments.filter((doc) => doc.status === 'Uploading').length;
  const completedToday = recentDocuments.filter((doc) => doc.status === 'Stored').length;

  const runtimeKpis = KPI_CARDS.map((item) => {
    if (item.label === 'Uploading Now') return { ...item, value: String(uploadingNow) };
    if (item.label === 'Completed Today') return { ...item, value: String(completedToday) };
    return item;
  });

  function startMockUpload(documentId: string) {
    const timer = setInterval(() => {
      let done = false;

      setRecentDocuments((current) =>
        current.map((doc) => {
          if (doc.id !== documentId || doc.status === 'Stored') {
            return doc;
          }

          const increment = 8 + Math.floor(Math.random() * 16);
          const nextProgress = Math.min(100, doc.progress + increment);

          if (nextProgress >= 100) {
            done = true;

            return {
              ...doc,
              progress: 100,
              status: 'Stored',
              uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }

          return {
            ...doc,
            progress: nextProgress,
          };
        }),
      );

      if (done) {
        clearInterval(timer);
        delete uploadTimersRef.current[documentId];
      }
    }, 250);

    uploadTimersRef.current[documentId] = timer;
  }

  function enqueueFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const accepted: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

      if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
        errors.push(`${file.name}: unsupported format. Allowed: PDF, DOCX, XLSX, JPG, PNG.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name}: exceeds 50 MB limit.`);
        return;
      }

      accepted.push(file);
    });

    setValidationErrors(errors);

    if (accepted.length === 0) {
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const uploaded = accepted.map((file, index) => {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';

      return {
        id: `DOC-${Date.now()}-${index}`,
        name: file.name,
        type: mapExtensionToType(extension),
        sizeLabel: formatFileSize(file.size),
        progress: 0,
        status: 'Uploading' as const,
        uploadedAt: nowTime,
      };
    });

    setRecentDocuments((current) => [...uploaded, ...current]);
    uploaded.forEach((doc) => startMockUpload(doc.id));
  }

  function onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    enqueueFiles(selectedFiles);
    event.target.value = '';
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    enqueueFiles(droppedFiles);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / ORACLE</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">Work Queue Dashboard</h1>
        </header>

        <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
          {runtimeKpis.map((kpi) => (
            <article key={kpi.label} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{kpi.label}</p>
              <p className={`mt-1 text-2xl font-semibold ${kpi.tone}`}>{kpi.value}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-2 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <aside className="space-y-2">
            <SectionCard title="Recent Documents" icon={ListChecks}>
              <div className="space-y-2">
                {recentDocuments.map((doc) => (
                  <article key={doc.id} className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-100">{doc.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{doc.type} · {doc.sizeLabel} · {doc.uploadedAt}</p>
                    <div className="mt-2 h-1.5 rounded bg-slate-800">
                      <div className="h-1.5 rounded bg-cyan-500" style={{ width: `${doc.progress}%` }} />
                    </div>
                    <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${statusTone(doc.status)}`}>
                      {doc.status}
                    </span>
                  </article>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="My Work" icon={ListChecks}>
              <div className="space-y-2">
                {WORK_ITEMS.map((item) => (
                  <div key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                    <p className="text-sm text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </aside>

          <section className="space-y-2">
            <SectionCard title="ORACLE Upload Engine" icon={FileUp}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDrop={onDrop}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                className={`flex min-h-[380px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition ${
                  isDragging
                    ? 'border-cyan-500 bg-cyan-950/25'
                    : 'border-slate-700 bg-slate-950/70 hover:border-cyan-700/60 hover:bg-cyan-950/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                  onChange={onFileInputChange}
                />

                <UploadCloud className="h-12 w-12 text-cyan-300" />
                <p className="mt-4 text-2xl font-semibold text-slate-100">Drop Files Here or Click to Upload</p>
                <p className="mt-2 text-sm text-slate-400">Supported: PDF, DOCX, XLSX, JPG, PNG · Maximum 50 MB per file · Multiple files allowed</p>

                <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
                  {['PDF', 'DOCX', 'XLSX', 'JPG', 'PNG'].map((format) => (
                    <span key={format} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-300">
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              {validationErrors.length > 0 && (
                <div className="mt-3 space-y-2">
                  {validationErrors.map((error) => (
                    <p key={error} className="rounded border border-rose-700/40 bg-rose-950/20 px-3 py-2 text-sm text-rose-200">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-3 grid gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300 sm:grid-cols-3">
                <p className="rounded border border-slate-800 bg-slate-900/70 px-2 py-1">Uploading: {uploadingNow}</p>
                <p className="rounded border border-slate-800 bg-slate-900/70 px-2 py-1">Stored: {completedToday}</p>
                <p className="rounded border border-slate-800 bg-slate-900/70 px-2 py-1">Storage: Mock only</p>
              </div>
            </SectionCard>
          </section>

          <aside className="space-y-2">
            <SectionCard title="Pipeline Status" icon={Sparkles}>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-1 inline-flex items-center gap-1 font-semibold text-cyan-200"><Clock3 className="h-4 w-4" />Upload Status</p>
                  <div className="space-y-1 text-slate-300">
                    <p>Files are accepted and stored in mock storage only.</p>
                    <p>No database or external services are used in this workflow.</p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 inline-flex items-center gap-1 font-semibold text-amber-200"><FileWarning className="h-4 w-4" />Validation Rules</p>
                  <div className="space-y-1 text-slate-300">
                    <p>Allowed formats: PDF, DOCX, XLSX, JPG, PNG.</p>
                    <p>Maximum size per file: 50 MB.</p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 inline-flex items-center gap-1 font-semibold text-rose-200"><AlertTriangle className="h-4 w-4" />Disabled Stages</p>
                  <div className="space-y-1 text-slate-300">
                    <p>OCR is not enabled in this sprint.</p>
                    <p>AI extraction is not enabled in this sprint.</p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 inline-flex items-center gap-1 font-semibold text-emerald-200"><CheckCircle2 className="h-4 w-4" />Next Actions</p>
                  <div className="space-y-1 text-slate-300">
                    <p>Continue uploading required files for each intake batch.</p>
                    <p>Review completed uploads in the Recent Documents panel.</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
