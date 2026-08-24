# Credit Policy Framework

## Purpose
The Credit Policy Framework defines a shared, reusable contract and policy evaluation layer for institutional policy checks across ATLAS business engines.

It separates policy definitions from engine logic so that policy intent remains explicit, portable, and independently evolvable.

## Responsibilities
- Define the canonical TypeScript interfaces for policy metadata, rules, categories, and evaluation outputs.
- Provide a common policy contract consumable by all evaluation engines.
- Provide a Policy Evaluation Engine entry point that reuses the shared Evaluation Framework for normalized outputs.
- Preserve strict separation between policy contracts and runtime business logic.

## Modules
- CreditPolicy.ts
- PolicyCategory.ts
- PolicyRule.ts
- PolicyResult.ts
- PolicyEngine.ts
- PolicyEvaluationModel.ts
- PolicyEvaluationResult.ts
- PolicyEvaluationEngine.ts

## Inputs
- Deal context represented by DealModel where policy evaluation interfaces require transaction context.
- Policy definitions represented by CreditPolicy and PolicyRule.

## Outputs
- PolicyResult objects representing rule-level evaluation outcomes.
- PolicyResult collections representing policy-level evaluation outcomes.
- PolicyEvaluationResult objects with:
  - policyReadiness
  - policyExceptions
  - criticalViolations
  - approvalRequirements
  - policySummary
  - nextRequiredActions
  - evaluation (shared EvaluationResult contract)

Each PolicyResult contract includes:
- status
- reason
- severity
- recommendedAction
- policyReference

## Dependencies
- DealModel from atlas-core/deals/DealModel.ts
- Evaluation Framework contracts from atlas-core/evaluation/
- Internal policy contracts:
  - PolicyCategory
  - PolicyRule
  - PolicyResult
  - CreditPolicy
  - PolicyEngine
  - PolicyEvaluationModel
  - PolicyEvaluationResult
  - PolicyEvaluationEngine

No external dependencies are required.

## Future Extensions
- Add policy version lineage and lifecycle metadata.
- Add jurisdiction-aware policy composition contracts.
- Add portfolio-level policy grouping interfaces.
- Add policy audit trace interfaces for governance and explainability.
- Add schema contracts for loading policy definitions from external configuration sources.
- Replace placeholder policy checks with configurable policy sources.
- Connect policy checks to exposure, sanctions, KYC, and approval workflow connectors.
- Support configurable institutional policy catalogs per jurisdiction and product.

## Technical Constraints
- No UI components.
- No React dependencies.
- No backend implementation.
- No API implementation.
- No business logic.
- No calculations.
- No hardcoded thresholds or policy values.

This module provides reusable policy contracts and policy evaluation logic for Commercial, Participant, Evidence, Policy, and Recommendation engines.
