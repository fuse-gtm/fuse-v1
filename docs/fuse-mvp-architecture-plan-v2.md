# Fuse Partner OS on Twenty: 6-Week MVP Architecture Plan (v2)

## Context & Constraints

**Team:** Solo non-technical founder. Engineering work done with AI-assisted development.
**Platform:** Fork of Twenty CRM v1.18.1, Organization Self-Hosted enterprise license.
**Timeline:** 6 weeks to production-ready MVP.
**Validated:** Discovery workflow tested on Twenty cloud; positive user feedback received.

### Why Enterprise License Is Week 1

The Organization Self-Hosted plan is not premature enterprise overhead. It is infrastructure:

1. **GPL protection.** Without it, Fuse code built on Twenty is subject to open-source publication obligations. The enterprise license removes this. Delaying creates accumulated legal debt on every line of code written.
2. **Support channel.** Solo non-technical founder needs direct access to Twenty's engineering team for platform questions, migration issues, and edge cases in the custom object/workflow system. This is not optional.
3. **SSO/auth simplification.** Enterprise license unlocks pre-built Google/Microsoft OAuth and SAML configuration paths. Building auth from scratch on the community edition is significantly more work.
4. **API access patterns.** Enterprise tier includes webhook infrastructure, workflow builder, and API key management without rate-limit or feature restrictions.

---

## Initiative: `FUSE-INIT-01` — Ship Fuse Partner OS MVP

### Success Criteria

1. Public URL stable for 7 days under normal use.
2. Discovery workflow: track creation → Exa webset → candidates stream into UI in real-time → scored shortlist.
3. Co-sell/referral handoff: partner-customer map → stage progression → lead/opportunity creation with owner assignment.
4. Transcript insights: manual upload → extraction → partner profile update → task creation.
5. Google + Microsoft auth working.
6. Partner pipeline report queryable without spreadsheets.
7. Customer-facing UI says "Fuse", not "Twenty".

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FUSE PLATFORM                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Twenty UI    │  │  Twenty API  │  │  Twenty Workflow      │ │
│  │  (React/SSE)  │←─│  (GraphQL)   │←─│  Engine (BullMQ)      │ │
│  │              │  │              │  │                       │ │
│  │  Real-time   │  │  RECORD_CRUD │  │  MANUAL triggers      │ │
│  │  via Event   │  │  HTTP_REQUEST│  │  WEBHOOK triggers     │ │
│  │  Stream sub  │  │  AI_AGENT    │  │  DATABASE_EVENT       │ │
│  │  (Redis pub/ │  │  CODE steps  │  │  CRON triggers        │ │
│  │   sub → SSE) │  │              │  │                       │ │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘ │
│         │                 │                      │             │
│  ┌──────┴─────────────────┴──────────────────────┴───────────┐ │
│  │                    PostgreSQL                              │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │  Partner OS Schema (16 custom objects)               │  │ │
│  │  │  PartnerProfile, Lead, PartnerCustomerMap,           │  │ │
│  │  │  PartnerAttributionEvent, PartnerTrack, TrackCheck,    │  │ │
│  │  │  DiscoveryRun, PartnerCandidate, CheckEvaluation,    │  │ │
│  │  │  EnrichmentEvaluation, ...                           │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │  Redis        │  │  File Storage │                            │
│  │  (cache, pub/ │  │  (transcripts,│                            │
│  │   sub, queue) │  │   attachments)│                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
          │                              ▲
          │ HTTP_REQUEST (create webset)  │ WEBHOOK (item.created,
          ▼                              │  search.completed, idle)
┌─────────────────────┐                 │
│     Exa Websets API  │─────────────────┘
│  (async discovery)   │
└─────────────────────┘
```

### Data Flow: Discovery (Webhook-Driven, Real-Time)

This is the core architectural pattern. No polling. No custom backend services. Everything runs through Twenty's native workflow engine + Exa's webhook delivery.

```
User clicks "Run Discovery" on a PartnerTrack
        │
        ▼
