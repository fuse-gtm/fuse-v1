# Fuse Partner-OS Data Model Reference

**Version:** 1.0 — 2026-03-02
**Schema freeze:** FUSE-202 (no additions/removals without bootstrap update)
**Bootstrap:** `scripts/mcp-bootstrap/bootstrap.py`
**Source of truth:** `scripts/mcp-bootstrap/schema_modules.py`

---

## Architecture

The data model is organized into three **motion modules**. Each module is a composable unit — every workspace gets Core, plus whichever motion modules it uses.

| Module | Purpose | Objects |
|---|---|---|
| **Core** | Partner entity model — profiles, contacts, leads | 3 |
| **Co-sell** | Pipeline mapping, attribution events, reporting snapshots | 5 |
| **Discovery** | AI-powered partner finding via Exa websets | 8 |

**Total: 16 custom objects.**

All 16 are created as `isCustom: true` through the Twenty metadata API. Twenty auto-generates standard fields on every custom object (id, name, position, createdAt, updatedAt, deletedAt, createdBy, updatedBy, searchVector) and standard relations (favorites, attachments, noteTargets, taskTargets, timelineActivities). These auto-generated fields are not listed below — only Fuse-defined fields and relations are documented.

### Creation order (topological)

Relations require both source and target objects to exist. The bootstrap creates objects in this order:

1. partnerProfile
2. partnerContactAssignment
3. lead
4. partnerCustomerMap
5. partnerAttributionEvent
6. partnerAttributionSnapshot
7. customerEvent
8. customerSnapshot
9. partnerTrack
10. trackCheck
11. trackEnrichment
12. trackExclusion
13. discoveryRun
14. partnerCandidate
15. checkEvaluation
16. enrichmentEvaluation

### Standard object dependencies

Several Fuse objects relate to standard Twenty objects. These must exist in the workspace before bootstrap runs:

- **company** — canonical company record
- **person** — canonical contact record
- **opportunity** — sales pipeline record
- **workspaceMember** — internal team member

The bootstrap validates their existence before proceeding.

---

## Module: Core

> Partner entity model — profiles, contacts, and leads

### 1. Partner Profile

The central Fuse object. Represents a partner role layered on top of a canonical company. One company can have multiple partner profiles (e.g., a company that is both a referral partner and a tech integration partner).

| | |
|---|---|
| **Singular** | `partnerProfile` |
| **Plural** | `partnerProfiles` |
| **Icon** | `IconBuildingHandshake` |
| **Description** | Partner role profile layered on top of a canonical company |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `partnerType` | SELECT | Partner Type | IconHierarchy3 | INTEGRATION_TECH, AGENCY_SI, AFFILIATE, B2B_INFLUENCER_CREATOR, RESELLER_VAR, REFERRAL, MARKETPLACE_COSELL |
| `lifecycleStage` | SELECT | Lifecycle Stage | IconProgressCheck | PROSPECT, EVALUATING, ACTIVE, PAUSED, TERMINATED |
| `status` | SELECT | Status | IconToggleLeft | ACTIVE, INACTIVE, BLOCKED |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `company` | Company | company | MANY_TO_ONE | Partner Profiles |
| `owner` | Owner | workspaceMember | MANY_TO_ONE | Owned Partner Profiles |

**Views:** All Partner Profiles (TABLE), By Lifecycle Stage (KANBAN)

**Design notes:** partnerType uses the same enum as partnerTrack.partnerType. This is intentional — it allows filtering plays by the partner types they target, and filtering profiles by what kind of partner they are. lifecycleStage tracks the recruitment funnel. status is the operational state (a partner can be ACTIVE in lifecycle but BLOCKED in status due to compliance).

---

### 2. Partner Contact Assignment

Join object between a partner profile and a person. Captures the contextual role that person plays within a specific partnership — not their job title, but their function in the partner relationship.

| | |
|---|---|
| **Singular** | `partnerContactAssignment` |
| **Plural** | `partnerContactAssignments` |
| **Icon** | `IconUserBolt` |
| **Description** | Contextual role of a person in a partner profile |

**Fields:**

