'use client';

import { type ChangeEvent, useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { uploadDocument, type OracleStorageError } from '@/src/capabilities/oracle/infrastructure/storage';

type ToastState = {
  tone: 'success' | 'error';
  message: string;
};

export default function UploadDocumentButton() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const openPicker = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  const onSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.currentTarget.value = '';

    if (!file) return;

    setIsUploading(true);
    setToast(null);
    try {
      await uploadDocument(file, {
        folder: 'oracle',
        documentType: 'institutional',
      });
      setToast({ tone: 'success', message: 'Document uploaded successfully.' });
    } catch (error) {
      const storageError = error as OracleStorageError;
      setToast({
        tone: 'error',
        message: storageError?.message || 'Upload failed. Please try again.',
      });
    } finally {
      setIsUploading(false);
      window.setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onSelectFile}
        aria-label="Select document to upload"
      />
      <button
        type="button"
        onClick={openPicker}
        disabled={isUploading}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/25 px-3 py-2 text-sm font-semibold text-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </button>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`rounded-lg border px-3 py-2 text-sm shadow-lg ${
              toast.tone === 'success'
                ? 'border-emerald-700/50 bg-emerald-950/90 text-emerald-100'
                : 'border-rose-700/50 bg-rose-950/90 text-rose-100'
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