[Workflow 1: MANUAL trigger]
  ├─ RECORD_CRUD: Create DiscoveryRun (status: PENDING)
  ├─ CODE: Build Exa payload from TrackChecks + TrackEnrichments + TrackExclusions
  │         (uses PartnerDiscoveryAdapterService.toExaSearchPayload() logic)
  ├─ HTTP_REQUEST: POST https://api.exa.ai/v0/websets
  │         body: { search, enrichments, webhook_url }
  ├─ RECORD_CRUD: Update DiscoveryRun (status: STREAMING, exaWebsetId: response.id)
  └─ [workflow completes — Exa processes asynchronously]

        === Exa discovers candidates over minutes ===

Exa fires POST to Fuse webhook: webset.item.created / webset.item.enriched
        │
        ▼
[Workflow 2: WEBHOOK trigger]
  ├─ CODE: Parse Exa WebsetItem → extract entity URL, name, domain
  │         Map enrichmentResults → one CheckEvaluation per TrackCheck
  │         Map enrichmentResults → one EnrichmentEvaluation per TrackEnrichment
  ├─ RECORD_CRUD: Upsert PartnerCandidate (keyed on entityUrl + discoveryRunId)
  ├─ RECORD_CRUD: Create CheckEvaluation records (batch)
  ├─ RECORD_CRUD: Create EnrichmentEvaluation records (batch)
  └─ [write triggers EntityEventsToDbListener]
           │
           ▼
     Redis Pub/Sub → GraphQL EventStream subscription → Frontend SSE
           │
           ▼
     User sees candidate appear in real-time in table/kanban view

Exa fires POST: webset.search.completed
        │
        ▼
[Workflow 3: WEBHOOK trigger]
  ├─ RECORD_CRUD: Find all PartnerCandidates for this DiscoveryRun
  ├─ RECORD_CRUD: Find all CheckEvaluations + signals for these candidates
  ├─ CODE: Run PartnerScoringService.scoreCandidate() logic per candidate
  │         - Weight-based fit scoring
  │         - Must-pass gate enforcement
  │         - Exclusion rule application
  ├─ RECORD_CRUD: Batch update candidates with fitScore, confidence, gateStatus
  ├─ RECORD_CRUD: Update DiscoveryRun (status: COMPLETE, resultCount, completedAt)
  └─ [optional] MAIL_SENDER: Notify user shortlist ready

Exa fires POST: webset.idle (all operations done)
        │
        ▼
[Workflow 4: WEBHOOK trigger — reconciliation]
  ├─ HTTP_REQUEST: GET https://api.exa.ai/v0/websets/{id}/items (count)
  ├─ RECORD_CRUD: Count PartnerCandidates for this run
  ├─ CODE: Compare counts, flag discrepancy
  └─ IF_ELSE: if mismatch → HTTP_REQUEST backfill missing items
```

### Data Flow: Co-Sell / Referral Handoff

```
User moves PartnerCustomerMap to "INTRODUCED" stage
        │
        ▼
[Workflow: DATABASE_EVENT trigger on partnerCustomerMap.updated]
  ├─ FILTER: mapStage changed to INTRODUCED or CO_SELL
  ├─ RECORD_CRUD: Find existing Lead for (partnerProfile, customerCompany)
  ├─ IF_ELSE: Lead exists?
  │   ├─ No → RECORD_CRUD: Create Lead with sourceType=PARTNER_SOURCED,
  │   │         link sourcePartnerProfile, sourcePartnerPerson
  │   └─ Yes → RECORD_CRUD: Update Lead status
  ├─ RECORD_CRUD: Create PartnerAttributionEvent (eventType: INTRODUCED)
  └─ [optional] MAIL_SENDER: Notify sales owner of handoff

User moves PartnerCustomerMap to "CLOSED_WON"
        │
        ▼
[Workflow: DATABASE_EVENT trigger]
  ├─ FILTER: mapStage changed to CLOSED_WON
  ├─ RECORD_CRUD: Create CustomerEvent (OPPORTUNITY_CLOSED_WON)
  ├─ RECORD_CRUD: Create PartnerAttributionEvent (eventType: SOURCED)
  └─ [attribution events available for pipeline report queries]