| Name | Type | Label | Icon | Default | Options |
|---|---|---|---|---|---|
| `partnerRole` | TEXT | Role | IconId | — | — |
| `isPrimary` | BOOLEAN | Is Primary | IconStar | `false` | — |
| `certificationStatus` | SELECT | Certification Status | IconCertificate | — | NOT_REQUIRED, PENDING, CERTIFIED, EXPIRED |
| `notes` | TEXT | Notes | IconNotes | — | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerProfile` | Partner Profile | partnerProfile | MANY_TO_ONE | Contact Assignments |
| `person` | Person | person | MANY_TO_ONE | Partner Assignments |

**Views:** All Partner Contact Assignments (TABLE)

**Design notes:** This is a many-to-many bridge with attributes. A person can be assigned to multiple partner profiles with different roles. isPrimary marks the main point of contact. certificationStatus tracks vendor certification requirements (common in tech/SI partnerships).

---

### 3. Lead

Pre-conversion contact identity with partner lineage. Leads exist independently of person/company records until conversion. The conversion relations (convertedPerson, convertedCompany, convertedOpportunity) are populated at conversion time, creating the audit trail.

| | |
|---|---|
| **Singular** | `lead` |
| **Plural** | `leads` |
| **Icon** | `IconUserPlus` |
| **Description** | Pre-conversion contact identity with partner lineage |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `sourceType` | SELECT | Source Type | IconTargetArrow | MANUAL, PARTNER_SOURCED, INBOUND, IMPORT |
| `status` | SELECT | Status | IconProgressCheck | NEW, QUALIFYING, CONVERTED, DISQUALIFIED |
| `sourceDetail` | TEXT | Source Detail | IconTextCaption | — |
| `notes` | RICH_TEXT_V2 | Notes | IconNotes | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `sourcePartnerProfile` | Source Partner Profile | partnerProfile | MANY_TO_ONE | Sourced Leads |
| `sourcePartnerPerson` | Source Partner Person | person | MANY_TO_ONE | Partner Sourced Leads |
| `convertedPerson` | Converted Person | person | MANY_TO_ONE | Converted Leads |
| `convertedCompany` | Converted Company | company | MANY_TO_ONE | Converted Leads |
| `convertedOpportunity` | Converted Opportunity | opportunity | MANY_TO_ONE | Converted Leads |

**Views:** All Leads (TABLE), By Status (KANBAN)

**Design notes:** Lead is the entry point for the partner-to-sales handoff. sourcePartnerProfile and sourcePartnerPerson capture who referred or sourced this lead. The three converted* relations are null until conversion. This separation (lead vs. person) is deliberate — it avoids polluting the CRM contact database with unqualified partner-sourced names.

---

## Module: Co-sell

> Co-sell pipeline mapping, attribution events, and reporting snapshots

### 4. Partner Customer Map

The mapping layer between partners and customer opportunities. Tracks which partners are engaged on which deals, at what stage, and through what motion.

| | |
|---|---|
| **Singular** | `partnerCustomerMap` |
| **Plural** | `partnerCustomerMaps` |
| **Icon** | `IconRouteAltLeft` |
| **Description** | Mapping layer between partners and customer opportunities |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `mapStage` | SELECT | Map Stage | IconProgressCheck | IDENTIFIED, MATCHED, INTRODUCED, CO_SELL, CLOSED_WON, CLOSED_LOST |
| `motionType` | SELECT | Motion Type | IconGitBranch | DISCOVERY, REFERRAL, CO_SELL, INTEGRATION, MARKETPLACE |
| `confidence` | NUMBER | Confidence | IconPercentage | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerProfile` | Partner Profile | partnerProfile | MANY_TO_ONE | Customer Maps |
| `customerCompany` | Customer Company | company | MANY_TO_ONE | Partner Customer Maps |
| `opportunity` | Opportunity | opportunity | MANY_TO_ONE | Partner Customer Maps |
| `owner` | Owner | workspaceMember | MANY_TO_ONE | Owned Partner Customer Maps |

**Views:** All Partner Customer Maps (TABLE), By Map Stage (KANBAN)

