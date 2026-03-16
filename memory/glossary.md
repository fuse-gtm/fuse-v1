# Glossary

Workplace shorthand, acronyms, and internal language for Fuse.

## Acronyms

| Term | Meaning | Context |
|------|---------|---------|
| GTM | Go-to-market | Company name (Fuse GTM) and general strategy |
| MCP | Model Context Protocol | Twenty's API layer — 206 tools, streamable-HTTP transport |
| MVP | Minimum Viable Product | Current build phase |
| SI | Systems Integrator | Partner type (AGENCY_SI) |
| VAR | Value-Added Reseller | Partner type (RESELLER_VAR) |
| SSE | Server-Sent Events | Real-time streaming for discovery results |
| OOM | Out of memory | Server crash mode on t3.small |
| SSM | AWS Systems Manager | Not installed on prod instance |
| ADR | Architecture Decision Record | — |

## Internal Terms

| Term | Meaning |
|------|---------|
| partner-os | The Fuse module inside Twenty — 16 custom objects across 3 motion modules |
| motion module | Composable schema unit: core, cosell, or discovery |
| bootstrap | MCP-based script that creates all 16 objects/fields/relations/views in a workspace |
| track | A reusable discovery template scoped to PartnerType x Outcome (partnerTrack object). Renamed from "play" — "track" conveys the strategic, long-running nature of the operating lane. |
| check | A retrieval signal definition within a track (trackCheck object) |
| enrichment | A data extraction column within a track (trackEnrichment object) |
| fit score | 0-100 weighted score for partner candidates |
| gate | Must-pass check — binary pass/fail, overrides fit score |
| exclusion | Entity blocked from discovery results (competitor, DNC, etc.) |
| webset | Exa's async search product — webhook-driven result streaming |
| schema freeze | FUSE-202 — no object/field changes without updating schema_modules.py |
| Linaria cherry-pick | FUSE-206 — upstream commit 1db2a409 migrating Emotion → Linaria CSS |
| theme pass | FUSE-502 — visual customization, depends on Linaria landing first |
| hot cache | CLAUDE.md as quick-lookup for most common terms |

## Project Codenames / Issue Keys

| Key | What | Status |
|-----|------|--------|
| FUSE-202 | Schema freeze for MVP | Done |
| FUSE-206 | Linaria cherry-pick (Emotion → zero-runtime CSS) | Not started |
| FUSE-301-305 | Discovery workflows (Exa webhook registration, initiation, ingestion, completion, reconciliation) | Backlog |
| FUSE-401-402 | Reports (partner pipeline, discovery funnel) | Backlog |
| FUSE-502 | Theme/design pass (blocked by FUSE-206) | Blocked |
| FUSE-900 | Release + repo hygiene | Done |
| FUSE-901 | Internal dogfood workspace setup | Backlog (post-launch) |
| FUSE-902 | Event ingestion for internal ops signals | Backlog (post-launch) |
| FUSE-903 | Partner Brief Agent v1 | Backlog |
| FUSE-904 | AI Chat Guardrails (token + safety) | Backlog |
| FUSE-905 | Product cleanup + branding baseline | In Progress |
| FUSE-906 | Launch pack (landing + demo + outreach) | Backlog |

## Partner Types (SELECT enum)

| Value | Meaning |
|-------|---------|
| INTEGRATION_TECH | Technology/integration partner |
| AGENCY_SI | Agency or systems integrator |
| AFFILIATE | Affiliate partner |
| B2B_INFLUENCER_CREATOR | B2B influencer or content creator |
| RESELLER_VAR | Reseller or value-added reseller |
| REFERRAL | Referral partner |
| MARKETPLACE_COSELL | Marketplace or co-sell partner |

## Module Objects

| Module | Objects |
|--------|---------|
| core | partnerProfile, partnerContactAssignment, lead |
| cosell | partnerCustomerMap, partnerAttributionEvent, partnerAttributionSnapshot, customerEvent, customerSnapshot |
| discovery | partnerTrack, trackCheck, trackEnrichment, trackExclusion, discoveryRun, partnerCandidate, checkEvaluation, enrichmentEvaluation |