[Workflow: CRON trigger — daily]
  ├─ RECORD_CRUD: Find PartnerCustomerMaps where mapStage=INTRODUCED
  │               AND updatedAt < (now - 3 days)
  ├─ ITERATOR: For each stale map
  │   └─ MAIL_SENDER: Nudge owner about stale handoff
  └─ [tracks handoff latency organically]
```

### Data Flow: Transcript Insights

```
User uploads transcript file to Attachment on PartnerProfile
        │
        ▼
[Workflow: MANUAL trigger on PartnerProfile record]
  ├─ FORM: Select attachment (transcript file)
  ├─ AI_AGENT: Extract structured insights from transcript
  │   Prompt template:
  │   - Partner sentiment (positive/neutral/negative)
  │   - Key commitments made
  │   - Integration/technical requirements mentioned
  │   - Revenue opportunities identified
  │   - Follow-up actions needed
  │   Output: structured JSON
  ├─ CODE: Parse AI output → field updates + task definitions
  ├─ RECORD_CRUD: Update PartnerProfile fields with insights
  ├─ RECORD_CRUD: Create Task records for follow-up actions
  ├─ RECORD_CRUD: Create PartnerAttributionEvent (eventType: TOUCHPOINT)
  └─ RECORD_CRUD: Create NoteTarget linking extraction summary