**Design notes:** This is the operational workhorse of co-sell. One partner can have many customer maps; one opportunity can be mapped to multiple partners. confidence is a 0-100 score representing the partner team's assessment of deal likelihood through the partner channel. mapStage mirrors the pipeline but from the partner motion perspective.

---

### 5. Partner Attribution Event

Immutable attribution touchpoint. Every time a partner contributes to a deal — sourced it, made an introduction, assisted a call — an event is appended. These are never updated or deleted. Reporting is query-time aggregation.

| | |
|---|---|
| **Singular** | `partnerAttributionEvent` |
| **Plural** | `partnerAttributionEvents` |
| **Icon** | `IconClockHour4` |
| **Description** | Immutable attribution touchpoint event |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `eventType` | SELECT | Event Type | IconTargetArrow | SOURCED, INFLUENCED, INTRODUCED, ASSISTED, TOUCHPOINT |
| `occurredAt` | DATE_TIME | Occurred At | IconCalendarTime | — |
| `sourceObjectType` | TEXT | Source Object Type | IconDatabase | — |
| `sourceObjectId` | TEXT | Source Object ID | IconHash | — |
| `weightHint` | NUMBER | Weight Hint | IconPercentage | — |
| `evidence` | RAW_JSON | Evidence | IconFileDescription | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerProfile` | Partner Profile | partnerProfile | MANY_TO_ONE | Attribution Events |
| `customerCompany` | Customer Company | company | MANY_TO_ONE | Partner Attribution Events |
| `opportunity` | Opportunity | opportunity | MANY_TO_ONE | Partner Attribution Events |

**Views:** All Attribution Events (TABLE)

**Design notes:** The sourceObjectType/sourceObjectId pair is a polymorphic reference — it points to whatever triggered the attribution event (a meeting transcript, an email, a workflow run). This avoids hard-coding relation targets for every possible trigger source. weightHint is advisory; actual credit calculation happens in the scoring service. evidence stores the raw proof (transcript excerpt, email snippet, etc.) as JSON.

**Invariant: attribution events are append-only. Never update or delete.**

---

### 6. Partner Attribution Snapshot

Materialized view of attribution data for reporting. Computed periodically from the event ledger using a specified attribution model and time window.

| | |
|---|---|
| **Singular** | `partnerAttributionSnapshot` |
| **Plural** | `partnerAttributionSnapshots` |
| **Icon** | `IconChartHistogram` |
| **Description** | Materialized attribution snapshot for reporting |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `model` | SELECT | Model | IconHierarchy2 | FIRST_TOUCH, LAST_TOUCH, LINEAR, CUSTOM_WEIGHTED |
| `lookbackWindowDays` | NUMBER | Lookback Window Days | IconCalendarStats | — |
| `periodStart` | DATE | Period Start | IconCalendarEvent | — |
| `periodEnd` | DATE | Period End | IconCalendarEvent | — |
| `creditedRevenue` | NUMBER | Credited Revenue | IconCoins | — |
| `creditPercent` | NUMBER | Credit Percent | IconPercentage | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerProfile` | Partner Profile | partnerProfile | MANY_TO_ONE | Attribution Snapshots |
| `customerCompany` | Customer Company | company | MANY_TO_ONE | Partner Attribution Snapshots |
| `opportunity` | Opportunity | opportunity | MANY_TO_ONE | Partner Attribution Snapshots |

**Views:** All Partner Attribution Snapshots (TABLE)

**Design notes:** The MVP supports four models. FIRST_TOUCH and LAST_TOUCH are deterministic. LINEAR splits credit equally. CUSTOM_WEIGHTED uses the weightHint from events. lookbackWindowDays scopes how far back to look for attribution events relative to the opportunity close date. These snapshots are the basis for the "partner-sourced pipeline" and "partner-influenced revenue" dashboard metrics.

---

### 7. Customer Event

Append-only ledger of customer revenue and pipeline events. Every opportunity stage change, close, or partner interaction creates a customer event. This is the raw data that feeds both attribution and customer-level reporting.

