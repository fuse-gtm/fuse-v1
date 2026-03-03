# Fuse Phase 2 Runbook: Partner Data Model Activation

This runbook executes Phase 2 in a way another operator can run without guessing.

Covers:

- FUSE-200 (reference baseline parity: YC/Apple)
- FUSE-201 (bootstrap + verify 16 objects)
- FUSE-202 (schema freeze review)
- FUSE-203 (opinionated views)
- FUSE-204 (seed sample records)
- FUSE-205 (terminology audit)
- FUSE-206 (Linaria cherry-pick handoff checkpoint)

## Scope and rules

1. Do this on the production workspace only while deployment health is green.
2. Do not edit unrelated platform infrastructure during this phase.
3. Treat this as data-model activation, not feature building.
4. Every completed item must produce a log artifact in `docs/ops-logs/`.
5. YC/Apple reference parity is a hard prerequisite before Fuse opinionation.

## Preconditions

1. `https://app.fusegtm.com/healthz` returns 200.
2. Current deploy/rollback scripts still pass.
3. You have SSH access:
   - `ssh -i ~/.ssh/fuse-prod.pem ubuntu@52.20.136.71`
4. You can run docker compose from `/opt/fuse`.
5. Two reference workspaces (YC and Apple examples) are accessible for comparison.

## Locked decisions

1. Phase 2 executes in parallel with Phase 1 soak checks.
2. Reference source is hybrid best-of-both (YC/Apple winner per slice).
3. Promotion mode is manual + evidence (no direct local DB -> production transfer).
4. No Fuse-specific opinionation starts before FUSE-200 is `PASS`.

## Interfaces and artifact policy

1. No external/public API changes are required in this phase.
2. Internal execution artifacts are mandatory:
   - evidence logs in `docs/ops-logs/` for FUSE-200..206
   - one parity matrix in the FUSE-200 baseline artifact
   - explicit per-slice PR metadata for parity work
3. Database policy:
   - workspace DB state is non-mergeable by git
   - only code/config/docs/scripts are mergeable artifacts

## Workstreams and sequence

Workstreams run in parallel with one hard dependency:

1. Workstream A (FUSE-200) must pass before Workstream B starts production mutations.
2. Workstream C (soak guardrail) runs continuously throughout A and B.

### Workstream A: Reference parity gate

1. Baseline YC and Apple for sidebar, page layout, agents, chat, and admin-panel settings.
2. Build one hybrid winner table per slice.
3. Execute one-slice PRs on `integration/reference-parity`.
4. Require `yc.localhost`, `apple.localhost`, and deployed validation before merge.

### Workstream B: Production activation

1. Execute FUSE-201 to FUSE-205 one mutation window at a time.
2. Log every command and decision with timestamped evidence.
3. Run FUSE-206 checkpoint and record dependency state for downstream design/theme work.

### Workstream C: Phase 1 soak guardrail

1. Continue daily soak evidence while Phase 2 runs.
2. If any Sev-1 appears, pause new production mutations.
3. Resume only after recovery and green health checks.

## Phase 2 acceptance gate

Phase 2 is done only when all of the following are true:

1. All 16 Partner OS objects exist with expected relations.
2. YC/Apple baseline parity is documented and accepted.
3. Schema is frozen and hash-recorded.
4. Default views are configured for operator speed.
5. Seed data supports a live demo path without manual patching.
6. User-facing terminology uses retrieval checks / fit signals / gates / evidence.
7. FUSE-206 dependency status is recorded for downstream rebrand work.

## Canonical object inventory (must all exist)

1. `lead`
2. `partnerProfile`
3. `partnerContactAssignment`
4. `partnerCustomerMap`
5. `partnerAttributionEvent`
6. `partnerAttributionSnapshot`
7. `customerEvent`
8. `customerSnapshot`
9. `partnerPlay`
10. `playCheck`
11. `playEnrichment`
12. `playExclusion`
13. `discoveryRun`
14. `partnerCandidate`
15. `checkEvaluation`
16. `enrichmentEvaluation`

## View expectations from bootstrap

Bootstrap auto-creates only Kanban/Calendar views when configured:

