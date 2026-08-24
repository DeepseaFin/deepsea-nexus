# Evidence Evaluation Engine

## Purpose
Evaluate evidence sufficiency for financing decisions using reusable ATLAS business logic.

## Categories Evaluated
- Corporate Documents
- KYC
- Financial Statements
- Trade Documents
- Receivables
- Bank Details
- Legal Documents

## Per-Category Support
Each category tracks:
- Required
- Optional
- Uploaded
- Verified (placeholder)
- Expired (placeholder)

## Outputs
- Evidence Readiness (0-100)
- Missing Evidence
- Warnings
- Critical Blockers
- Required Actions
- Evidence Summary

## Integration
- Reuses DealModel and DealContext-backed workspace state.
- Reuses existing DocumentUploadZone component.
- Keeps all evidence evaluation logic inside EvidenceEngine.

## Constraints
- No backend
- No APIs
- No OCR
- No external integrations
- Placeholder verification states until connector integration is available
