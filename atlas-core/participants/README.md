# Participant Evaluation Engine

## Purpose
The Participant Evaluation Engine assesses client and counterparty suitability for receivables financing using a reusable domain engine.

## Inputs
- DealModel client data:
  - Company Name
  - Country
  - Industry
  - Existing Relationship (placeholder-ready)
  - Existing Exposure (placeholder-ready)
  - KYC Status (placeholder)
- DealModel counterparty data:
  - Buyer Name
  - Country
  - Industry (placeholder-ready)
  - Existing Exposure (placeholder-ready)
  - Previous Transactions (placeholder)

## Outputs
- Participant Readiness
- Participant Warnings
- Participant Recommendation
- Required Actions
- Summary

## Architecture
- Business logic resides in ParticipantEngine.
- Workspace components display engine outputs only.
- Placeholder values are intentionally preserved where connector integrations will later provide live data.

## Technical Constraints
- No backend
- No APIs
- No authentication
- No external integrations