1. Kanban:
   - `lead` by `status`
   - `partnerProfile` by `lifecycleStage`
   - `partnerCustomerMap` by `mapStage`
2. Calendar:
   - `partnerAttributionEvent` by `occurredAt`
   - `customerEvent` by `occurredAt`
   - `customerSnapshot` by `generatedAt`
   - `discoveryRun` by `startedAt`
3. Table and filter views are still manual work (FUSE-203).

## Execution order

1. FUSE-200
2. FUSE-201
3. FUSE-202
4. FUSE-203
5. FUSE-204
6. FUSE-205
7. FUSE-206 checkpoint

Stop if any item fails. Do not continue with partial failures.

## Parallel execution guardrail (Phase 1 soak in progress)

Phase 2 runs in parallel with the remaining soak checks, with this rule:

1. If any Sev-1 occurs, pause all new production mutations immediately.
2. Resolve incident, restore green health, and log the incident.
3. Resume Phase 2 only after recovery is confirmed.

## Production mutation window protocol

Use this before and after every production mutation block (FUSE-201 through FUSE-205):

1. Pre-window checks:
   - `curl -fsS https://app.fusegtm.com/healthz`
   - `curl -fsS http://localhost:3000/healthz` (via SSH on EC2)
   - no unresolved Sev-1 from monitoring channels
2. Execute one issue block only (for example, FUSE-201 only).
3. Post-window checks:
   - repeat public and local health checks
   - smoke login check (Google auth path)
   - confirm multi-workspace routing still works
4. Record start/end timestamps and operator in the issue evidence log.

Use script helper:

```bash
bash packages/twenty-docker/scripts/fuse-phase2-precheck.sh --ack-no-sev1
```

## FUSE-200: Reference baseline parity (YC/Apple) - mandatory pre-gate

Do this first. No Fuse opinionation work starts before this is marked PASS.

### Goal

Mirror the minimum app setup standard demonstrated in YC/Apple examples:

1. sidebar customization
2. page layout customization
3. AI agents
4. AI chat
5. admin panel settings parity

Sidebar parity is capability-first, not state-clone:

1. parity means production exposes the same core edit controls as YC and persists changes
2. parity does not require production to have the same object list/order as YC
3. Partner OS object presence is validated in FUSE-201

### Required parity checklist

1. Sidebar customization:
   - right-click/core edit controls are available in production (move, color, add/remove)
   - one full edit cycle persists after hard refresh and re-login
2. Page layout customization:
   - at least one key object page has intentionally structured sections
   - record detail layout is operator-first, not stock default
3. AI agents:
   - at least one `AI_AGENT` powered workflow path configured and testable
   - structured output shape is defined for downstream automation
4. AI chat:
   - in-app AI chat is enabled and usable in workspace
   - at least one practical query against workspace data succeeds
5. Admin panel settings:
   - production admin user can open `/settings/admin-panel`
   - AI model control classes match reference instances (auto-enable toggle + per-model availability list)
   - one low-risk control write-and-revert succeeds with no platform regressions

### Definition of done for `admin-panel-settings` slice

1. `yc.localhost`, `apple.localhost`, and production all expose the same admin AI control classes for this Twenty version.
2. Production write-and-revert test on one low-risk setting is completed and logged.
3. Post-test regression checks pass:
   - `https://app.fusegtm.com/healthz`
   - `http://localhost:3000/healthz`
   - Google auth
   - multi-workspace routing

### Pass criteria

All 5 parity slices pass against YC/Apple reference expectations with screenshots and operator notes.

Parity type rules:

1. `sidebar`, `page-layout`, `agents`, `chat`, `admin-panel-settings` are capability parity slices
2. Partner object inventory is a state gate in FUSE-201 (not a FUSE-200 pass condition)

### Evidence log

Create: `docs/ops-logs/fuse-phase2-reference-baseline-<timestamp>.md`

Start from template:

- `docs/ops-logs/templates/fuse-phase2-reference-baseline-template.md`

Include:

1. YC and Apple reference screenshots
2. Fuse screenshots for each of the 5 parity slices
3. pass/fail per area
4. parity matrix table (YC vs Apple vs production) with parity type, single winner per slice, and one-sentence rationale
5. explicit go/no-go statement for starting Fuse opinionation

