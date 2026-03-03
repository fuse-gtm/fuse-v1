# Fuse 5-Day Unified Launch Plan

## Sprint Rule
If it does not make a partnerships rep faster, it waits.

## Status Vocabulary (Linear)
- `Triage`
- `Backlog`
- `Todo`
- `In Progress`
- `In Review`
- `Done`
- `Canceled`

## Active Launch Issues by Day

| Issue | Est. Days | Target Day(s) | Status (Linear) | Done When |
|---|---:|---|---|---|
| `FUSE-900` Release + Repo Hygiene | 0.75 | Day 1 | In Review | Branch pushed, deploy green, prod health checks pass, sensitive ops docs redacted/moved to private ops repo |
| `FUSE-905` Product Cleanup + Branding Baseline | 1.00 | Day 1-2 | Backlog | Dead references removed from user-facing paths; Fuse branding baseline applied |
| `FUSE-903` Partner Brief Agent v1 | 1.00 | Day 2-3 | Backlog | Agent generates useful pre-call brief from CRM/context in under 60 seconds |
| `FUSE-904` AI Chat Guardrails (Token + Safety) | 0.75 | Day 3 | Backlog | Chat step/output limits enforced; MCP writes gated and auditable |
| `FUSE-906` Launch Pack (Landing + Demo + Outreach) | 1.50 | Day 4-5 | Backlog | Landing page draft live, demo recorded, target list and outreach copy ready |

## Post-Launch Backlog (Explicitly Deferred)

| Issue | Est. Days | New Target | Status (Linear) | Done When |
|---|---:|---|---|---|
| `FUSE-901` Internal Dogfood Workspace Setup | 0.75 | Post-launch Week 1 | Backlog | `fuse-internal` workspace created, sandbox lane defined, default flags/config reproducible |
| `FUSE-902` Event Ingestion for Internal Ops Signals | 0.75 | Post-launch Week 1 | Backlog | GitHub + feature-flag events flow into Twenty custom objects via event-driven ingest |

## Daily Start Protocol (Run First Every Day)

1. Review yesterday's outcomes against this table.
2. Update `Status (Linear)` for every issue.
3. Confirm top 1-2 issues for the day.
4. Log blockers and escalation path before starting implementation.

## Daily Log

| Day | Date | Review Summary | Status/Progress Updates | Blockers | Next Actions |
|---|---|---|---|---|---|
| Day 1 | 2026-03-03 | Branch cleaned, pushed to origin, production health checks passed, and sensitive ops artifacts were sanitized/removed from tracked docs | `FUSE-900` -> `In Review`; `FUSE-901/902` deferred post-launch | Explicit deploy-tag verification still needed for final close | Close `FUSE-900`, start `FUSE-905` |
| Day 2 |  |  |  |  |  |
| Day 3 |  |  |  |  |  |
| Day 4 |  |  |  |  |  |
| Day 5 |  |  |  |  |  |

## Sprint Acceptance Metrics

- Median chat run cost reduced materially
- At least 10 target users contacted with tailored outreach
- At least 3 calls booked
- At least 3 live demos completed with real prospects