| | |
|---|---|
| **Singular** | `customerEvent` |
| **Plural** | `customerEvents` |
| **Icon** | `IconClockHour4` |
| **Description** | Append-only customer revenue and pipeline event ledger |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `eventType` | SELECT | Event Type | IconBolt | OPPORTUNITY_CREATED, OPPORTUNITY_STAGE_CHANGED, OPPORTUNITY_CLOSED_WON, OPPORTUNITY_CLOSED_LOST, PARTNER_MENTIONED, PARTNER_INTRODUCED, PARTNER_ASSISTED |
| `occurredAt` | DATE_TIME | Occurred At | IconCalendarTime | — |
| `eventValue` | NUMBER | Event Value | IconCoins | — |
| `currencyCode` | TEXT | Currency Code | IconTextCaption | — |
| `sourceObjectType` | TEXT | Source Object Type | IconDatabase | — |
| `sourceObjectId` | TEXT | Source Object ID | IconHash | — |
| `details` | RAW_JSON | Details | IconFileDescription | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `customerCompany` | Customer Company | company | MANY_TO_ONE | Customer Events |
| `opportunity` | Opportunity | opportunity | MANY_TO_ONE | Customer Events |
| `partnerProfile` | Partner Profile | partnerProfile | MANY_TO_ONE | Customer Events |
| `partnerCustomerMap` | Partner Customer Map | partnerCustomerMap | MANY_TO_ONE | Customer Events |

**Views:** All Customer Events (TABLE)

**Design notes:** customerEvent is broader than partnerAttributionEvent. Attribution events only capture partner contributions. Customer events capture all pipeline activity — partner-related or not. This separation matters for calculating metrics like "% of pipeline partner-influenced" where you need both the numerator (attribution events) and denominator (customer events).

---

### 8. Customer Snapshot

Materialized rollup of customer pipeline and revenue data. Computed periodically from the event ledger. Aggregates open pipeline, sourced revenue, influenced revenue, and opportunity counts for a given partner-customer pair over a time window.

| | |
|---|---|
| **Singular** | `customerSnapshot` |
| **Plural** | `customerSnapshots` |
| **Icon** | `IconChartHistogram` |
| **Description** | Materialized customer pipeline and revenue rollup |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `model` | SELECT | Model | IconHierarchy2 | FIRST_TOUCH, LAST_TOUCH, LINEAR, CUSTOM_WEIGHTED |
| `periodStart` | DATE | Period Start | IconCalendarEvent | — |
| `periodEnd` | DATE | Period End | IconCalendarEvent | — |
| `openPipelineAmount` | NUMBER | Open Pipeline Amount | IconChartArrows | — |
| `sourcedRevenueAmount` | NUMBER | Sourced Revenue Amount | IconCoins | — |
| `influencedRevenueAmount` | NUMBER | Influenced Revenue Amount | IconCoins | — |
| `wonRevenueAmount` | NUMBER | Won Revenue Amount | IconCoins | — |
| `activeOpportunityCount` | NUMBER | Active Opportunity Count | IconListNumbers | — |
| `wonOpportunityCount` | NUMBER | Won Opportunity Count | IconListNumbers | — |
| `generatedAt` | DATE_TIME | Generated At | IconCalendarTime | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `customerCompany` | Customer Company | company | MANY_TO_ONE | Customer Snapshots |
| `partnerProfile` | Partner Profile | partnerProfile | MANY_TO_ONE | Customer Snapshots |
| `partnerCustomerMap` | Partner Customer Map | partnerCustomerMap | MANY_TO_ONE | Customer Snapshots |

**Views:** All Customer Snapshots (TABLE)

**Design notes:** This is the reporting object. sourcedRevenueAmount is revenue from deals the partner sourced. influencedRevenueAmount is revenue from deals the partner touched but didn't source. wonRevenueAmount is the total won. These are the numbers that go in the "Partner-Sourced / Influenced Pipeline" core report.

---

## Module: Discovery

> Partner track execution, Exa webset discovery, scoring, and enrichment

### 9. Partner Track

The template that defines what kind of partner you're looking for and why. A track combines a partner type, an entity type (company or person), an outcome goal, retrieval checks, enrichment columns, and exclusion rules.

| | |
|---|---|
| **Singular** | `partnerTrack` |
| **Plural** | `partnerTracks` |
| **Icon** | `IconRoute` |
| **Description** | Reusable discovery and partner execution template |

