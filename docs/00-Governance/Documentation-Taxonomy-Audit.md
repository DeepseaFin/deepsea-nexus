# Documentation Taxonomy Audit

## Existing Folder Structure

Top-level folders currently present under `docs/`:

- 00-Architecture
- 00-Governance
- 01-Engineering
- 01-Institution
- 01-Vision
- 02-Business
- 03-Architecture
- 03-Domain
- 03-Product
- 04-Product
- 04-Workflows
- 05-Decision-Engines
- 05-Operations
- 06-Legal
- 06-Technical-Architecture
- 07-AI
- 07-Release
- 08-Security
- 09-UI-Standards
- 10-Releases
- 11-Operations
- 12-Products
- 13-Industries
- 14-Jurisdictions
- 15-Templates
- 16-Knowledge-Library
- 99-The-Gita
- architecture
- demo
- legacy
- product
- release
- sprints

## Purpose Assessment

| Folder | Intended purpose | Actual contents (high-level) | Overlap assessment |
|---|---|---|---|
| 00-Architecture | Foundational architecture/business baseline | Capability map, operating model, PRD | Overlaps with `03-Architecture`, `06-Technical-Architecture`, `architecture`, `02-Business`, `03-Product` |
| 00-Governance | Governance controls and release governance | Scope/freeze/register placeholders | Limited overlap; should become canonical governance root |
| 01-Engineering | Engineering governance and standards | Constitution and process placeholders | Overlaps with `legacy/04-Engineering` and standards in `legacy` |
| 01-Institution | Institutional operating model narrative | Single DNOS operating system doc | Overlaps with `02-Business`, `01-Vision` |
| 01-Vision | Strategy and vision | Vision pyramid + README | Overlaps with `01-Institution`, `02-Business` |
| 02-Business | Business architecture and doctrine | Capability map, constitution, credit doctrine | Overlaps with `00-Architecture`, `12-Products`, `11-Operations` |
| 03-Architecture | New architecture track | README only | Naming overlap with `00-Architecture` and `architecture` |
| 03-Domain | Domain model documentation | README only | May overlap with `03-Architecture`, `04-Workflows`, `05-Decision-Engines` |
| 03-Product | Product documentation (legacy numbering) | Screen blueprint | Direct overlap with `04-Product` and `product` |
| 04-Product | Product documentation (new governance numbering) | README + product audit report | Overlaps with `03-Product`, `product` |
| 04-Workflows | Workflow documentation | README only | Overlaps with `11-Operations`, `05-Decision-Engines` |
| 05-Decision-Engines | Decision engine documentation | README only | Overlaps with `07-AI`, `03-Domain`, `04-Workflows` |
| 05-Operations | Operations documentation (new governance numbering) | README only | Direct overlap with `11-Operations` |
| 06-Legal | Legal/compliance documentation | README only | Overlaps with legal content in `11-Operations`, `legacy/20-Security`, `legacy/04-Engineering` |
| 06-Technical-Architecture | Technical architecture (numbered) | README only | Overlaps with `00-Architecture`, `03-Architecture`, `architecture` |
| 07-AI | AI architecture and intelligence engines | Extensive AI and intelligence docs | Overlaps with `05-Decision-Engines`, `16-Knowledge-Library`, `architecture` |
| 07-Release | Release documentation (new governance numbering) | README only | Direct overlap with `10-Releases`, `release`, `sprints` |
| 08-Security | Security standards | README only | Overlaps with `legacy/20-Security`, operational compliance docs |
| 09-UI-Standards | UI/UX standards | README only | Could overlap with product/engineering design standards |
| 10-Releases | Formal release notes | Release-specific markdown docs | Overlaps with `07-Release`, `release`, `sprints` |
| 11-Operations | Functional SOPs and runbooks | Broad operations and functional SOP docs | Overlaps with `05-Operations`, parts of `02-Business` |
| 12-Products | Product line taxonomy by financing products | Product family specs | Overlaps with `04-Product`, `03-Product`, `02-Business` |
| 13-Industries | Industry vertical guides | Industry documents | Minor overlap with product and risk docs |
| 14-Jurisdictions | Country/regulatory references | Jurisdiction docs | Overlaps with legal/compliance areas |
| 15-Templates | Operational/credit templates | Checklists and template docs | Overlaps with engineering templates and operations runbooks |
| 16-Knowledge-Library | Knowledge repository | Subfolders by case/customer/bank/legal/risk/AI | Overlaps with `07-AI`, `legacy/13-Institutional-Memory` |
| 99-The-Gita | Cultural/philosophical reference | README | Low overlap; intentionally separate cultural corpus |
| architecture | ADRs and architecture version docs | ADR-001..004, architecture v1 | Direct overlap with `00-Architecture`, `03-Architecture`, `06-Technical-Architecture` |
| demo | Demo collateral | Founder demo guide | Could be nested under product or release enablement |
| legacy | Historical archive | Large historical corpus + standards | Overlaps with almost every active domain by design |
| product | Product blueprint (lowercase namespace) | Deepsea Nexus v1 blueprint | Direct overlap with `03-Product`, `04-Product`, `12-Products` |
| release | Release board and readiness docs | v1 release board + readiness audit | Direct overlap with `07-Release`, `10-Releases`, `sprints` |
| sprints | Sprint tracking | Sprint markdown logs | Overlaps with release governance timelines |

