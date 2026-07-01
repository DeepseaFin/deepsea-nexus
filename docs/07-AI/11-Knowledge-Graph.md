# Knowledge Graph

## Purpose

The Knowledge Graph serves as the central relationship layer of ATLAS, enabling every Intelligence Engine to understand how entities are connected. It is the institutional relationship network that connects every entity, transaction, document, agreement, person, organization, and event into a continuously evolving graph that enables explainable intelligence, relationship analysis, and institutional memory. The Knowledge Graph transforms isolated transaction data into interconnected relationship intelligence that reveals hidden patterns, concentration risks, and relationship networks that individual engine analysis cannot identify.

## Business Value

- **Relationship Intelligence**: Reveals entity relationships and network connections that inform credit and fraud assessment
- **Concentration Management**: Identifies concentration risks across counterparties, industries, geographies, and relationship networks
- **Fraud Detection**: Detects fraud schemes through relationship analysis and circular trading network detection
- **Decision Quality**: Provides comprehensive relationship context to all intelligence engines and decision-makers
- **Institutional Memory**: Enables learning from historical relationships and their outcomes
- **Compliance Support**: Maintains relationship network documentation for regulatory examination and audit

## Core Entity Types

The Knowledge Graph manages the following entity types representing all significant actors, assets, and events in the ATLAS ecosystem:

**Counterparties**
- Customers
- Sellers
- Buyers
- Investors
- Banks
- Brokers
- Insurers
- Law Firms
- Auditors

**People**
- Employees
- Guarantors
- Directors
- Shareholders

**Assets & Transactions**
- Invoices
- Purchase Orders
- Receivables
- Deals
- Contracts
- Term Sheets

**Geographies & Industries**
- Countries
- Currencies
- Industries
- Ports
- Shipping Companies

**Legal & Regulatory**
- Court Cases
- Judgements

**Financial Activity**
- Payments
- Recovery Actions

**Information**
- Documents
- Policies

## Relationship Types

The Knowledge Graph models the following relationship types representing all significant connections between entities:

- **OWNS** — Ownership relationship (A owns B)
- **DIRECTOR_OF** — Directorship relationship (Person is director of Company)
- **GUARANTEES** — Guarantee relationship (A guarantees obligation of B)
- **FUNDED_BY** — Funding relationship (Deal funded by Investor)
- **PAYS** — Payment relationship (A pays B)
- **OWES** — Obligation relationship (A owes B)
- **ASSIGNED_TO** — Assignment relationship (Receivable assigned to new owner)
- **RELATED_TO** — General relationship (A related to B)
- **GENERATED** — Creation relationship (Entity generated from transaction)
- **SIGNED** — Signature relationship (Person signed document)
- **APPROVED** — Approval relationship (Person approved decision)
- **CONNECTED_TO** — Connection relationship (A connected to B through transaction)
- **PARTICIPATED_IN** — Participation relationship (Person participated in transaction)
- **HAS_RISK** — Risk relationship (Entity has identified risk)
- **BELONGS_TO** — Membership relationship (Entity belongs to group/category)
- **SUPPORTED_BY** — Support relationship (Transaction supported by collateral/guarantee)
- **LINKED_TO** — Cross-reference relationship (Entity linked to related entity)

## Responsibilities

The Knowledge Graph is accountable for executing the following intelligence capabilities:

1. **Entity Resolution** — Identification and reconciliation of entities across multiple data sources to eliminate duplicates
2. **Relationship Discovery** — Identification of relationships between entities from transactions, documents, and external data
3. **Relationship Validation** — Verification of discovered relationships against external sources and pattern validation
4. **Duplicate Detection** — Identification and merging of duplicate entities and relationship definitions
5. **Counterparty Network Analysis** — Analysis of counterparty relationship networks and connection patterns
6. **Ownership Analysis** — Tracing of ownership chains and ultimate beneficial owner identification
7. **Exposure Mapping** — Mapping of institutional exposure across counterparty networks and relationship chains
8. **Related Party Detection** — Identification of related parties, family connections, and business affiliations
9. **Historical Relationship Tracking** — Maintenance of relationship history including relationship lifecycle and changes
10. **Graph Search** — Execution of sophisticated graph queries and relationship path discovery
11. **Relationship Intelligence** — Generation of relationship insights including concentration, network analysis, and pattern detection
12. **Cross-Engine Knowledge Sharing** — Distribution of relationship intelligence to all intelligence engines for incorporation into analysis
13. **Institutional Memory Support** — Support of institutional memory with relationship history and outcome tracking