```

---

## Existing Code Inventory (Already Built)

Before scoping work, here is what exists in the `partner-os` module:

| Component | Status | Location |
|-----------|--------|----------|
| **Schema constant** (16 objects, all fields, all relations) | Complete | `partner-os/constants/partner-os-schema.constant.ts` |
| **Metadata bootstrap service** (creates objects, fields, relations, views) | Complete | `partner-os/services/partner-os-metadata-bootstrap.service.ts` |
| **Discovery adapter** (TrackCheck → Exa payload mapping) | Complete | `partner-os/services/partner-discovery-adapter.service.ts` |
| **Scoring service** (weight-based fit scoring, must-pass gates, exclusion) | Complete | `partner-os/services/partner-scoring.service.ts` |
| **Type definitions** (CandidateScore, CheckEvaluation, ExaSearchPayload, etc.) | Complete | `partner-os/types/partner-discovery.types.ts` |
| **NestJS module** wiring | Complete | `partner-os/partner-os.module.ts` |

**What is NOT built yet:**

- Exa webhook registration and inbound handling
- Workflow definitions (all 3 workflows are un-built)
- Views configuration beyond auto-generated table + kanban/calendar
- Rebrand (string replacement, theme, onboarding)
- Reports (pipeline, attribution queries)
- Deployment infrastructure

---

## Projects & Issues (Revised)

### Project `FUSE-P1` — Deployment + Commercial Foundation

**Duration:** Week 1
**Rationale:** Enterprise license unlocks support, removes GPL risk, enables auth. Deployment is prerequisite for all testing.

| Issue ID | Issue | Priority | Scope | Done when |
|----------|-------|----------|-------|-----------|
| `FUSE-101` | Provision single host + deploy pinned image | P0 | One x86_64 host, DNS, SSH hardening, docker compose with GHCR pull, `.env` configuration, `/healthz` green | App reachable at stable URL |
| `FUSE-102` | Named Cloudflare tunnel + health cron | P0 | Named tunnel with fixed hostname, cron health check every 5 min (curl healthz, restart compose on failure), post-reboot persistence | URL stable across reboots, self-heals |
| `FUSE-103` | Activate Organization Self-Hosted plan | P0 | Switch plan in Twenty billing, verify enterprise toggles, open support channel, document escalation path | Plan active, support line open |
| `FUSE-104` | License and distribution baseline | P0 | Verify Fuse fork is covered under enterprise license (no GPL publication), add Fuse proprietary notice to repo, confirm with Twenty support | Written confirmation from Twenty team |
| `FUSE-105` | Enable Google + Microsoft OAuth | P0 | OAuth credentials for both providers, redirect URIs pointing to named tunnel hostname, test login on both | Both providers login successfully |
| `FUSE-106` | Deploy script (tag-based) | P1 | Shell script: `./deploy.sh <tag>` pulls from GHCR, runs compose, verifies healthz. Rollback = deploy previous tag. | Deploy and rollback reproducible |

### Project `FUSE-P2` — Partner Data Model Activation

**Duration:** Week 2
**Rationale:** Schema code exists. This project is about running bootstrap, verifying objects, configuring views, and seeding data.

| Issue ID | Issue | Priority | Scope | Done when |
|----------|-------|----------|-------|-----------|
| `FUSE-201` | Run bootstrap + verify all 16 objects | P0 | Execute `PartnerOsMetadataBootstrapService.bootstrap()` on staging workspace, verify each object has correct fields and relations in UI | All objects navigable with correct fields |
| `FUSE-202` | Schema freeze review | P0 | Review all 16 objects against workflow requirements, confirm field types and enums are correct for MVP, document any needed changes, apply them, re-run bootstrap | Schema declared stable for MVP |
| `FUSE-203` | Configure opinionated views | P0 | For each object: default table with relevant columns sorted, kanban where applicable (already auto-created by bootstrap for objects with `kanbanFieldName`), calendar where applicable. Add filter presets (e.g., PartnerCandidates filtered by gateStatus=QUALIFIED). Save as workspace-shared views | Team can operate without custom setup |
| `FUSE-204` | Seed sample records | P1 | 2 referral partner profiles, 2 integration partner profiles, associated people, contact assignments, customer maps at various stages, attribution events, 1 completed discovery run with candidates | Demo data supports all workflow walkthroughs |
| `FUSE-205` | Terminology audit | P1 | Verify all user-facing labels use `retrieval_checks`, `fit_signals`, `gates`, `evidence` — not overloaded `criteria`. Update schema constant labels if needed, re-run bootstrap | Vocabulary unambiguous in UI |

### Project `FUSE-P3` — Workflow Delivery

**Duration:** Week 3–5
**Rationale:** This is the product. Three workflows, each using Twenty's native workflow engine. Discovery uses webhook-driven architecture with Exa.

| Issue ID | Issue | Priority | Scope | Done when |
|----------|-------|----------|-------|-----------|
| **Discovery Workflow** | | | | |
| `FUSE-301` | Register Exa webhook endpoint | P0 | POST to Exa API to register account-level webhook subscribing to `webset.item.created`, `webset.item.enriched`, `webset.search.completed`, `webset.idle`. Webhook URL = Fuse inbound webhook endpoint. Store webhook secret for signature verification | Webhook registered and receiving test events |
| `FUSE-302` | Build initiation workflow (MANUAL trigger) | P0 | MANUAL trigger on PartnerTrack → RECORD_CRUD create DiscoveryRun → CODE step builds Exa payload (port `PartnerDiscoveryAdapterService.toExaSearchPayload()` logic + add enrichments + webhook config) → HTTP_REQUEST to Exa create webset → RECORD_CRUD update DiscoveryRun with exaWebsetId + status=STREAMING | User triggers discovery, run created, Exa webset created |
| `FUSE-303` | Build ingestion workflow (WEBHOOK trigger) | P0 | WEBHOOK trigger (Exa item events) → CODE step: verify webhook signature, parse WebsetItem, map to PartnerCandidate fields + CheckEvaluation + EnrichmentEvaluation records → RECORD_CRUD upsert PartnerCandidate → RECORD_CRUD create evaluation records | Candidates appear in real-time as Exa processes |
| `FUSE-304` | Build completion workflow (WEBHOOK trigger) | P0 | WEBHOOK trigger (search.completed) → RECORD_CRUD find all candidates + evaluations for run → CODE step: run scoring logic per candidate (port `PartnerScoringService.scoreCandidate()`) → RECORD_CRUD batch update fitScore/confidence/gateStatus → RECORD_CRUD update DiscoveryRun status=COMPLETE | Scored shortlist with gate enforcement |
| `FUSE-305` | Build reconciliation workflow (WEBHOOK trigger) | P1 | WEBHOOK trigger (webset.idle) → HTTP_REQUEST get Exa item count → RECORD_CRUD count local candidates → CODE compare → IF_ELSE backfill if mismatch | No silent data loss from dropped webhooks |
| `FUSE-306` | Verify real-time SSE streaming | P0 | Open PartnerCandidate table view, run discovery, confirm candidates appear without page reload via existing EventStream subscription. Test with 10+ candidates | Streaming UX confirmed working |
| **Co-Sell / Referral Handoff** | | | | |
| `FUSE-307` | Build handoff workflow (DATABASE_EVENT trigger) | P0 | DATABASE_EVENT on partnerCustomerMap update → FILTER on mapStage transition to INTRODUCED/CO_SELL → RECORD_CRUD create/link Lead → RECORD_CRUD create PartnerAttributionEvent → optional MAIL_SENDER to sales owner | Stage change creates traceable handoff |
| `FUSE-308` | Build stale handoff reminder (CRON trigger) | P1 | CRON daily → RECORD_CRUD find stale INTRODUCED maps (>3 days) → ITERATOR → MAIL_SENDER nudge | Handoffs don't go stale silently |
| `FUSE-309` | Duplicate map prevention | P0 | Add unique constraint logic: CODE step in handoff workflow checks for existing active PartnerCustomerMap with same (partnerProfile, customerCompany, motionType) before creation. OR: database-level unique partial index | No duplicate active maps for same tuple |
| **Transcript Insights** | | | | |
| `FUSE-310` | Build transcript workflow (MANUAL trigger) | P0 | MANUAL trigger on PartnerProfile → FORM (select attachment) → AI_AGENT (extraction prompt with structured JSON output template) → CODE (parse output to field updates + task definitions) → RECORD_CRUD update profile + create tasks + create attribution event | Upload → insights → profile update → tasks |

### Project `FUSE-P4` — Pipeline Report + Attribution Query

**Duration:** Week 5
**Rationale:** One report for MVP. Query-time attribution from the event ledger, no materialized snapshots.

| Issue ID | Issue | Priority | Scope | Done when |
|----------|-------|----------|-------|-----------|
| `FUSE-401` | Partner pipeline report | P0 | Dashboard widget: partner-sourced vs. partner-influenced pipeline by partner type and stage. Query PartnerAttributionEvent + Opportunity data. Time filter (this month / quarter / all time). Group by partnerProfile | Report drives weekly partner review |
| `FUSE-402` | Discovery funnel metrics | P1 | Dashboard widget: runs → total candidates → qualified → shortlisted. Conversion rates per track. Query DiscoveryRun + PartnerCandidate aggregations | Funnel bottlenecks visible |

**Deferred to post-MVP:**
- Handoff latency report (FUSE-503)
- Attribution snapshot materialization (FUSE-504)
- Ops dashboard (FUSE-505)
- CustomerSnapshot computation

### Project `FUSE-P5` — Rebrand + Onboarding

**Duration:** Week 5–6
**Rationale:** Cosmetic but necessary for customer-facing credibility. Kept lean.

| Issue ID | Issue | Priority | Scope | Done when |
|----------|-------|----------|-------|-----------|
| `FUSE-501` | Replace "Twenty" with "Fuse" in UI | P0 | Tokenized string replacement strategy: auth screens, navigation, onboarding, settings, email templates. Retain internal constants referencing "twenty" for upgrade safety | Customer-facing copy says "Fuse" |
| `FUSE-502` | Theme pass | P1 | Cherry-pick Linaria migration (commit `1db2a409`), define Fuse brand tokens in Figma (duplicated file: `SPb7b3wG9ZcFt0oy3nLQbi`), override CSS custom properties (`--t-xxx`) in root stylesheet, update logo/favicon. Verify in Storybook. See `docs/fuse-design-system-token-map.md` for Figma↔Code mapping | Product looks like one brand |
| `FUSE-503` | Sidebar defaults for partner team | P1 | Curate nav order: Partner Profiles, Discovery Runs, Partner Customer Maps, Leads, Opportunities at top. Set default views per object | UX feels opinionated for partnerships |
| `FUSE-504` | Onboarding intake revision | P1 | Replace generic Twenty onboarding with: company name, partner types active, CRM in use, primary goal. On completion: trigger bootstrap if not run, set default views | New users land in partner workflows |

### Project `FUSE-P6` — Hardening + Launch Gate

**Duration:** Week 6
**Rationale:** Minimum viable operational confidence.

| Issue ID | Issue | Priority | Scope | Done when |
|----------|-------|----------|-------|-----------|
| `FUSE-601` | Smoke test suite | P0 | Manual test script covering: OAuth login both providers, discovery end-to-end (initiation → streaming → scored shortlist), handoff flow (map stage → lead creation), transcript upload → insights, pipeline report rendering | All paths pass on staging |
| `FUSE-602` | Backup baseline | P0 | Daily pg_dump cron to separate volume/S3. Verify restore to staging once | Backup running, restore verified |
| `FUSE-603` | Deploy + incident runbook | P0 | Document: deploy command, rollback command, tunnel restart, auth outage fallback, Twenty support escalation | On-call can execute without tribal knowledge |
| `FUSE-604` | Launch gate review | P0 | Checklist: workflows end-to-end, auth working, URL stable 7 days, backup verified, legal baseline met, support channel active | Go-live decision is evidence-based |

---

## 6-Week Sequencing

| Week | Must Complete | Parallel |
|------|-------------|----------|
| 1 | `FUSE-P1` (101-106): Deploy + enterprise license + OAuth | — |
| 2 | `FUSE-P2` (201-205): Bootstrap objects, views, seed data, schema freeze | Start `FUSE-501` (string replacement), cherry-pick Linaria (`1db2a409`) |
| 3 | `FUSE-301-303`: Discovery initiation + Exa webhook + ingestion workflow | `FUSE-306` (verify real-time streaming) |
| 4 | `FUSE-304-305` (completion + reconciliation) + `FUSE-307-309` (handoff workflows) | `FUSE-502-503` (theme + sidebar) |
| 5 | `FUSE-310` (transcript) + `FUSE-401-402` (reports) | `FUSE-504` (onboarding) |
| 6 | `FUSE-P6` (601-604): Smoke tests, backup, runbook, launch gate | — |

**Critical path:** Deploy → Bootstrap → Discovery workflows → Reports → Launch gate

---

## Technical Risks & Mitigations

### Risk 1: Exa Webhook Delivery Reliability
**Impact:** Silent candidate loss if webhook dropped.
**Mitigation:** Reconciliation workflow (FUSE-305) on `webset.idle` event compares Exa item count vs. local candidate count. Backfills via `GET /v0/websets/{id}/items` on mismatch.

### Risk 2: Webhook Ordering Race Conditions
**Impact:** `webset.item.enriched` may fire before `webset.item.created` handler finishes.
**Mitigation:** Use UPSERT_RECORD (not CREATE) for PartnerCandidate in ingestion workflow. Keyed on `(entityUrl, discoveryRunId)`. Idempotent by design.

### Risk 3: Webhook Burst Throughput
**Impact:** 50+ item webhooks in rapid succession spawn concurrent workflow executions.
**Mitigation:** Twenty's workflow executor uses BullMQ queuing. Concurrent execution is bounded by worker concurrency settings. Test with 50-item burst. If bottleneck appears, batch via CODE step using Exa items list endpoint.

### Risk 4: AI_AGENT Billing on Self-Hosted
**Impact:** Twenty's AI_AGENT action may require billing system or external LLM config.
**Mitigation:** Verify AI_AGENT works with self-hosted LLM endpoint configuration. If blocked, replace AI_AGENT with HTTP_REQUEST to your own LLM proxy (Anthropic/OpenAI direct call).

### Risk 5: Webhook URL Stability
**Impact:** If tunnel URL changes, all Exa webhook registrations break.
**Mitigation:** Named Cloudflare tunnel (FUSE-102) provides permanent hostname. Never use quick tunnels for webhook endpoints.

### Risk 6: 16 Custom Objects — Schema Cache Pressure
**Impact:** Cache rebuild overhead after metadata changes during development.
**Mitigation:** Schema freeze (FUSE-202) before workflow development begins. After freeze, cache invalidation only happens on view changes, which are lightweight. Not a production concern.

### Risk 7: Upstream Twenty Divergence
**Impact:** Longer you go without rebasing, harder merges become.
**Mitigation:** All Fuse code lives in `packages/twenty-server/src/modules/partner-os/` with zero modifications to Twenty core modules. Verify this isolation as part of FUSE-202 schema freeze. Establish quarterly rebase cadence post-MVP.

### Risk 8: Linaria Cherry-Pick Merge Conflicts
**Impact:** Commit `1db2a409` (Emotion→Linaria migration, 211 files) could conflict with Fuse changes.
**Mitigation:** Fuse has zero modifications to `twenty-ui`. Cherry-pick should be clean. Schedule in Week 2 (before any UI changes in FUSE-501/502) to avoid compounding conflicts. Verify with `npx nx build twenty-ui && npx nx build twenty-front` after cherry-pick.

---

## Design System & Theme Architecture

### Assets

| Asset | Location | Purpose |
|-------|----------|---------|
| Figma file (duplicated) | `figma.com/design/SPb7b3wG9ZcFt0oy3nLQbi` | Fuse brand token editing + visual QA |
| Twenty original Figma | `figma.com/file/xt8O9mFeLl46C5InWwoMrN` | Reference for upstream design decisions |
| Storybook | `npx nx storybook:build twenty-front` | Component-level visual verification |
| Token map | `docs/fuse-design-system-token-map.md` | Complete Figma↔Code token mapping |

### Theme Strategy (Post-Linaria Cherry-Pick)

After cherry-picking commit `1db2a409`, Twenty's theme system moves from runtime Emotion to zero-runtime Linaria with CSS custom properties. The Fuse theme override becomes a single root stylesheet:

```css
/* packages/twenty-front/src/theme/fuse-overrides.css */
:root {
  /* Brand accent — replace Indigo with Fuse primary */
  --t-accent-accent9: #FUSE_PRIMARY;
  --t-accent-accent10: #FUSE_PRIMARY_DARK;
  --t-accent-accent5: #FUSE_PRIMARY_LIGHT;
  /* Font family override (if needed) */
  --t-font-family: 'Your Font', sans-serif;
  /* Background tint (if desired) */
  --t-background-primary: #FUSE_BG;
}
```

### Workflow: Figma → Code

1. Edit tokens in duplicated Figma file (brand colors, fonts)
2. Read exact values in Figma dev mode
3. Map to `--t-xxx` CSS variables using `docs/fuse-design-system-token-map.md`
4. Override in `fuse-overrides.css`
5. Verify in Storybook — every component inherits automatically
6. Spot-check in running app

### Known Figma↔Code Mismatches (non-blocking)

| Area | Figma | Code | Impact |
|------|-------|------|--------|
| Small font | 12px | 10px (0.625rem) | Minor — Figma may be ahead |
| Blur/Light | 12px radius | 6px | Visual difference in backdrop blur |
| Blur/Strong | 40px radius | 20px | Visual difference in backdrop blur |
| H1 size | 24px | 24.64px (1.54rem) | Negligible — rem rounding |
| Base size | 13px | 13.6px (0.85rem) | Negligible — rem rounding |

---

## Interfaces & Contracts

### Exa Integration Contract

```typescript
// Outbound: Fuse → Exa (webset creation)
POST https://api.exa.ai/v0/websets
{
  search: {
    query: string,           // from DiscoveryRun.queryOptimized
    entity: { type: "company" | "person" },
    criteria: [{ description: string }],  // from TrackCheck.prompt
    count: number
  },
  enrichments: [{ description: string, format: string }],  // from TrackEnrichment
  metadata: { discoveryRunId: string },
  webhook: { url: string, secret: string }  // or account-level registration
}