**Fields:**

| Name | Type | Label | Icon | Default | Options |
|---|---|---|---|---|---|
| `partnerType` | SELECT | Partner Type | IconHierarchy3 | — | INTEGRATION_TECH, AGENCY_SI, AFFILIATE, B2B_INFLUENCER_CREATOR, RESELLER_VAR, REFERRAL, MARKETPLACE_COSELL |
| `entityType` | SELECT | Entity Type | IconUsersGroup | — | COMPANY, PERSON |
| `outcome` | SELECT | Outcome | IconTargetArrow | — | GROW_REVENUE, GROW_USAGE, ENTER_MARKET, REDUCE_CHURN, EXPAND_SERVICES, BRAND_AWARENESS |
| `isTemplate` | BOOLEAN | Is Template | IconTemplate | `false` | — |
| `outreachAngle` | TEXT | Outreach Angle | IconMessage | — | — |
| `successMetrics` | RAW_JSON | Success Metrics | IconTargetArrow | — | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `owner` | Owner | workspaceMember | MANY_TO_ONE | Owned Partner Tracks |

**Views:** All Partner Tracks (TABLE)

**Design notes:** isTemplate distinguishes reusable track templates from one-off plays. Templates can be cloned. outcome captures why this track exists — what business result it's designed to produce. This is not just metadata; the scoring service uses outcome to weight checks differently depending on what you're optimizing for. successMetrics is freeform JSON for now (MVP scope) — structured metric tracking comes later.

---

### 10. Track Check

A retrieval check and fit signal definition. Each track has multiple checks, each with a natural language prompt, a weight, and a gate mode. SIGNAL checks contribute to the fit score. MUST_PASS checks are binary — if a candidate fails a must-pass, it's disqualified regardless of total score.

| | |
|---|---|
| **Singular** | `trackCheck` |
| **Plural** | `trackChecks` |
| **Icon** | `IconChecklist` |
| **Description** | Retrieval check and fit signal definition for a track |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `checkLabel` | TEXT | Check Label | IconTextCaption | — |
| `prompt` | TEXT | Prompt | IconFileDescription | — |
| `weight` | NUMBER | Weight | IconPercentage | — |
| `gateMode` | SELECT | Gate Mode | IconFilter | SIGNAL, MUST_PASS |
| `position` | NUMBER | Position | IconSortAscending | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerTrack` | Partner Track | partnerTrack | MANY_TO_ONE | Checks |

**Views:** All Track Checks (TABLE)

**Design notes:** prompt is the natural language instruction sent to the Exa adapter. "Does this company have a public API?" or "Is this person a decision-maker in partnerships?" weight determines how much this check contributes to fitScore. position controls the display order and (eventually) the evaluation order for short-circuit optimization.

---

### 11. Track Enrichment

An enrichment column definition. After a candidate passes checks, enrichments extract additional structured data. Each enrichment has a prompt and a format (what shape the extracted value should take).

| | |
|---|---|
| **Singular** | `trackEnrichment` |
| **Plural** | `trackEnrichments` |
| **Icon** | `IconTablePlus` |
| **Description** | Enrichment column definition for a track |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `enrichmentName` | TEXT | Enrichment Name | IconTextCaption | — |
| `prompt` | TEXT | Prompt | IconFileDescription | — |
| `format` | SELECT | Format | IconBrackets | TEXT, NUMBER, URL, EMAIL, PHONE, OPTIONS |
| `position` | NUMBER | Position | IconSortAscending | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerTrack` | Partner Track | partnerTrack | MANY_TO_ONE | Enrichments |

**Views:** All Track Enrichments (TABLE)

**Design notes:** Enrichments are the columns that appear in the discovery results table. "Company founding year" (NUMBER), "Partnerships page URL" (URL), "Tech stack" (TEXT). format constrains the extraction to help downstream processing.

---

### 12. Track Exclusion

Exclusion rules scoped to a track. Prevents specific entities from appearing in discovery results. Covers competitors, do-not-contact lists, existing active partners, previously contacted entities, and explicit bad fits.

