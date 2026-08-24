# Structuring Engine

## Purpose

The Structuring Intelligence Engine is responsible for designing the optimal trade finance structure for every transaction while balancing profitability, risk mitigation, legal enforceability, regulatory compliance, and funding attractiveness. It transforms commercial opportunities into bankable, investable, and legally protected funding structures that maximize returns while maintaining institutional risk tolerance and investor confidence. The Structuring Engine synthesizes risk assessments, legal analysis, credit intelligence, and regulatory requirements to generate optimized deal structures with supporting term sheets and documentation.

## Business Value

- **Revenue Optimization**: Generates pricing and structuring that maximizes profitability while maintaining risk discipline
- **Deal Completion**: Creates structures that satisfy seller needs while meeting institutional risk and return requirements
- **Investor Attractiveness**: Structures transactions to meet investor preferences and regulatory requirements for portfolio inclusion
- **Risk Mitigation**: Incorporates security, guarantees, reserves, and covenants to reduce credit and operational risk
- **Operational Efficiency**: Automates structure design and term sheet generation, reducing structuring timelines
- **Competitive Advantage**: Leverages AI-driven optimization to create structures competitors cannot replicate

## Responsibilities

The Structuring Engine is accountable for executing the following intelligence capabilities:

1. **Deal Structuring** — Design of optimal transaction structure considering multiple alternatives and trade-offs
2. **Advance Rate Recommendation** — Determination of advance rate (funding % of receivable value) balancing profitability and risk
3. **Reserve Calculation** — Calculation of required reserves (holdback) to cover potential losses, defaults, and operational costs
4. **Discount Rate Recommendation** — Determination of appropriate discount rate (cost of capital) for transaction pricing
5. **Pricing Optimisation** — Optimization of all-in pricing including discount rate, fees, and incentives
6. **FLDG Recommendation** — Assessment of Forfeit, Loss, Default, Guarantee (FLDG) requirements and coverage levels
7. **Collateral Analysis** — Evaluation of collateral value, quality, and enforceability for security structuring
8. **Security Package Design** — Design of comprehensive security package including pledges, guarantees, and insurance
9. **Guarantee Analysis** — Evaluation of available guarantees (corporate, personal, government) for risk mitigation
10. **Controlled Collection Account Recommendation** — Recommendation of collection account structure and control mechanisms
11. **Virtual IBAN Recommendation** — Assessment of virtual IBAN requirement for settlement and collection control
12. **Receivables Assignment Strategy** — Determination of assignment structure (direct, indirect, with/without recourse)
13. **Insurance Requirement Analysis** — Identification of required insurance (credit insurance, D&B insurance, political risk)
14. **Covenant Recommendation** — Recommendation of financial and operational covenants for ongoing compliance monitoring
15. **Concentration Limit Analysis** — Evaluation of transaction against portfolio concentration limits by counterparty, geography, sector
16. **Cross-border Structuring** — Handling of cross-border transaction complexities including FX, tax, and regulatory considerations
17. **Investor Suitability Analysis** — Evaluation of transaction alignment with investor preferences and investment criteria
18. **Funding Readiness Assessment** — Assessment of transaction completeness and readiness for funding execution
19. **Term Sheet Generation** — Generation of comprehensive term sheet with all material terms and conditions
20. **Legal Clause Recommendation** — Recommendation of specific legal clauses and contract provisions for security and protection
21. **Risk Mitigation Planning** — Development of risk mitigation strategies and contingency plans

## Inputs

The Structuring Engine consumes the following data sources to generate structuring recommendations:

- **Seller Profile** — Seller financial position, business model, reputation, and transaction history
- **Buyer Profile** — Buyer creditworthiness, payment history, and business fundamentals
- **Counterparty Intelligence** — Banking relationships, market position, and industry dynamics
- **Invoice Information** — Invoice amounts, terms, payment due dates, and receivables characteristics
- **Purchase Orders** — Purchase order details, quantities, pricing, and delivery terms
- **Funding Requirement** — Seller funding need, timing requirements, and business objectives
- **Risk Scores** — Credit scores, fraud scores, and regulatory risk scores from intelligence engines
- **Legal Analysis** — Legal risk assessment, contract enforceability, and security validity
- **Credit Analysis** — Credit assessment, PD/LGD/EL, and creditworthiness recommendations
- **Fraud Analysis** — Fraud risk assessment and detected anomalies or red flags
- **Regulatory Analysis** — Regulatory compliance status and jurisdiction-specific requirements
- **Internal Credit Policy** — Advance rate limits, discount rate floors, pricing policies
- **Investor Preferences** — Investor risk appetite, preferred structures, and investment criteria
- **Treasury Limits** — Exposure limits, portfolio concentration limits, and capital allocation
- **Portfolio Limits** — Current portfolio composition, concentration metrics, and available capacity
- **Country Information** — Country risk ratings and jurisdiction-specific constraints
- **Industry Information** — Industry ratings, sector trends, and sector-specific risk factors

## Intelligence Pipeline

The Structuring Engine processes all transactions through a comprehensive, multi-stage structure optimization pipeline:

