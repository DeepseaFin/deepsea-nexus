# Engineering Playbook

## 1. Engineering Philosophy

Deepsea Nexus is built as an institutional operating system, not as a collection of disconnected software modules.

Engineering is expected to optimize for durability, governance, and compounding platform value over short-term feature velocity. Every implementation decision should be evaluated against long-horizon institutional outcomes.

Core priorities for all engineering decisions:

- Scalability
- Maintainability
- Institutional Memory
- Clear Architecture
- Long-term Thinking

## 2. Development Workflow

DNOS follows a strict engineering workflow:

Architecture
↓
Implementation
↓
Review
↓
Testing
↓
Release

Architecture is agreed before implementation begins. Code should not be used to discover architecture in production-critical paths. The expected sequence is architectural clarity first, implementation second.

## 3. GitHub Copilot Workflow

Copilot is used as an execution accelerator within a human-governed engineering process.

Every task starts with:

- Objective
- Copy-Paste Prompt
- Implementation
- Review
- KEEP / WAIT / UNDO decision
- Testing
- Git Commit
- Git Push

Operating model:

- Copilot is treated as a junior engineer.
- Copilot assists with implementation speed, consistency, and repetitive scaffolding.
- Architecture decisions remain human decisions.
- Final responsibility for correctness, security, and architecture fit remains with human engineers.

## 4. Coding Principles

All implementation work must align to the following principles:

- Single Responsibility Principle
- Dependency Injection
- Provider Pattern
- Repository Pattern
- Composition over Coupling
- No Vendor Lock-In
- No Business Logic inside UI
- No Direct Database Access from UI

Interpretation guidelines:

- Domain logic belongs in domain or service layers, not presentation layers.
- External vendors are integrated through interfaces and adapters.
- Data access is isolated behind repositories and service boundaries.

## 5. Documentation Standards

Every sprint must produce:

- Working Code
- Architecture Decision Records (ADR)
- Sprint Log

All architectural decisions are required to be documented. If an implementation changes architectural behavior, ADR updates are mandatory as part of the same delivery cycle.

## 6. Review Standards

Before merge, every feature must pass:

- Architecture Review
- Implementation Review
- Manual Testing
- Git Review
- Release Review

Review gates are mandatory quality controls. Skipping a gate is considered process non-compliance and introduces institutional risk.

## 7. Git Standards

Source control discipline is mandatory:

- Small commits
- Meaningful commit messages
- Feature branches when appropriate
- No committing temporary files
- Review git status before every commit

Commit history should serve as a reliable institutional record of engineering intent and change progression.

## 8. AI Standards

AI and platform infrastructure dependencies must remain replaceable through abstraction layers.

Standards:

- LLMs are providers.
- OCR engines are providers.
- Queue technologies are providers.
- Storage technologies are providers.

Business logic must never depend directly on vendor implementations. Vendor-specific details belong in provider implementations behind stable internal contracts.

## 9. Long-Term Vision

DNOS is intended to become the institutional memory and operating system of Deepsea.

The engineering organization is building a platform where decisions, workflows, evidence, and operational knowledge persist as durable institutional assets. This requires architectural discipline, documentation rigor, and consistent execution standards across all teams and releases.

This playbook is the baseline operating contract for current and future developers contributing to DNOS.
