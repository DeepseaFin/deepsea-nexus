"use client";

import { useEffect, useState } from 'react';
import { Clock3, Download, FileText, Info } from 'lucide-react';
import Link from 'next/link';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { getSupabaseClient } from '@/lib/supabase/client';

type DocumentRecord = {
  id: string;
  document_code: string;
  original_file_name: string;
  uploaded_at: string;
  status: string;
  file_size: number;
  storage_bucket: string;
  storage_path: string;
};

type OracleDocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatTimestamp(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function statusTone(status: string): string {
  const normalized = status.toUpperCase();

  if (normalized === 'UPLOADED' || normalized === 'COMPLETED') {
    return 'border-emerald-700/40 bg-emerald-950/20 text-emerald-200';
  }

  if (normalized === 'PENDING' || normalized === 'PROCESSING') {
    return 'border-amber-700/40 bg-amber-950/20 text-amber-200';
  }

  if (normalized === 'FAILED' || normalized === 'ERROR') {
    return 'border-rose-700/40 bg-rose-950/20 text-rose-200';
  }

  return 'border-cyan-700/40 bg-cyan-950/20 text-cyan-200';
}

export default function OracleDocumentPage({ params }: OracleDocumentPageProps) {
  const [documentId, setDocumentId] = useState<string>('');
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDocument() {
      try {
        const { id } = await params;

        if (!active) {
          return;
        }

        setDocumentId(id);
        const supabase = getSupabaseClient();
        const byCode = await supabase
          .from('documents')
          .select('id,document_code,original_file_name,uploaded_at,status,file_size,storage_bucket,storage_path')
          .eq('document_code', id)
          .maybeSingle<DocumentRecord>();

        if (byCode.error) {
          throw new Error(byCode.error.message);
        }

        let record = byCode.data;

        if (!record) {
          const byId = await supabase
            .from('documents')
            .select('id,document_code,original_file_name,uploaded_at,status,file_size,storage_bucket,storage_path')
            .eq('id', id)
            .maybeSingle<DocumentRecord>();

          if (byId.error) {
            throw new Error(byId.error.message);
          }

          record = byId.data;
        }

        if (!active) {
          return;
        }

        if (!record) {
          setErrorMessage('Document not found.');
          setDocument(null);
          setIsLoading(false);
          return;
        }

        setDocument(record);
        setErrorMessage(null);
        setIsLoading(false);
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Failed to load document.';
        setErrorMessage(message);
        setDocument(null);
        setIsLoading(false);
      }
    }

    void loadDocument();

    return () => {
      active = false;
    };
  }, [params]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / ORACLE / DOCUMENT</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">Document Cockpit</h1>
          <p className="mt-2 text-sm text-slate-400">{documentId || 'Loading document identifier...'}</p>
        </header>

        {isLoading ? (
          <SectionCard title="Loading" icon={Clock3}>
            <p className="text-sm text-slate-300">Loading document details from the registry.</p>
          </SectionCard>
        ) : errorMessage ? (
          <SectionCard title="Document Status" icon={Info}>
            <p className="text-sm text-rose-200">{errorMessage}</p>
          </SectionCard>
        ) : document ? (
          <div className="space-y-3">
            <section className="rounded-lg border border-slate-800 bg-slate-900/40 px-6 py-5">
              <p className="text-sm text-slate-400">Document Name</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">{document.original_file_name}</h2>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-400">Document Code</span>
                <span className="text-xl font-semibold tracking-wide text-cyan-200 sm:text-2xl">{document.document_code}</span>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusTone(document.status)}`}>
                  {document.status}
                </span>
              </div>
            </section>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_360px]">
              <SectionCard title="General Information" icon={FileText}>
                <div className="space-y-3">
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Document Code</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">{document.document_code}</p>
                  </article>
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Original File Name</p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-100">{document.original_file_name}</p>
                  </article>
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Upload Date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">{formatTimestamp(document.uploaded_at)}</p>
                  </article>
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">File Size</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">{formatFileSize(document.file_size)}</p>
                  </article>
                </div>
              </SectionCard>

              <SectionCard title="Repository" icon={Info}>
                <div className="space-y-3">
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Bucket</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">{document.storage_bucket}</p>
                  </article>
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Storage Path</p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-100">{document.storage_path}</p>
                  </article>
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Version</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">1.0</p>
                  </article>
                  <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Classification Status</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">Pending</p>
                  </article>
                </div>
              </SectionCard>

              <SectionCard title="Actions" icon={Info}>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200"
                  >
                    <Download className="h-4 w-4" />
                    Download Original
                  </button>
                  <Link
                    href="/atlas/oracle"
                    className="inline-flex w-full items-center justify-center rounded-lg border border-cyan-700/40 bg-cyan-950/20 px-4 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-900/30"
                  >
                    Back to ORACLE
                  </Link>
                  <Link
                    href="/atlas/work-queue"
                    className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600"
                  >
                    Open Work Queue
                  </Link>
                </div>
              </SectionCard>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