// Inbound: Exa → Fuse (webhook events)
POST https://fuse.example.com/api/webhooks/exa
Headers: X-Exa-Webhook-Signature: <hmac>
{
  type: "webset.item.created" | "webset.item.enriched" |
        "webset.search.completed" | "webset.idle",
  data: {
    webset_id: string,
    item?: WebsetItem,       // for item events
    search_id?: string       // for completion events
  }
}
```

### Workflow Trigger Contracts

```typescript
// Discovery initiation: MANUAL trigger payload
{ partnerTrackId: string }

// Exa webhook: WEBHOOK trigger payload
{ type: string, data: { webset_id: string, item?: object } }

// Handoff: DATABASE_EVENT trigger
{ objectNameSingular: "partnerCustomerMap", action: "updated" }

// Transcript: MANUAL trigger payload
{ partnerProfileId: string, attachmentId: string }

// Stale handoff: CRON trigger
{ schedule: "0 9 * * 1-5" }  // weekdays 9am
```

### Attribution Event Schema (Immutable Ledger)

```typescript
// No snapshot materialization in MVP. Reports query events directly.
PartnerAttributionEvent {
  eventType: "SOURCED" | "INFLUENCED" | "INTRODUCED" | "ASSISTED" | "TOUCHPOINT"
  occurredAt: DateTime
  partnerProfile: relation
  customerCompany: relation
  opportunity: relation
  sourceObjectType: string   // e.g., "partnerCustomerMap", "discoveryRun"
  sourceObjectId: string
  weightHint: number         // 0-1, used for future multi-touch attribution
  evidence: JSON             // reasoning, sources
}