## Inputs

The Knowledge Graph ingests the following data sources to build and maintain the relationship network:

- **All Intelligence Engines** — Entities and relationships discovered and validated by each intelligence engine
- **Documents** — Entity mentions, relationships, and connections extracted from uploaded documents
- **Transactions** — Transaction parties and relationships created through transaction execution
- **Users** — User/employee information and organizational relationships
- **Approvals** — Approval relationships and decision trails
- **External Data** — Corporate registry data, public records, and business intelligence
- **Market Intelligence** — Market news, corporate events, and transaction announcements
- **Corporate Registries** — Company registration data, ownership records, and officer information
- **Court Records** — Litigation, judgements, and court outcomes affecting relationships
- **Sanctions Lists** — Sanctions, PEP, and watchlist information affecting entity status

## Knowledge Pipeline

The Knowledge Graph maintains relationships through a continuous knowledge ingestion and enrichment pipeline:

```
Entity Identified
  ↓
Relationship Discovery
  ↓
Graph Update & Storage
  ↓
Relationship Validation
  ↓
Exposure Analysis
  ↓
Knowledge Enrichment
  ↓
Institutional Memory Update
  ↓
Decision Support Distribution
```

### Pipeline Stages

**Entity Identified**: New entity identified through document extraction, transaction creation, or external data integration

**Relationship Discovery**: Relationships between identified entity and existing entities discovered through data analysis

**Graph Update & Storage**: Entity and relationships stored in Knowledge Graph with versioning and audit trail

**Relationship Validation**: Discovered relationships validated against external data sources and pattern analysis

**Exposure Analysis**: Analysis of institutional exposure through discovered relationships and connection chains

**Knowledge Enrichment**: Historical relationship data and external intelligence integrated to enrich relationship context

**Institutional Memory Update**: Relationship outcomes and learnings recorded for continuous improvement

**Decision Support Distribution**: Relationship intelligence distributed to intelligence engines and decision-makers

## Outputs

The Knowledge Graph produces the following intelligence outputs for consumption by engines and decision-makers:

- **Relationship Graph** — Complete graph representation of all entities and relationships in the institutional network
- **Counterparty Network** — Detailed network map of counterparty relationships and connection patterns
- **Exposure Map** — Visual and quantitative mapping of institutional exposure across counterparties and networks
- **Ownership Structure** — Detailed ownership chains and ultimate beneficial owner identification
- **Connected Risks** — Risks identified through relationship connections (concentration, network correlation, etc.)
- **Relationship Timeline** — Historical timeline of relationship changes, events, and outcomes
- **Executive Summary** — High-level summary of significant relationships, concentration, and network risks
- **AI Recommendations** — Relationship-based recommendations for deal acceptance, modification, or rejection
- **Supporting Evidence** — Detailed evidence supporting relationship analysis and conclusions
- **Confidence Score** (0-100) — Confidence level in relationship intelligence based on data completeness and validation

## Downstream Consumers

The Knowledge Graph provides relationship intelligence to the following consumers:

- **Every Intelligence Engine** — All intelligence engines consume relationship context for enhanced analysis (Credit, Legal, Fraud, Regulatory, Structuring, Funding, Document)
- **Decision Orchestrator** — Receives relationship intelligence for comprehensive decision context
- **Institutional Memory** — Shares relationship outcomes and learnings for continuous improvement
- **Executive Dashboard** — Powers executive relationship visibility and portfolio monitoring
- **Portfolio Intelligence** — Supports portfolio concentration monitoring and portfolio optimization
- **Relationship Intelligence** — Direct relationship query and analysis platform for relationship managers

## Future Roadmap

The Knowledge Graph roadmap includes the following capability expansions:

- **Graph AI** — AI agents specializing in graph analysis and relationship pattern discovery
- **Relationship Prediction** — Machine learning-based prediction of likely future relationships and business development opportunities
- **Influence Analysis** — Analysis of entity influence within networks and identification of key network nodes
- **Supply Chain Intelligence** — Mapping and analysis of supply chain relationships and supplier networks
- **Corporate Network Intelligence** — Advanced analysis of corporate structure, ownership, and control relationships
- **Hidden Relationship Detection** — Detection of hidden relationships and undisclosed connections through pattern analysis
- **Knowledge Graph Visualisation** — Interactive visualization of relationship networks for relationship manager exploration and analysis
- **Continuous Learning** — Machine learning-based learning from transaction outcomes to identify false negatives and improve relationship discovery

## Status

Draft | Last Updated: 2026-07-01
