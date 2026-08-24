# Business Domain Library

## Purpose
The Business Domain Library provides shared institutional business definition contracts for ATLAS engines.

It centralizes domain definitions so engines consume common interfaces instead of hardcoded values.

## Scope
This module defines TypeScript interfaces only for business-domain reference models:
- ProductDefinition
- IndustryDefinition
- CountryDefinition
- CurrencyDefinition
- DocumentDefinition
- JurisdictionDefinition

Each definition includes:
- id
- name
- description
- metadata
- futureExtensibility

## Consumers
This library is designed to be consumed by:
- Commercial Engine
- Participant Engine
- Evidence Engine
- Policy Framework
- Recommendation Engine
- Future API Layer

## Technical Constraints
- Pure TypeScript contracts only.
- No business logic.
- No APIs.
- No UI.
- No React.
- No calculations.

## Future Roadmap
- Add standardized metadata sub-contracts by domain type.
- Add versioning and deprecation metadata for definitions.
- Add taxonomy-link contracts across product, industry, and jurisdiction entities.
- Add schema interfaces for external configuration loading in future API layers.
- Add audit metadata contracts for institutional governance and change history.
