# ATLAS Capability Map

## Document Purpose
This document is the master product capability inventory for ATLAS.

It defines business capabilities required to originate, assess, execute, monitor, and govern receivables financing transactions.

This is a product planning document, not a technical design specification.

## Domains
1. Origination
2. Intelligence
3. Execution
4. Portfolio
5. Institution

## Capability Inventory

### 1) Origination

#### 1.1 Deal Intake Workspace
- Purpose: Provide a guided workspace for relationship managers to create and progress a financing transaction from draft to approval readiness.
- Business Owner: Head of Origination
- Primary Users: Relationship Managers, Origination Analysts
- Inputs: Client profile, counterparty profile, commercial terms, required documents, workflow stage selections
- Outputs: Structured deal record with workflow progression and stage status
- AI Opportunities (future): Data extraction from intake documents, smart field prefill, next-best-step prompts
- Dependencies: Client Master, Counterparty Master, Deal Workflow Model, Document Checklist Policy
- Current Status: In Progress

#### 1.2 Client Qualification
- Purpose: Capture and validate client identity, relationship context, and onboarding readiness.
- Business Owner: Head of Coverage
- Primary Users: Relationship Managers, KYC Operations
- Inputs: Client legal identity data, registration details, relationship manager assignment
- Outputs: Qualified client profile linked to deal
- AI Opportunities (future): KYC anomaly flagging, profile completeness scoring
- Dependencies: KYC Policy, Client Registry, Compliance Standards
- Current Status: In Progress

#### 1.3 Counterparty Qualification
- Purpose: Capture and validate buyer/counterparty profile and exposure posture.
- Business Owner: Head of Credit Origination
- Primary Users: Relationship Managers, Credit Analysts
- Inputs: Counterparty profile, exposure data, rating data, payment behavior indicators
- Outputs: Counterparty assessment record linked to deal
- AI Opportunities (future): Early warning risk signals, payment delay probability prediction
- Dependencies: Counterparty Registry, Exposure Data, Credit Policy
- Current Status: In Progress

#### 1.4 Commercial Structuring
- Purpose: Define facility economics and terms aligned with policy and profitability thresholds.
- Business Owner: Head of Structured Solutions
- Primary Users: Relationship Managers, Structuring Team, Pricing Desk
- Inputs: Invoice value, advance rate, discount rate, fees, tenure, recourse structure
- Outputs: Proposed commercial package with expected return and funding requirement
- AI Opportunities (future): Pricing optimization under policy constraints, scenario recommendations
- Dependencies: Pricing Policy, Treasury Guidance, Product Rules
- Current Status: In Progress

#### 1.5 Origination Quality Gates
- Purpose: Enforce mandatory completeness checks before a deal can move to recommendation and approval.
- Business Owner: Head of Origination Control
- Primary Users: Relationship Managers, Origination Control Team
- Inputs: Step completion status, required field validations, required artifacts
- Outputs: Gate pass/fail decision for stage progression
- AI Opportunities (future): Risk-adjusted progression guidance, missing-item prioritization
- Dependencies: Workflow Policy, Documentation Standards, Approval Readiness Criteria
- Current Status: Planned

### 2) Intelligence

#### 2.1 Document Intelligence
- Purpose: Assess document package completeness, quality, and decision relevance.
- Business Owner: Head of Credit Intelligence
- Primary Users: Credit Analysts, Legal Analysts, Relationship Managers
- Inputs: Uploaded document set, document checklist requirements
- Outputs: Completeness status, missing item list, document confidence indicators
- AI Opportunities (future): OCR extraction, clause detection, tamper and inconsistency detection
- Dependencies: Document Policy, Checklist Engine, Legal Standards
- Current Status: In Progress

#### 2.2 Credit Intelligence
- Purpose: Evaluate obligor and counterparty risk quality for financing suitability.
- Business Owner: Chief Credit Officer
- Primary Users: Credit Analysts, Approval Committee Members
- Inputs: Internal ratings, exposure levels, behavior signals, financial indicators
- Outputs: Credit view, risk observations, risk-adjusted recommendation inputs
- AI Opportunities (future): Probability of default estimation, concentration risk forecasting
- Dependencies: Rating Framework, Exposure Framework, Credit Policy
- Current Status: Planned