| | |
|---|---|
| **Singular** | `trackExclusion` |
| **Plural** | `trackExclusions` |
| **Icon** | `IconFilterX` |
| **Description** | Exclusion rule scoped to a partner track |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `identifier` | TEXT | Identifier | IconHash | — |
| `exclusionType` | SELECT | Exclusion Type | IconShieldX | COMPETITOR, DNC, ACTIVE_PARTNER, ALREADY_CONTACTED, BAD_FIT, ALREADY_DISPLAYED, RESTRICTED |
| `reason` | TEXT | Reason | IconNotes | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerTrack` | Partner Track | partnerTrack | MANY_TO_ONE | Exclusions |

**Views:** All Track Exclusions (TABLE)

**Design notes:** identifier is the matching key — typically a domain (for companies) or an email (for people). The discovery adapter checks candidates against exclusions before scoring. ALREADY_DISPLAYED prevents showing the same candidate across multiple runs of the same play.

---

### 13. Discovery Run

A single execution of a partner track against Exa's webset API. Captures the raw query, optimized query, Exa webset ID, execution status, and results metadata.

| | |
|---|---|
| **Singular** | `discoveryRun` |
| **Plural** | `discoveryRuns` |
| **Icon** | `IconPlayerPlay` |
| **Description** | Single webset-backed execution of a partner track |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `queryRaw` | TEXT | Query Raw | IconMessageSearch | — |
| `queryOptimized` | TEXT | Query Optimized | IconSparkles | — |
| `exaWebsetId` | TEXT | Exa Webset ID | IconHash | — |
| `status` | SELECT | Status | IconLoader | PENDING, STREAMING, COMPLETE, CANCELLED, ERROR |
| `progress` | RAW_JSON | Progress | IconChartArrows | — |
| `resultCount` | NUMBER | Result Count | IconListNumbers | — |
| `startedAt` | DATE_TIME | Started At | IconPlayerPlay | — |
| `completedAt` | DATE_TIME | Completed At | IconCheck | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerTrack` | Partner Track | partnerTrack | MANY_TO_ONE | Discovery Runs |
| `createdByMember` | Created By | workspaceMember | MANY_TO_ONE | Discovery Runs |

**Views:** All Discovery Runs (TABLE)

**Design notes:** queryRaw is what the user typed or what the play checks produced. queryOptimized is the adapter's reformulation for Exa. exaWebsetId links back to the Exa API for status polling (though the primary flow is webhook-driven). progress stores the streaming state as JSON — how many results received, how many scored, how many passed gates. The status lifecycle is: PENDING → STREAMING → COMPLETE (or CANCELLED / ERROR).

---

### 14. Partner Candidate

A candidate result returned by a discovery run. Contains the entity's URL, display name, domain, fit score, gate status, and timestamps. This is the row in the discovery results table.

| | |
|---|---|
| **Singular** | `partnerCandidate` |
| **Plural** | `partnerCandidates` |
| **Icon** | `IconBuildingFactory2` |
| **Description** | Candidate result returned by discovery run |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `entityUrl` | TEXT | Entity URL | IconLink | — |
| `entityType` | SELECT | Entity Type | IconUsersGroup | COMPANY, PERSON |
| `displayName` | TEXT | Display Name | IconTextCaption | — |
| `companyDomain` | TEXT | Company Domain | IconWorld | — |
| `fitScore` | NUMBER | Fit Score | IconPercentage | — |
| `confidence` | NUMBER | Confidence | IconShieldCheck | — |
| `gateStatus` | SELECT | Gate Status | IconFilter | QUALIFIED, DISQUALIFIED, EXCLUDED |
| `gateReason` | TEXT | Gate Reason | IconAlertCircle | — |
| `receivedAt` | DATE_TIME | Received At | IconCalendarTime | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `discoveryRun` | Discovery Run | discoveryRun | MANY_TO_ONE | Candidates |

**Views:** All Partner Candidates (TABLE)

**Design notes:** fitScore is the weighted sum of check contributions (0-100). confidence is how certain the scoring service is about the score (separate from the score itself — a candidate could have a high fit score with low confidence if the evidence is thin). gateStatus is the final disposition: QUALIFIED (passed all must-pass gates), DISQUALIFIED (failed a must-pass), EXCLUDED (matched an exclusion rule). gateReason stores which gate or exclusion triggered the rejection.