If this is FAIL, stop Phase 2 and close gaps first.

### Execution model (mandatory)

1. All reference-parity code/config work happens on branch `integration/reference-parity`.
2. No direct commits to `main` for FUSE-200 changes.
3. Separate what can be merged from what cannot:
   - mergeable: source code, styles, feature flags, scripts, docs
   - non-mergeable by git: workspace DB state (sidebar items, page layouts, agent/chat records)
4. For non-mergeable state, create reproducible setup instructions or scripts and commit those to the branch.

### PR structure for FUSE-200

1. PR title format:
   - `FUSE-200: reference parity (<slice>)`
   - Example slices: `sidebar`, `page-layout`, `agents`, `chat`, `admin-panel-settings`
2. One slice per PR.
3. Required PR body sections:
   - Goal
   - Scope
   - What changed in code
   - What changed in workspace state and how it is reproduced
   - Validation in `yc.localhost` and `apple.localhost`
   - Validation in deployed environment (`app.fusegtm.com`)
   - Rollback plan

### Merge gate (all must pass)

1. `yc.localhost` parity check passes for the slice.
2. `apple.localhost` parity check passes for the slice.
3. Deployed environment check passes for the slice.
4. For `sidebar` slice, persistence checks pass in production:
   - reorder persists after hard refresh
   - color update persists after hard refresh
   - add/remove cycle succeeds without nav breakage
5. No regressions in:
   - auth login flow
   - deploy script + health checks
   - multi-workspace routing
6. Evidence log is updated in `docs/ops-logs/fuse-phase2-reference-baseline-<timestamp>.md`.
7. For `admin-panel-settings` slice: write-and-revert check is logged and passes.
8. Reviewer confirms the change improves first-customer onboarding speed.

## FUSE-201: Bootstrap + verify 16 objects

### 1) Resolve workspace id

Run on EC2 host:

```bash
cd /opt/fuse
set -a
source packages/twenty-docker/.env
set +a

if ! command -v psql >/dev/null 2>&1; then
  sudo apt-get update && sudo apt-get install -y postgresql-client
fi

PGPASSWORD="$PG_DATABASE_PASSWORD" psql \
  -h "$PG_DATABASE_HOST" \
  -U "$PG_DATABASE_USER" \
  -d "$PG_DATABASE_NAME" \
  -c 'select id, "displayName", "createdAt" from core.workspace order by "createdAt" desc;'
```

Pick the production workspace id and export it:

```bash
export WORKSPACE_ID="<workspace-uuid>"
```

### 2) Run bootstrap command

```bash
cd /opt/fuse
docker compose \
  -f packages/twenty-docker/docker-compose.yml \
  -f packages/twenty-docker/docker-compose.fuse.yml \
  -f packages/twenty-docker/docker-compose.aws.yml \
  --env-file packages/twenty-docker/.env \
  exec -T server \
  yarn command:prod workspace:bootstrap:partner-os -w "$WORKSPACE_ID"
```

This command is idempotent and now bootstraps:

1. Partner OS objects, fields, relations
2. Partner OS Kanban/Calendar views
3. Missing workspace-level sidebar navigation items for Partner OS objects

### 3) Verify idempotency (must pass)

Run the same command again. Second run should complete with no net metadata changes.

### 4) UI verification pass

In `app.fusegtm.com`:

1. Confirm all 16 objects are visible and navigable.
2. Confirm each object opens without metadata errors.
3. Confirm expected auto-created Kanban/Calendar views exist.
4. Confirm Partner OS objects are visible in sidebar navigation.

### 5) Evidence log

Create: `docs/ops-logs/fuse-phase2-bootstrap-<timestamp>.md`

Start from template:

- `docs/ops-logs/templates/fuse-phase2-bootstrap-template.md`

Include:

1. workspace id used
2. bootstrap command used
3. second-run idempotency result
4. checklist of 16 objects and status
5. timestamp and operator

## FUSE-202: Schema freeze review

### 1) Freeze source file and hash

