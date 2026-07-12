"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Clock3, FileUp, FileWarning, ListChecks, Sparkles, UploadCloud } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { DocumentClassificationService } from '@/lib/documents/documentClassificationService';
import { DocumentMetadataExtractionService } from '@/lib/documents/documentMetadataExtractionService';
import { DocumentPipeline } from '@/lib/documents/documentPipeline';
import { DocumentQueueService } from '@/lib/documents/documentQueueService';
import { createDocument, listDocuments, type DocumentRecord } from '@/lib/documents/documentRepository';
import { DocumentWorker } from '@/lib/documents/documentWorker';
import { OpenAILLMProvider } from '@/lib/documents/providers/openAILLMProvider';
import { MistralOCRProvider } from '@/lib/documents/providers/mistralOCRProvider';
import { getSupabaseClient } from '@/lib/supabase/client';

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

type UploadQueueItem = {
  id: string;
  name: string;
  progress: number;
  status: 'Uploading';
};

type PreparedUpload = {
  file: File;
  document: UploadQueueItem;
};

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'] as const;

function statusTone(status: string): string {
  if (status === 'UPLOADED' || status === 'Stored') return 'border-emerald-700/40 bg-emerald-950/20 text-emerald-200';
  return 'border-cyan-700/40 bg-cyan-950/20 text-cyan-200';
}

function formatUploadTime(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[\\/]/g, '_');
}

function buildStoragePath(fileName: string): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const safeFileName = sanitizeFileName(fileName);
  const id = crypto.randomUUID();

  return `intake/${year}/${month}/${day}/${id}-${safeFileName}`;
}

async function generateDocumentCode(): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .select('document_code')
    .order('document_code', { ascending: false })
    .limit(1)
    .maybeSingle<{ document_code: string }>();

  if (error) {
    throw new Error(`Failed to generate document code: ${error.message}`);
  }

  const currentValue = data?.document_code?.replace('DOC-', '') ?? '000000';
  const nextValue = Number.parseInt(currentValue, 10) + 1;

  return `DOC-${String(nextValue).padStart(6, '0')}`;
}

export default function OraclePage() {
  const router = useRouter();
  const [recentDocuments, setRecentDocuments] = useState<DocumentRecord[]>([]);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
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

  useEffect(() => {
    let active = true;

    async function loadRecentDocuments() {
      try {
        const documents = await listDocuments({ limit: 10 });

        if (active) {
          setRecentDocuments(documents);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Failed to load recent documents.';
        setValidationErrors((current) => [message, ...current].slice(0, 8));
      }
    }

    void loadRecentDocuments();

    return () => {
      active = false;
    };
  }, []);

  const uploadingNow = uploadQueue.length;
  const completedToday = recentDocuments.length;

  const runtimeKpis = KPI_CARDS.map((item) => {
    if (item.label === 'Uploading Now') return { ...item, value: String(uploadingNow) };
    if (item.label === 'Completed Today') return { ...item, value: String(completedToday) };
    return item;
  });

  function startVisualProgress(documentId: string) {
    const timer = setInterval(() => {
      setUploadQueue((current) =>
        current.map((doc) => {
          if (doc.id !== documentId || doc.status !== 'Uploading') {
            return doc;
          }

          const increment = 5 + Math.floor(Math.random() * 12);
          const nextProgress = Math.min(90, doc.progress + increment);

          return {
            ...doc,
            progress: nextProgress,
          };
        }),
      );
    }, 250);

    uploadTimersRef.current[documentId] = timer;
  }

  function stopVisualProgress(documentId: string) {
    const timer = uploadTimersRef.current[documentId];
    if (!timer) {
      return;
    }

    clearInterval(timer);
    delete uploadTimersRef.current[documentId];
  }

  async function uploadToSupabase(file: File, documentId: string) {
    startVisualProgress(documentId);
    let storagePath: string | null = null;

    try {
      const supabase = getSupabaseClient();
      storagePath = buildStoragePath(file.name);
      const { error } = await supabase.storage.from('documents').upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined,
      });

      if (error) {
        throw error;
      }

      const documentCode = await generateDocumentCode();
      const uploadedAt = new Date().toISOString();

      const createdDocument = await createDocument({
        document_code: documentCode,
        file_name: storagePath.split('/').pop() ?? file.name,
        original_file_name: file.name,
        storage_bucket: 'documents',
        storage_path: storagePath,
        mime_type: file.type || 'application/octet-stream',
        file_size: file.size,
        status: 'UPLOADED',
        uploaded_at: uploadedAt,
        ocr_status: 'PENDING',
        classification_status: 'PENDING',
      });
      const queue = new DocumentQueueService();
      const ocrProvider = new MistralOCRProvider();
      const llmProvider = new OpenAILLMProvider();
      const classificationService = new DocumentClassificationService(llmProvider);
      const metadataExtractionService = new DocumentMetadataExtractionService(llmProvider);
      const worker = new DocumentWorker(queue, ocrProvider, classificationService, metadataExtractionService);
      const documentPipeline = new DocumentPipeline(queue, worker);

      await queue.enqueue(createdDocument.id);
      await documentPipeline.run();

      stopVisualProgress(documentId);
      setUploadQueue((current) => current.filter((doc) => doc.id !== documentId));
      setRecentDocuments((current) => [createdDocument, ...current].slice(0, 10));
    } catch (error) {
      stopVisualProgress(documentId);
      if (storagePath) {
        const supabase = getSupabaseClient();
        await supabase.storage.from('documents').remove([storagePath]);
      }
      setUploadQueue((current) => current.filter((doc) => doc.id !== documentId));
      setValidationErrors((current) => {
        const message = error instanceof Error ? error.message : 'Upload failed.';
        return [`${file.name}: ${message}`, ...current].slice(0, 8);
      });
    }
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

    const preparedUploads: PreparedUpload[] = accepted.map((file) => {
      const document: UploadQueueItem = {
        id: `DOC-${crypto.randomUUID()}`,
        name: file.name,
        progress: 0,
        status: 'Uploading',
      };

      return {
        file,
        document,
      };
    });

    setUploadQueue((current) => [...preparedUploads.map((item) => item.document), ...current]);
    preparedUploads.forEach((item) => {
      void uploadToSupabase(item.file, item.document.id);
    });
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
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => router.push(`/atlas/oracle/document/${encodeURIComponent(doc.document_code)}`)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-left"
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{doc.document_code}</p>
                    <p className="truncate text-sm font-semibold text-slate-100">{doc.file_name}</p>
                    <p className="mt-1 text-xs text-slate-400">Upload Time · {formatUploadTime(doc.uploaded_at)}</p>
                    <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${statusTone(doc.status)}`}>
                      {doc.status}
                    </span>
                  </button>
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
