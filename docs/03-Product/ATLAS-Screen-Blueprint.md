# ATLAS Screen Blueprint

## Purpose
This document defines the canonical screen blueprint for major ATLAS product surfaces before further UI development.

It establishes what each screen is for, who it serves, how information is structured, and where future capabilities can be added without disrupting the core user experience.

## Scope
This blueprint covers the following major screens:

- Dashboard
- Deals Workspace
- Origination
- Clients
- Counterparties
- Term Sheets
- Approvals
- Portfolio

## Product Governance Principles

- Preserve a consistent user shell across major ATLAS workspaces.
- Keep business logic inside domain engines, not UI components.
- Use cards, tabs, and action blocks as reusable product primitives.
- Add capabilities incrementally through defined extension points.
- Prioritize explainability for all decision-support surfaces.

---

## 1. Dashboard

### Purpose
Provide executive and operating visibility across pipeline health, decision readiness, and critical blockers.

### Primary User
Relationship Manager, Deal Manager, Credit Lead.

### Layout
Top-level summary with a command-center style structure:

- Header summary row
- Readiness and confidence blocks
- Risk and blocker panels
- Next-action area

### Cards
- Pipeline Snapshot
- Deal Confidence Index
- Funding Readiness
- Critical Blockers
- Next Recommended Action

### Tabs
Dashboard is a standalone summary screen and does not require internal tabs by default.

### Actions
- Open high-priority deal
- Jump to pending task
- Escalate blocker
- Trigger workspace handoff

### Future Extension Points
- Cross-portfolio trend visualization
- Alert subscriptions and watcher feeds
- Personalized dashboard presets by role
- SLA and turnaround analytics

---

## 2. Deals Workspace

### Purpose
Serve as the primary operating surface for end-to-end deal progression, from initial analysis to approval and execution.

### Primary User
Relationship Manager.

### Layout
Structured workspace shell with persistent deal context:

- Deal Header
- KPI card strip
- Workspace tabs
- Main working panel per tab

### Cards
- Deal Header card
- Deal KPI cards
- Tab-specific analysis cards

### Tabs
- Overview
- Pricing
- Risk
- Documents
- Term Sheet
- Funding
- Payments
- Notes
- Audit

### Actions
- Update deal inputs
- Review engine outputs
- Move to next workflow state
- Save draft and continue

### Future Extension Points
- State-aware guidance panel
- Role-based workspace personalization
- Cross-engine recommendation orchestration
- Workflow simulation and what-if tools

---

## 3. Origination

### Purpose
Capture and qualify new opportunities before entering full deal workspace processing.

### Primary User
Relationship Manager, Origination Analyst.

### Layout
Guided intake flow with step-based capture:

- Opportunity details
- Counterparty details
- Funding request
- Initial documents

### Cards
- Intake Summary
- Eligibility Snapshot
- Document Intake Status
- Early Risk Flags

### Tabs
Origination can be either step-based or segmented by intake sections; tab usage is optional.

### Actions
- Create new opportunity
- Save draft intake
- Submit for review
- Route to Deals Workspace

### Future Extension Points
- Assisted intake with AI extraction
- Duplicate opportunity detection
- Relationship history enrichment
- Automated pre-screen scoring

---

## 4. Clients

### Purpose
Maintain client profiles, relationship state, and institutional metadata used across all deal workflows.

### Primary User
Relationship Manager, Operations.

### Layout
Profile-led record view:

- Core identity and registration
- Relationship summary
- Active deals and exposure
- Notes and interaction history

### Cards
- Client Profile
- Relationship Health
- Exposure Summary
- Active Facilities

### Tabs
Recommended tab set:

- Profile
- Exposure
- Deals
- Documents
- Notes

### Actions
- Edit client profile
- Link or create deal
- Update relationship status
- Attach supporting records

### Future Extension Points
- Behavioral segmentation
- Relationship profitability analytics
- Automated KYC refresh reminders
- Client-level risk intelligence overlays

---

## 5. Counterparties

### Purpose
Manage buyer and counterparty profiles required for transaction-level risk and structure decisions.

### Primary User
Relationship Manager, Credit Analyst.

### Layout
Counterparty-centric profile with performance and risk context:

- Identity and jurisdiction
- Payment behavior and rating
- Exposure and limits
- Linked transactions

### Cards
- Counterparty Profile
- Payment Terms and Behavior
- Exposure and Limit Utilization
- Counterparty Risk Signals

### Tabs
Recommended tab set:

- Profile
- Performance
- Exposure
- Deals
- Notes

### Actions
- Update rating inputs
- Record exposure changes
- Flag concentration risk
- Attach due diligence evidence

### Future Extension Points
- External bureau integrations
- Sanctions and watchlist overlays
- Dynamic limit recommendation engine
- Country-risk-adjusted counterparty scoring

---

## 6. Term Sheets

### Purpose
Draft, review, and control versioned commercial terms prior to final approval and execution.

### Primary User
Relationship Manager, Structuring, Legal.

### Layout
Document-focused workspace:

- Deal context summary
- Term blocks
- Version timeline
- Approval readiness panel

### Cards
- Terms Snapshot
- Version History
- Deviation Highlights
- Approval Readiness

### Tabs
Recommended tab set:

- Draft
- Comparison
- Versions
- Sign-off

### Actions
- Generate draft term sheet
- Compare versions
- Request legal review
- Submit for sign-off

### Future Extension Points
- Clause-level policy validation
- Template library and jurisdiction variants
- Redline collaboration workflow
- Auto-generated negotiation summary

---

## 7. Approvals

### Purpose
Coordinate decision governance, exception handling, and formal approval outcomes.

### Primary User
Credit Committee, Approver, Relationship Manager.

### Layout
Decision governance console:

- Case summary
- Exception and blocker list
- Decision rationale
- Approval routing and status

### Cards
- Approval Status
- Exceptions and Conditions
- Decision Record
- Required Follow-up Actions

### Tabs
Recommended tab set:

- Queue
- In Review
- Approved
- Declined
- Conditions Tracking

### Actions
- Approve
- Approve with conditions
- Return for rework
- Decline

### Future Extension Points
- Delegation matrix automation
- Approval SLA tracking
- Voting and quorum support
- Explainability archive for audits

---

## 8. Portfolio

### Purpose
Provide portfolio-level visibility for funded and pipeline deals across risk, yield, and concentration dimensions.

### Primary User
Portfolio Manager, Credit Head, Executive Management.

### Layout
Analytics-first portfolio view:

- Portfolio KPI row
- Risk and concentration panels
- Performance trend blocks
- Drilldown lists

### Cards
- Portfolio AUM and Utilization
- Yield and Return Metrics
- Concentration Heatmap
- Delinquency and Watchlist

### Tabs
Recommended tab set:

- Overview
- Performance
- Risk
- Concentration
- Collections

### Actions
- Drill into facility/deal
- Apply portfolio filters
- Flag watchlist exposures
- Trigger review workflows

### Future Extension Points
- Scenario stress testing
- Predictive delinquency modeling
- Exposure rebalancing recommendations
- Benchmark and attribution analytics

---

## Change Control
Any screen-level structural changes should be evaluated against this blueprint before implementation.

Required checks:

- Does the change preserve the intended purpose of the screen?
- Does it keep primary user workflows clear and efficient?
- Does it fit the defined layout, card, and tab model?
- Is the change better suited as a future extension point?

## Ownership
Product Ownership: ATLAS Product Governance.

Contributors: Product, Engineering, Credit, Operations, and Design.