#### 2.3 Legal Intelligence
- Purpose: Assess enforceability and legal condition closure required for decision confidence.
- Business Owner: General Counsel
- Primary Users: Legal Team, Credit Team
- Inputs: Contractual artifacts, jurisdiction context, assignment provisions
- Outputs: Legal risk view, pending legal conditions, enforceability posture
- AI Opportunities (future): Clause variance detection, enforceability scoring by jurisdiction
- Dependencies: Legal Policy, Jurisdiction Playbooks, Documentation Standards
- Current Status: Planned

#### 2.4 Fraud Intelligence
- Purpose: Identify anomalies and integrity risks in transaction and documentation patterns.
- Business Owner: Head of Financial Crime
- Primary Users: Fraud Analysts, Credit Risk Team
- Inputs: Transaction metadata, document metadata, entity behavior patterns
- Outputs: Fraud risk alerts and confidence-adjusted flags
- AI Opportunities (future): Synthetic document detection, graph-based anomaly detection
- Dependencies: Financial Crime Controls, Alert Framework, Data Quality Controls
- Current Status: Planned

#### 2.5 Decision Intelligence Orchestration
- Purpose: Consolidate multi-engine findings into an explainable recommendation for business decisioning.
- Business Owner: Chief Risk Officer
- Primary Users: Relationship Managers, Credit Analysts, Committees
- Inputs: Document, credit, legal, fraud, and policy signals
- Outputs: Recommendation, confidence indicators, critical blockers, conditions
- AI Opportunities (future): Explainable recommendation narratives, adaptive confidence calibration
- Dependencies: Rules Framework, Intelligence Engines, Governance Standards
- Current Status: In Progress

### 3) Execution

#### 3.1 Recommendation Workspace
- Purpose: Present final business recommendation and conditions before term sheet generation.
- Business Owner: Head of Credit Execution
- Primary Users: Relationship Managers, Credit Managers
- Inputs: Intelligence outputs, policy checks, commercial terms
- Outputs: Business recommendation package with conditions
- AI Opportunities (future): Negotiation guidance, condition impact simulation
- Dependencies: Decision Intelligence, Commercial Terms, Policy Rules
- Current Status: In Progress

#### 3.2 Term Sheet Management
- Purpose: Generate, review, and finalize commercial terms in executable deal format.
- Business Owner: Head of Structuring
- Primary Users: Relationship Managers, Legal Team, Credit Team
- Inputs: Approved commercial structure, conditions, legal clauses
- Outputs: Negotiation-ready and final term sheet
- AI Opportunities (future): Clause drafting assistance, deviation risk highlighting
- Dependencies: Recommendation Output, Legal Standards, Product Templates
- Current Status: Planned

#### 3.3 Approval Orchestration
- Purpose: Route deals through approval authorities with visibility into status and conditions.
- Business Owner: Chief Credit Officer
- Primary Users: Credit Committee, Approvers, Relationship Managers
- Inputs: Recommendation package, term sheet, unresolved conditions, policy exceptions
- Outputs: Approval decision, conditional approvals, rejection rationale
- AI Opportunities (future): Approval memo summarization, route optimization by complexity
- Dependencies: Delegation Matrix, Policy Framework, Committee Calendar
- Current Status: In Progress

#### 3.4 Funding Readiness
- Purpose: Confirm all pre-disbursement controls and readiness checks are complete.
- Business Owner: Head of Operations
- Primary Users: Operations Team, Treasury Team, Relationship Managers
- Inputs: Approval outcome, fulfilled conditions, disbursement instructions
- Outputs: Funding-ready status and handoff package
- AI Opportunities (future): Readiness risk prediction, exception escalation recommendations
- Dependencies: Approval Outcome, Operations Controls, Treasury Controls
- Current Status: Planned

### 4) Portfolio

#### 4.1 Portfolio Monitoring
- Purpose: Track active financed deals with exposure, health, and compliance views.
- Business Owner: Head of Portfolio Management
- Primary Users: Portfolio Managers, Risk Managers, Senior Management
- Inputs: Active deal records, exposure metrics, compliance statuses
- Outputs: Portfolio health summaries, concentration and watchlist views
- AI Opportunities (future): Early warning deterioration detection, covenant breach prediction
- Dependencies: Deal Lifecycle Data, Risk Metrics, Compliance Controls
- Current Status: Planned