// MVP report query pattern (pseudo-SQL):
// SELECT pp.name, pae.eventType, SUM(opp.amount)
// FROM partnerAttributionEvent pae
// JOIN partnerProfile pp ON pae.partnerProfileId = pp.id
// JOIN opportunity opp ON pae.opportunityId = opp.id
// WHERE pae.occurredAt BETWEEN :start AND :end
// GROUP BY pp.id, pae.eventType
```

---

## Deferred to Post-MVP

| Item | Reason |
|------|--------|
| SSO/SAML (FUSE-204 original) | No early customer requires it |
| Email deliverability (SPF/DKIM/DMARC) | Only needed when workflows send external-facing email at scale |
| Attribution snapshot materialization | Query-time aggregation sufficient with MVP data volume |
| CustomerSnapshot computation | Same — premature optimization |
| Handoff latency report (p50/p90) | Build after enough handoff data exists |
| Ops dashboard (runtime, sync, failures) | Docker logs + Cloudflare analytics sufficient |
| Custom UI components (fit score cell, evidence card) | Build after watching users interact with default renderers |
| Dark mode theming | Linaria supports it via CSS variable overrides, but defer until light mode brand is validated |
| Workspace governance enforcement testing | Configure admin-only creation, don't build test suite around it |
| Programmatic transcript ingestion | Manual upload first; API ingestion after pattern is proven |
| Multi-workspace billing infrastructure | Single workspace for MVP; multi-workspace when second customer onboards |

---

## Immediate Next Actions (First 5 Tickets)

1. **`FUSE-101`** Provision host + deploy pinned Twenty image with docker compose
2. **`FUSE-102`** Named Cloudflare tunnel + health check cron
3. **`FUSE-103`** Activate Organization Self-Hosted plan + open support channel
4. **`FUSE-105`** Enable Google + Microsoft OAuth with correct redirect URIs
5. **`FUSE-201`** Run partner-os metadata bootstrap on staging workspace