```
Commercial Opportunity
  ↓
Risk Assessment Integration
  ↓
Legal Assessment Integration
  ↓
Credit Assessment Integration
  ↓
Regulatory Assessment Integration
  ↓
Funding Readiness Assessment
  ↓
Structure Optimisation & Modelling
  ↓
Term Sheet Generation
  ↓
Executive Summary Creation
  ↓
Knowledge Graph Update
  ↓
Institutional Memory Update
```

### Pipeline Stages

**Commercial Opportunity**: Transaction initiated with seller funding need, invoice/receivable details, and commercial terms

**Risk Assessment Integration**: Integration of fraud, credit, legal, and regulatory risk assessments from all intelligence engines

**Legal Assessment Integration**: Incorporation of legal enforceability analysis, security validity, and clause recommendations

**Credit Assessment Integration**: Integration of credit risk scores, PD/LGD/EL, and credit recommendations

**Regulatory Assessment Integration**: Incorporation of regulatory compliance status and jurisdiction-specific requirements

**Funding Readiness Assessment**: Evaluation of transaction completeness, documentation quality, and funding readiness

**Structure Optimisation & Modelling**: Generation of multiple structure alternatives; financial modelling and optimization of pricing, advance rate, reserves, and security

**Term Sheet Generation**: Creation of comprehensive term sheet with all material terms, conditions, covenants, and documentation requirements

**Executive Summary Creation**: Human-readable summary of recommended structure, key terms, and risk mitigations

**Knowledge Graph Update**: Recording of deal structure, terms, and structuring decisions for pattern recognition and future reference

**Institutional Memory Update**: Structuring approaches, pricing benchmarks, and structuring learnings recorded for continuous improvement

## Outputs

The Structuring Engine produces the following intelligence outputs for downstream consumption:

- **Executive Summary** — Concise overview of recommended structure, key commercial terms, and risk management approach
- **Recommended Structure** — Detailed description of optimal transaction structure with rationale for selection
- **Advance Rate** — Recommended advance rate (% of receivable value) with supporting analysis and limits
- **Discount Rate** — Recommended discount rate for transaction pricing with competitive benchmarking
- **Reserve Percentage** — Recommended reserve (holdback) percentage with breakdown by risk category
- **FLDG** — Forfeit, Loss, Default, Guarantee recommendation and required coverage levels
- **Security Package** — Comprehensive description of security package including pledges, guarantees, and collateral
- **Guarantees** — Recommended guarantees (corporate, personal, government) with enforceability assessment
- **Insurance Requirements** — Required insurance coverage including credit insurance, D&B, and political risk insurance
- **Required Covenants** — Recommended financial and operational covenants for transaction monitoring
- **Funding Readiness** — Assessment of transaction readiness for funding execution with identified gaps if any
- **Investor Suitability** — Assessment of investor suitability for transaction and investor preference alignment
- **Term Sheet** — Complete term sheet with all material terms, conditions, and documentation requirements
- **Suggested Legal Clauses** — Specific protective legal clauses recommended for inclusion in documentation
- **Alternative Structures** — Alternative structure options with comparative analysis of trade-offs
- **Confidence Score** (0-100) — Confidence level in structuring recommendation based on data completeness and market conditions

## Downstream Consumers

The Structuring Engine outputs feed the following AI engines and system components:

- **Funding Engine** — Consumes recommended structure, term sheet, and advance rate for execution planning
- **Decision Orchestrator** — Incorporates structuring recommendation into overall deal decision workflows
- **Treasury Engine** — Uses funding requirements, advance rate, and exposure analysis for capital allocation
- **Legal Engine** — Receives suggested legal clauses and term sheet for contract documentation and review
- **Knowledge Graph** — Records deal structures, terms, and pricing for competitive benchmarking and pattern analysis
- **Institutional Memory** — Structuring approaches, pricing benchmarks, and structuring learnings recorded for continuous improvement

## Future Roadmap

The Structuring Engine roadmap includes the following capability expansions:

- **AI Negotiation Assistant** — Interactive negotiation support to help structure deals around counterparty objections
- **Dynamic Pricing** — Real-time pricing optimization based on current market conditions and cost of capital
- **Portfolio Optimisation** — Holistic portfolio optimization considering concentration, risk, and return trade-offs
- **Investor Matching** — Automated matching of structured transactions to investor preferences and investment criteria
- **Bank Matching** — Automated bank selection and syndication recommendations based on bank risk appetite
- **Syndication Structuring** — Sophisticated syndication structure design for large transactions requiring capital pooling
- **Cross-border Optimisation** — Advanced cross-border structuring optimization including FX strategy and tax efficiency
- **Real-time Scenario Simulation** — Interactive scenario modeling enabling rapid evaluation of pricing and structure alternatives
- **Auto Term Sheet Generation** — Fully automated term sheet generation from structure decisions and optimization results
- **Auto Legal Draft Generation** — Automated generation of legal documentation based on structure and term decisions
- **Auto Covenant Optimisation** — Intelligent covenant design optimized for transaction monitoring and compliance

## Status

Draft | Last Updated: 2026-07-01
