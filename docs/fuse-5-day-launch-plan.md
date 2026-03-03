# Fuse 5-Day Unified Launch Plan

## Sprint Rule
If it does not make a partnerships rep faster, it waits.

## Status Vocabulary (Linear)
- `Backlog`
- `Todo`
- `In Progress`
- `In Review`
- `Done`
- `Canceled`

## Progress Scale
- Decimal progress uses `0.0` to `1.0`
- Example: `0.3` means roughly 30% complete

## Issues by Day

| Issue | Est. Days | Target Day(s) | Status (Linear) | Progress (0.0-1.0) | Done When |
|---|---:|---|---|---:|---|
| `FUSE-900` Release + Repo Hygiene | 0.75 | Day 1 | In Progress | 0.6 | Branch pushed, deploy green, prod health checks pass, sensitive ops docs redacted/moved to private ops repo |
| `FUSE-901` Internal Dogfood Workspace Setup | 0.75 | Day 1-2 | Backlog | 0.0 | `fuse-internal` workspace created, sandbox lane defined, default flags/config reproducible |
| `FUSE-902` Event Ingestion for Internal Ops Signals | 0.75 | Day 2 | Backlog | 0.0 | GitHub + feature-flag events flow into Twenty custom objects via event-driven ingest |
| `FUSE-903` Partner Brief Agent v1 | 1.00 | Day 3 | Backlog | 0.0 | Agent generates useful pre-call brief from CRM/context in under 60 seconds |
| `FUSE-904` AI Chat Guardrails (Token + Safety) | 0.50 | Day 3 | Backlog | 0.0 | Chat step/output limits enforced; MCP writes gated and auditable |
| `FUSE-905` Product Cleanup + Branding Baseline | 0.75 | Day 4 | Backlog | 0.0 | Dead references removed from user-facing paths; Fuse branding baseline applied |
| `FUSE-906` Launch Pack (Landing + Demo + Outreach) | 0.50 | Day 5 | Backlog | 0.0 | Landing page draft live, demo recorded, target list and outreach copy ready |

## Daily Start Protocol (Run First Every Day)

1. Review yesterday's outcomes against this table.
2. Update `Status (Linear)` and `Progress (0.0-1.0)` for every issue.
3. Confirm top 1-2 issues for the day.
4. Log blockers and escalation path before starting implementation.

## Daily Log

| Day | Date | Review Summary | Status/Progress Updates | Blockers | Next Actions |
|---|---|---|---|---|---|
| Day 1 | 2026-03-03 | Branch cleaned and committed; repo noise controls added | `FUSE-900` -> `In Progress` `0.6` | Deploy verification + doc redaction still pending | Finish `FUSE-900`, start `FUSE-901` |
| Day 2 |  |  |  |  |  |
| Day 3 |  |  |  |  |  |
| Day 4 |  |  |  |  |  |
| Day 5 |  |  |  |  |  |

## Sprint Acceptance Metrics

- Dogfood workspace is used daily by internal team
- One internal agent is reused (not demo-only)
- Median chat run cost reduced materially
- At least 10 target users contacted with tailored outreach
- At least 3 calls booked