```bash
cd /opt/fuse
git rev-parse HEAD
shasum -a 256 packages/twenty-server/src/modules/partner-os/constants/partner-os-schema.constant.ts
```

Record both values in the freeze log.

### 2) Freeze checklist

Review and confirm:

1. Enum values cover MVP flow states.
2. Required relations for discovery + handoff exist.
3. No emergency schema edits needed for Weeks 3-5 workflows.
4. Any gap is recorded explicitly as post-MVP or new ticket.

### 3) Evidence log

Create: `docs/ops-logs/fuse-phase2-schema-freeze-<timestamp>.md`

Start from template:

- `docs/ops-logs/templates/fuse-phase2-schema-freeze-template.md`

Include:

1. commit sha
2. schema hash
3. approved-by
4. explicit “frozen/unfrozen” decision
5. list of deferred changes (if any)

## FUSE-203: Configure opinionated views

These are manual UI operations. Optimize for weekly operator workflow.

### Required workspace-shared views

1. Partner Profiles:
   - `Active Partners` (filter `status=ACTIVE`, sort by `lifecycleStage`)
2. Partner Customer Maps:
   - `Active Handoffs` (exclude `CLOSED_WON` and `CLOSED_LOST`)
3. Partner Plays:
   - `Templates` (`isTemplate=true`)
   - `Live Plays` (`isTemplate=false`)
4. Discovery Runs:
   - `In Flight` (status in `PENDING`,`STREAMING`)
   - `Completed` (status=`COMPLETE`, sort newest first)
5. Partner Candidates:
   - `Qualified` (`gateStatus=QUALIFIED`, sort `fitScore` desc)
   - `Disqualified` (`gateStatus=DISQUALIFIED`)
6. Attribution Events:
   - Keep calendar view; add table view sorted by `occurredAt` desc

### Evidence log

Create: `docs/ops-logs/fuse-phase2-views-<timestamp>.md`

Start from template:

- `docs/ops-logs/templates/fuse-phase2-views-template.md`

Include:

1. final view list per object
2. filters/sorts used
3. screenshots or notes proving workspace visibility

## FUSE-204: Seed sample records

Use enum values exactly as defined in schema constants.

If `yc.localhost` already contains high-quality partnerships data, treat it as the reference seed baseline.
Do not fabricate fresh demo data unless gaps are found.

### Seed targets

1. Partner Profiles: 4 total
   - 2 `REFERRAL`
   - 2 `INTEGRATION_TECH`
2. Partner Contact Assignments: minimum 6
3. Partner Customer Maps: minimum 4
   - stages include `IDENTIFIED`, `INTRODUCED`, `CO_SELL`, `CLOSED_WON`
4. Partner Plays: minimum 2
5. Play Checks: minimum 8 total across plays
   - include both `SIGNAL` and `MUST_PASS`
6. Play Enrichments: minimum 4 total
7. Play Exclusions: minimum 2 total
8. Discovery Runs: minimum 1 completed run
9. Partner Candidates: minimum 8
   - include `QUALIFIED`, `DISQUALIFIED`, `EXCLUDED`
10. Check Evaluations and Enrichment Evaluations linked to candidates
11. Partner Attribution Events: minimum 6 across event types

### Seed data quality rules

1. Every seeded record must support at least one demo storyline.
2. No orphan relations.
3. Use realistic domains/names, not `test` placeholders.
4. If seeded through UI, keep a deterministic naming prefix: `DEMO_`.
5. Prefer parity with YC reference data over arbitrary sample generation.

### Evidence log

Create: `docs/ops-logs/fuse-phase2-seed-<timestamp>.md`

Start from template:

- `docs/ops-logs/templates/fuse-phase2-seed-template.md`

Include:

1. counts per object
2. list of demo storylines enabled
3. any known gaps left for Phase 3 workflows

## FUSE-205: Terminology audit

Goal: user-facing language is clear and consistent.

Required vocabulary:

1. retrieval checks
2. fit signals
3. gates
4. evidence

### Audit procedure

1. Review object labels and field labels in UI for Partner OS objects.
2. Confirm no user-facing label uses overloaded “criteria” language.
3. Keep external API payload semantics unchanged where required (for example Exa payload `criteria` key).