#### 4.2 Concentration and Limit Control
- Purpose: Monitor limits by client, sector, geography, and counterparty to prevent over-concentration.
- Business Owner: Chief Risk Officer
- Primary Users: Risk Team, Portfolio Team
- Inputs: Exposure snapshots, limit frameworks, new origination pipeline
- Outputs: Limit utilization views and breach alerts
- AI Opportunities (future): Dynamic limit stress simulation, concentration scenario planning
- Dependencies: Limit Policy, Exposure Data, Risk Governance
- Current Status: Planned

#### 4.3 Performance and Returns Tracking
- Purpose: Measure realized returns versus expected returns and identify profitability trends.
- Business Owner: Head of Finance
- Primary Users: Finance Team, Portfolio Team, Product Leadership
- Inputs: Disbursement records, collections, fees, expected return assumptions
- Outputs: Return performance dashboards and variance analysis
- AI Opportunities (future): Return variance forecasting, margin leakage detection
- Dependencies: Finance Data, Product Configuration, Reporting Standards
- Current Status: Planned

### 5) Institution

#### 5.1 Policy and Rule Governance
- Purpose: Define and maintain business rules used in origination, intelligence, and approvals.
- Business Owner: Chief Risk Officer
- Primary Users: Risk Policy Team, Credit Governance Team
- Inputs: Policy directives, regulatory obligations, internal control standards
- Outputs: Versioned rulebooks, policy thresholds, exception frameworks
- AI Opportunities (future): Policy impact simulation, rule conflict detection
- Dependencies: Risk Governance, Regulatory Interpretation, Approval Framework
- Current Status: In Progress

#### 5.2 Operating Controls and Auditability
- Purpose: Ensure all key decisions and changes are traceable and auditable.
- Business Owner: Head of Operational Risk
- Primary Users: Compliance, Internal Audit, Risk Oversight
- Inputs: Workflow events, decision logs, approval actions
- Outputs: Audit trails, control evidence, governance reports
- AI Opportunities (future): Control-gap detection, exception pattern monitoring
- Dependencies: Workflow Data, Access Controls, Audit Standards
- Current Status: Planned

#### 5.3 Institutional Memory
- Purpose: Capture decision history, outcomes, and lessons to improve institutional consistency.
- Business Owner: Chief Credit Officer
- Primary Users: Relationship Managers, Credit Teams, Portfolio Teams
- Inputs: Historical deals, approval rationale, post-funding outcomes
- Outputs: Searchable decision memory and reusable precedent intelligence
- AI Opportunities (future): Case-based reasoning, precedent recommendation engine
- Dependencies: Decision Records, Portfolio Outcomes, Knowledge Governance
- Current Status: Planned

#### 5.4 Role and Responsibility Model
- Purpose: Define ownership, accountability, and operating handoffs across ATLAS capabilities.
- Business Owner: COO, Wholesale Banking
- Primary Users: Product Leadership, Operations, Risk, Coverage Teams
- Inputs: Organization structure, delegation model, process responsibilities
- Outputs: RACI-aligned operating model
- AI Opportunities (future): Capacity-aware routing, handoff bottleneck prediction
- Dependencies: Organization Governance, Approval Matrix, Operating Procedures
- Current Status: Planned

## Version 1.0 Scope (Mandatory for Complete Receivables Financing Workflow)

The following capabilities are mandatory for Version 1.0 completeness:

1. Deal Intake Workspace (Origination)
2. Client Qualification (Origination)
3. Counterparty Qualification (Origination)
4. Commercial Structuring (Origination)
5. Document Intelligence (Intelligence)
6. Decision Intelligence Orchestration (Intelligence)
7. Recommendation Workspace (Execution)
8. Approval Orchestration (Execution)
9. Policy and Rule Governance (Institution)
10. Operating Controls and Auditability (Institution)

### Version 1.0 Completion Criteria
- End-to-end guided workflow from Client through Approval is operational.
- All mandatory data required for receivables financing decisions is captured.
- Recommendation output is explainable and condition-based.
- Approval decisions and status changes are fully auditable.
- Policy thresholds and workflow gates are consistently enforced.

## Status Legend
- Planned: Capability is defined but implementation has not started.
- In Progress: Capability is being implemented or partially usable.
- Complete: Capability is production-ready for intended business use.

## Document Governance
- Document Name: ATLAS Capability Map
- Version: 1.0
- Owner: Product Management, ATLAS
- Type: Living product capability inventory
- Review Cadence: Monthly during active build; quarterly after stabilization
