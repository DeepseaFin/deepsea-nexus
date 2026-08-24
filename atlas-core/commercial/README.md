# Commercial Evaluation Engine

## Purpose
The Commercial Evaluation Engine provides a shared, reusable commercial viability evaluation contract and logic for receivables financing transactions in ATLAS.

## Responsibilities
- Normalize commercial inputs from DealModel-based workspace data.
- Evaluate commercial structure using centralized engine logic.
- Produce consistent commercial outputs, readiness, warnings, recommendation, next action, and summary.

## Inputs
- Invoice Amount
- Requested Funding
- Advance Rate
- Tenor
- Discount Rate
- Processing Fee
- Legal Fee
- Other Charges
- Currency
- Recourse Type

## Outputs
- Calculated Values
- Funding Percentage
- Net Disbursement
- Total Fees
- Expected Profit
- Expected Yield
- Evaluation Findings
- Commercial Readiness (0-100)
- Commercial Observations
- Commercial Warnings
- Commercial Blockers
- Recommended Actions
- Commercial Recommendation
- Commercial Summary

## Integration
- Business logic lives in CommercialEngine.
- React workspace components should only display engine results.
- DealContext and DealModel remain the shared in-memory source for inputs.

## Technical Constraints
- No backend
- No APIs
- No authentication
- No UI logic duplication