### Evidence log

Create: `docs/ops-logs/fuse-phase2-terminology-<timestamp>.md`

Start from template:

- `docs/ops-logs/templates/fuse-phase2-terminology-template.md`

Include:

1. strings changed
2. strings explicitly left unchanged with rationale
3. final pass/fail decision

## FUSE-206 checkpoint (dependency record)

FUSE-206 is required before FUSE-502, even if design work starts in parallel.

### Required checkpoint output

1. Record current status of `git cherry-pick 1db2a409`.
2. Record build status for:
   - `nx build twenty-ui`
   - `nx build twenty-front`
3. If not done, capture exact blocker and owner.

### Evidence log

Create: `docs/ops-logs/fuse-phase2-fuse-206-checkpoint-<timestamp>.md`

Start from template:

- `docs/ops-logs/templates/fuse-phase2-fuse-206-checkpoint-template.md`

Include pass/fail and next action.

## Final closeout for Phase 2

When all items pass:

1. Update `docs/fuse-mvp-execution-tracker.md`:
   - mark FUSE-201..205 `DONE`
   - set FUSE-206 to its true current state (`DONE`, `IN_PROGRESS`, or `BLOCKED`)
2. Add a concise change-log entry linking all Phase 2 evidence files.
3. Add one summary file:
   - `docs/ops-logs/fuse-phase2-closeout-<date>.md`
   - include gate decision, risks, and handoff notes for Phase 3.

Start from template:

- `docs/ops-logs/templates/fuse-phase2-closeout-template.md`

## Test scenarios (must be recorded across evidence logs)

1. Reference parity validation:
   - each slice passes on YC, Apple, and production.
2. Bootstrap idempotency:
   - second run produces no unexpected metadata deltas.
3. Object inventory:
   - all 16 partner objects visible and navigable.
4. Views usability:
   - required filtered/sorted views return expected records.
5. Agent/chat operation:
   - one agent action path succeeds, one practical chat query succeeds.
6. Admin panel operation:
   - admin-panel settings control parity is confirmed on YC, Apple, and production.
   - one low-risk write-and-revert in production succeeds without regressions.
7. Seed integrity:
   - minimum record counts met and no orphan relations.
8. Regression checks:
   - local/public health remain green, Google auth unaffected, routing unaffected.

## Evidence artifact set (required)

1. `fuse-phase2-reference-baseline-<timestamp>.md`
2. `fuse-phase2-reference-slice-sidebar-<timestamp>.md`
3. `fuse-phase2-reference-slice-page-layout-<timestamp>.md`
4. `fuse-phase2-reference-slice-agents-<timestamp>.md`
5. `fuse-phase2-reference-slice-chat-<timestamp>.md`
6. `fuse-phase2-reference-slice-admin-panel-<timestamp>.md`
7. `fuse-phase2-bootstrap-<timestamp>.md`
8. `fuse-phase2-schema-freeze-<timestamp>.md`
9. `fuse-phase2-views-<timestamp>.md`
10. `fuse-phase2-seed-<timestamp>.md`
11. `fuse-phase2-terminology-<timestamp>.md`
12. `fuse-phase2-fuse-206-checkpoint-<timestamp>.md`
13. `fuse-phase2-closeout-<date>.md`

## Completion criteria

1. FUSE-200 through FUSE-205 are marked `DONE` with evidence.
2. FUSE-206 is marked with explicit final status and next action.
3. Tracker change log links all Phase 2 evidence artifacts.
4. Phase 2 closeout explicitly states readiness for Phase 3.

## Assumptions and defaults

1. Production remains `app.fusegtm.com` on the current AWS stack.
2. YC/Apple workspaces remain available locally for parity checks.
3. No raw local-to-production database copy is used.
4. Microsoft OAuth is out of scope for this phase.
5. If production incidents occur, stability takes priority over Phase 2 velocity.

## Failure handling

If any step fails:

1. Stop Phase 2 execution.
2. Log failure in `docs/ops-logs/` with timestamp, command, error, and impact.
3. Create or update the relevant issue before retry.