---

### 15. Check Evaluation

Per-check evaluation result for a candidate. Every check in the play produces one evaluation per candidate. Contains the match status, reasoning, source evidence, and score contribution.

| | |
|---|---|
| **Singular** | `checkEvaluation` |
| **Plural** | `checkEvaluations` |
| **Icon** | `IconChecklist` |
| **Description** | Per-check evaluation result for a candidate |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `status` | SELECT | Status | IconCircleCheck | MATCH, NO_MATCH, UNCLEAR |
| `reasoningMd` | TEXT | Reasoning Markdown | IconFileDescription | — |
| `sources` | RAW_JSON | Sources | IconLink | — |
| `contribution` | NUMBER | Contribution | IconPercentage | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerCandidate` | Partner Candidate | partnerCandidate | MANY_TO_ONE | Check Evaluations |
| `trackCheck` | Track Check | trackCheck | MANY_TO_ONE | Evaluations |

**Views:** All Check Evaluations (TABLE)

**Design notes:** This is the explainability layer. For any candidate, you can drill into each check to see why it matched or didn't. reasoningMd is the AI's explanation in markdown. sources is the evidence (URLs, snippets) that support the evaluation. contribution is the actual score contribution after applying the check's weight and the match status.

---

### 16. Enrichment Evaluation

Per-enrichment extracted value for a candidate. Every enrichment column in the play produces one evaluation per candidate.

| | |
|---|---|
| **Singular** | `enrichmentEvaluation` |
| **Plural** | `enrichmentEvaluations` |
| **Icon** | `IconTablePlus` |
| **Description** | Per-enrichment extracted value for a candidate |

**Fields:**

| Name | Type | Label | Icon | Options |
|---|---|---|---|---|
| `valueText` | TEXT | Value | IconTextCaption | — |
| `reasoningMd` | TEXT | Reasoning Markdown | IconFileDescription | — |
| `sources` | RAW_JSON | Sources | IconLink | — |

**Relations:**

| Name | Label | Target | Cardinality | Inverse Label |
|---|---|---|---|---|
| `partnerCandidate` | Partner Candidate | partnerCandidate | MANY_TO_ONE | Enrichment Evaluations |
| `trackEnrichment` | Track Enrichment | trackEnrichment | MANY_TO_ONE | Evaluations |

**Views:** All Enrichment Evaluations (TABLE)

**Design notes:** valueText stores the extracted value as text regardless of the enrichment's format. Format enforcement happens at display time. sources and reasoningMd provide the same explainability layer as check evaluations.

---

## Relationship Graph

```
Standard Twenty Objects          Fuse Core                    Fuse Co-sell                  Fuse Discovery
═══════════════════════         ═══════════                  ═══════════                   ═══════════════

                              ┌─────────────────┐
  ┌──────────┐    company ←───┤ Partner Profile  │←─── partnerProfile ──┐
  │ Company  │←── converted ──┤                  │                      │
  │          │←── customer ───┤   (central hub)  │──── owner ──→┐       │
  └──────────┘                └──┬──────┬────────┘              │       │
                                 │      │                       │       │
                                 │      │ partnerProfile        │       │
  ┌──────────┐    person ←───────┘      │                       │       │
  │ Person   │←── source/convert ──┐    │                       │       │
  └──────────┘                     │    │                       │       │
                              ┌────┴────┴────────┐              │       │
  ┌──────────┐                │ Partner Contact  │              │       │
  │Workspace │←── owner ──────┤  Assignment      │         ┌────┴───┐   │
  │ Member   │                └──────────────────┘         │Partner │   │
  │          │←── createdBy ──┐                            │Customer│   │
  │          │←── owner ──────┤                            │  Map   │←──┤
  └──────────┘                │                            └───┬────┘   │
                              │    ┌─────────────┐             │        │
  ┌──────────┐                │    │    Lead     │             │        │
  │Opportun- │←── converted ──┼────┤             │             │        │
  │  ity     │←── opportunity ─┼───┤  (5 rels)  │             │        │
  └──────────┘                │    └─────────────┘             │        │
                              │                                │        │
                              │    ┌──────────────────────┐    │        │
                              ├────┤ Attribution Event    │←───┘        │
                              │    │ (immutable append)   │             │
                              │    └──────────────────────┘             │
                              │                                         │
                              │    ┌──────────────────────┐             │
                              ├────┤ Attribution Snapshot │              │
                              │    │ (materialized view)  │              │
                              │    └──────────────────────┘             │
                              │                                         │
                              │    ┌──────────────────────┐             │
                              ├────┤ Customer Event       │─── map ────┘
                              │    │ (event ledger)       │
                              │    └──────────────────────┘
                              │
                              │    ┌──────────────────────┐
                              └────┤ Customer Snapshot    │─── map ────┘
                                   │ (revenue rollup)     │
                                   └──────────────────────┘


  Discovery Module (self-contained tree)
  ═══════════════════════════════════════

  ┌───────────────┐
  │ Partner Track  │ (template)
  └──┬──┬──┬──┬───┘
     │  │  │  │
     │  │  │  └──→ ┌──────────────┐
     │  │  │       │ Track Check   │←──┐
     │  │  │       └──────────────┘   │
     │  │  │                          │
     │  │  └──────→ ┌──────────────┐  │  ┌──────────────────┐
     │  │           │Play Enrichmt │←─┼──┤Enrichment Eval   │
     │  │           └──────────────┘  │  └────────┬─────────┘
     │  │                             │           │
     │  └─────────→ ┌──────────────┐  │  ┌────────┴─────────┐
     │              │Track Exclusion│  └──┤ Check Evaluation │
     │              └──────────────┘     └────────┬─────────┘
     │                                            │
     └────────────→ ┌──────────────┐    ┌─────────┴────────┐
                    │Discovery Run │───→│Partner Candidate │
                    └──────────────┘    └──────────────────┘