## Duplicate Categories

Primary duplicate/overlapping categories identified:

1. Architecture duplication
- `00-Architecture`
- `03-Architecture`
- `06-Technical-Architecture`
- `architecture`

2. Product duplication
- `03-Product`
- `04-Product`
- `12-Products`
- `product`

3. Operations duplication
- `05-Operations`
- `11-Operations`

4. Release duplication
- `07-Release`
- `10-Releases`
- `release`
- `sprints`

5. AI / decision / knowledge overlap
- `07-AI`
- `05-Decision-Engines`
- `16-Knowledge-Library`

6. Business and institution strategy overlap
- `01-Institution`
- `01-Vision`
- `02-Business`
- Portions of `00-Architecture`

7. Legacy standards overlap with active governance
- `legacy` standards/docs overlap with `00-Governance`, `01-Engineering`, `08-Security`, `07-Release`

## Recommended Information Architecture

Target long-term hierarchy (stable, governance-first, minimal future renames):

- `00-Governance/`
- `01-Engineering/`
- `02-Business/`
- `03-Architecture/`
- `04-Product/`
- `05-Operations/`
- `06-Legal/`
- `07-Release/`
- `08-AI/`
- `09-Security/`
- `10-Design-Standards/`
- `11-Market-Reference/`
  - Industries
  - Jurisdictions
- `12-Templates/`
- `90-Demo/`
- `99-Legacy/`

Design principles for this IA:
- Keep governance and engineering controls separate from business/product narrative.
- Distinguish business architecture (`02-Business`) from technical architecture (`03-Architecture`).
- Keep AI/decisioning and knowledge assets together under dedicated AI domain.
- Consolidate releases and sprint evidence under release governance.
- Preserve legacy as immutable archive (`99-Legacy`) with pointer references only.

## Migration Plan

This plan is recommendation-only; no moves/renames are performed by this audit.

### Phase 1: Canonical mapping

1. Create canonical ownership map in `00-Governance`:
- Source folder
- Target canonical folder
- Owner
- Migration priority

2. For each duplicate domain, designate one canonical destination:
- Architecture -> `03-Architecture`
- Product -> `04-Product`
- Operations -> `05-Operations`
- Release/Sprints -> `07-Release`
- AI/Decision/Knowledge -> `08-AI`

### Phase 2: Non-destructive consolidation

1. Preserve documents in place initially.
2. Add index/reference files in canonical folders that point to existing documents.
3. Mark folders as `active`, `transitional`, or `legacy` in their README files.

### Phase 3: Controlled content consolidation

1. Consolidate highest-value active documents first:
- Release board/readiness
- Architecture ADRs
- Product blueprint and audits
- Operations SOPs

2. Merge duplicate narratives into canonical docs.
3. Keep historical variants in `99-Legacy` with clear provenance metadata.

### Phase 4: Structural hardening

1. Enforce naming conventions:
- Numbered domain prefixes for canonical folders only.
- Consistent title-case file names.

2. Add contribution rules:
- New docs must be created in canonical domain folders.
- Cross-domain references required instead of content duplication.

### Phase 5: Release governance integration

1. Tie release evidence (including sprint logs) to `07-Release` milestones.
2. Use `00-Governance` registers to track migration risk, decisions, and debt.

