# Fuse Agent Technical Specifications

Machine-readable implementation specs for AI agents working on the Fuse codebase.
Each spec is self-contained with full context, acceptance criteria, and guard rails.

## How to use these docs

These specs are written for Claude, Cursor, Copilot, or any LLM-based agent.
Each doc follows the same structure:

1. **Context** — what exists today and why this work matters
2. **Scope** — exactly what to do and what not to do
3. **Implementation** — file paths, code patterns, step-by-step instructions
4. **Acceptance criteria** — how to know you're done
5. **Guard rails** — things that will break if you're not careful

## Spec Index

| Spec | File | Priority | Depends On |
|------|------|----------|------------|
| Upstream Cherry-Pick Plan | [SPEC-001-upstream-cherry-picks.md](SPEC-001-upstream-cherry-picks.md) | P0 (security), P1 (Linaria), P2 (perf) | Nothing |
| Feature Flag Backfill | [SPEC-002-feature-flag-backfill.md](SPEC-002-feature-flag-backfill.md) | P0 | Nothing |
| Table Performance | [SPEC-003-table-performance.md](SPEC-003-table-performance.md) | P2 | SPEC-001 (Linaria block) |
| Deploy Runbook | [SPEC-004-deploy-runbook.md](SPEC-004-deploy-runbook.md) | P0 | SPEC-002 |
| Apollo Enrichment Integration | [SPEC-005-apollo-enrichment.md](SPEC-005-apollo-enrichment.md) | P1 | SPEC-001 (app framework) |
| Partner Artifact Generator | [SPEC-006-partner-artifact-generator.md](SPEC-006-partner-artifact-generator.md) | P2 (scoped, not started — founder go-ahead required) | SPEC-001 (SDK framework), SPEC-005 (enriched data) |

## Key references

| Doc | Path | What |
|-----|------|------|
| CLAUDE.md (global) | `/.claude/CLAUDE.md` | Agent instructions, glossary, project state |
| CLAUDE.md (repo) | `/CLAUDE.md` | Build commands, architecture, coding conventions |
| Architecture plan | `/docs/fuse-mvp-architecture-plan-v2.md` | System design, data flows, issue specs |
| Data model | `/docs/fuse-partner-os-data-model.md` | 16 custom objects, fields, relations |
| Schema evolution | `/docs/fuse-schema-evolution.html` | Visual: current -> initial -> v2 north star |
| Launch plan | `/docs/fuse-5-day-launch-plan.md` | Active sprint tracker with Linear-style statuses |
| Memory: glossary | `/memory/glossary.md` | Acronyms, internal terms, issue keys |
| Memory: infra | `/memory/context/infrastructure.md` | EC2, Docker, MCP, prod DB state |
| Memory: project | `/memory/projects/fuse.md` | Current state, dependencies, key docs |