```

---

## SELECT Option Color Semantics

All SELECT fields use semantic color assignment:

| Semantic | Color | Matched tokens |
|---|---|---|
| Positive | green | ACTIVE, WON, MATCHED, CERTIFIED, SUCCESS, CONVERTED, CLOSED_WON |
| Warning | yellow | PENDING, PAUSED, EVALUATING, NEW, QUALIFYING, PROSPECT, IDENTIFIED |
| Negative | red | BLOCKED, FAILED, ERROR, LOST, EXPIRED, TERMINATED, DISQUALIFIED, CLOSED_LOST |
| Neutral | sky | Everything else |

---

## Field Count Summary

| Object | Custom Fields | Relations (Fuse) | Views |
|---|---|---|---|
| partnerProfile | 3 | 2 | 2 |
| partnerContactAssignment | 4 | 2 | 1 |
| lead | 4 | 5 | 2 |
| partnerCustomerMap | 3 | 4 | 2 |
| partnerAttributionEvent | 6 | 3 | 1 |
| partnerAttributionSnapshot | 6 | 3 | 1 |
| customerEvent | 7 | 4 | 1 |
| customerSnapshot | 9 | 3 | 1 |
| partnerTrack | 6 | 1 | 1 |
| trackCheck | 5 | 1 | 1 |
| trackEnrichment | 4 | 1 | 1 |
| trackExclusion | 3 | 1 | 1 |
| discoveryRun | 8 | 2 | 1 |
| partnerCandidate | 9 | 1 | 1 |
| checkEvaluation | 4 | 2 | 1 |
| enrichmentEvaluation | 3 | 2 | 1 |
| **Totals** | **84** | **37** | **19** |

---

## Invariants

1. **Attribution events are immutable.** Never UPDATE or DELETE partnerAttributionEvent records.
2. **Customer events are append-only.** Same rule as attribution events.
3. **Scoring logic lives in one place.** PartnerScoringService on the server. Never duplicate in workflow CODE blocks.
4. **Schema is frozen for MVP.** No additions/removals without updating schema_modules.py AND re-running bootstrap.
5. **All Fuse code in partner-os module.** Zero modifications to Twenty core or twenty-ui.
6. **Webhook-driven discovery.** No polling. Exa webhooks → Twenty WEBHOOK triggers → workflows → SSE.
