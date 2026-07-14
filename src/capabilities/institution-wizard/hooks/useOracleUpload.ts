"use client";

import { useState } from "react";
import { OracleWizardAdapter } from "@/src/capabilities/institution-wizard/services/OracleWizardAdapter";
import type { OracleUploadResult } from "@/src/capabilities/institution-wizard/types/OracleUploadResult";

export interface UseOracleUploadResult {
  readonly isProcessing: boolean;
  readonly result: OracleUploadResult | null;
  readonly error: string | null;
  processUpload: (fileName: string) => Promise<void>;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useOracleUpload(): UseOracleUploadResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OracleUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processUpload = async (fileName: string): Promise<void> => {
    setError(null);
    setIsProcessing(true);

    try {
      await wait(1200);

      const placeholderExtraction = {
        documentName: fileName,
        extractedFields: [
          { label: "Legal Name", value: "Al Noor Trading LLC", confidence: 93 },
          { label: "License Number", value: "TL-778190", confidence: 95 },
          { label: "Jurisdiction", value: "Dubai Mainland", confidence: 90 },
          { label: "Issued On", value: "2024-02-12", confidence: 88 },
          { label: "Expiry", value: "2027-02-11", confidence: 91 },
        ] as const,
      };

      const adapted = OracleWizardAdapter.fromPlaceholderExtraction(placeholderExtraction);
      setResult(adapted);
    } catch {
      setError("Placeholder ORACLE extraction failed.");
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    result,
    error,
    processUpload,
  };
}