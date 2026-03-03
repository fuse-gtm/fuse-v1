# Fuse MVP Execution Tracker

This is the working file.

Use this to run execution day by day.
Do not treat this as strategy. Treat it as operations.

Source documents:
- `docs/fuse-mvp-architecture-plan-v2.md` — architecture plan
- `docs/fuse-design-system-token-map.md` — Figma↔Code token mapping for FUSE-502
- `docs/fuse-phase2-data-model-runbook.md` — execution runbook for FUSE-201..206
- Figma (duplicated): `figma.com/design/SPb7b3wG9ZcFt0oy3nLQbi` — Fuse brand token editing
- Figma (original): `figma.com/file/xt8O9mFeLl46C5InWwoMrN` — Twenty upstream reference
- Storybook: `npx nx storybook:build twenty-front` — component visual verification

## Status Legend

- `TODO` = not started
- `IN_PROGRESS` = actively being worked
- `BLOCKED` = external dependency
- `DONE` = accepted against definition of done

## Operating Rules

1. Every issue must have one owner.
2. Every issue must have objective evidence when marked `DONE`.
3. No new feature work if deployment health is red.
4. Phase 1 gates everything else.

## Initiative: FUSE-INIT-01

## Phase 1 (Week 1): Deployment + Commercial Foundation

### Phase 1 Acceptance Gate

- [ ] Public URL stable for 7 days.
- [x] Deploy and rollback are repeatable from scripts.
- [x] Google OAuth login works for ICP path (Microsoft deferred).
- [x] Organization Self-Hosted plan active with screenshot proof.
- [x] License/commercial constraints documented in writing.

### Phase 1 Issue Board

| Issue | Title | Priority | Owner | Status | Dependencies | Definition of Done | Evidence |
|---|---|---|---|---|---|---|---|
| FUSE-101 | Provision host + deploy pinned image | P0 | Dhruv | DONE | None | `deploy-fuse-prod.sh` succeeds and `/healthz` returns 200 | EC2 i-05b90467e22fec9d2 (t3.small); RDS fuse-prod-db; tag `partner-os-45e979039d`; healthz 200 (2026-03-01) |
| FUSE-102 | Public HTTPS ingress (Caddy + DNS) | P0 | Dhruv | DONE | FUSE-101 | `https://app.fusegtm.com/healthz` returns 200; auto-renewing TLS | Caddy + Let's Encrypt on EC2; wildcard on-demand TLS for `*.fusegtm.com`; Hostinger DNS (`app` + `*`); SG hardened (port 3000 closed, SSH restricted) (2026-03-02) |
| FUSE-103 | Activate Organization Self-Hosted plan | P0 | Dhruv | DONE | None | Plan active with screenshot evidence | Organization plan active on fusegtm.twenty.com (Monthly, 1 seat, 5M credits, renewal 2026-04-01). Screenshot confirmed (2026-03-01) |
| FUSE-104 | License and distribution baseline | P0 | Dhruv | DONE | FUSE-103 | Written confirmation stored in docs | `docs/fuse-license-baseline.md`; Twenty billing docs confirm "not required to publish your custom code as open-source before distributing" (2026-03-01) |
| FUSE-105 | Enable Google OAuth for production login | P0 | Dhruv | DONE | FUSE-101, FUSE-102 | Google OAuth completes login end-to-end | `CHECK_PROVIDERS=google` readiness passes; deployed on EC2; browser flow reaches Google auth and callback URL `https://app.fusegtm.com/auth/google/redirect`; founder confirmed login works (2026-03-01) |
| FUSE-106 | Tag-based deploy + rollback drill | P1 | Dhruv | DONE | FUSE-101 | Deploy tag N and rollback to N-1 in <10 min | `docs/ops-logs/fuse-deploy-rollback-20260301T232933Z.md`; A=`partner-os-45e979039d`, B=`partner-os-7c718a54`; rollback recovery `108s` |
| FUSE-107 | OAuth env pass-through in compose | P0 | Codex | DONE | None | OAuth env vars wired in server + worker compose env | docker-compose + env updated; container env validated (2026-03-01) |
| FUSE-108 | Self-hosted identity migration note | P1 | Codex | DONE | FUSE-103 | Doc explains cloud-vs-self-hosted account reality + migration path | `docs/fuse-identity-migration-note.md` |

### Phase 1 Detailed Checklist

#### Day 1: Baseline and Contracts

- [x] Confirm canonical repo and branch.
- [x] Confirm `upstream` push remains disabled.
- [x] Freeze image naming rule: `partner-os-<sha>`.
- [x] Create host `.env` from `packages/twenty-docker/.env.fuse-prod.example`.
- [x] Fill required vars: `TWENTY_IMAGE`, `SERVER_URL`, `PUBLIC_BASE_URL`, `APP_SECRET`, `PG_DATABASE_PASSWORD`.

#### Day 2: First Production Deploy

- [x] Provision EC2 t3.small (Ubuntu 22.04) + RDS PostgreSQL 15.12.
- [x] Install Docker + Compose plugin on EC2.
- [x] Configure RDS security group (port 5432 from EC2 SG only).
- [x] Run deploy with `docker-compose.aws.yml` overlay (skips local db).
- [x] Verify `docker compose ps` healthy and `http://localhost:3000/healthz` returns 200.

#### Day 3: Stable Public Ingress

- [x] Install Caddy on EC2 with wildcard (`*.fusegtm.com`) reverse proxy and on-demand TLS.
- [x] Add DNS records in Hostinger: `app.fusegtm.com` + `*.fusegtm.com` → `52.20.136.71`.
- [x] Verify `https://app.fusegtm.com/healthz` returns 200 with auto-provisioned TLS.
- [x] Harden SG: close port 3000 public, restrict SSH to founder IP.
- [x] RDS SSL trust via `NODE_EXTRA_CA_CERTS` (proper CA bundle, not `NODE_TLS_REJECT_UNAUTHORIZED=0`).

#### Day 4: Commercial and Legal Closure

- [x] Activate Organization Self-Hosted plan.
- [x] Confirm legal sufficiency from public docs + billing screenshot proof.
- [x] Document commercial/license position in writing.
- [x] Record where legal confirmation is stored.

#### Day 5: OAuth

- [x] Create Google OAuth app + callbacks.
- [x] Set Google auth env vars in host env file (`packages/twenty-docker/.env`).
- [x] Run OAuth readiness check script (`CHECK_PROVIDERS=google`).
- [x] Restart stack and verify Google OAuth flow end-to-end.
- [x] Defer Microsoft OAuth to post-Phase-1 unless customer demand requires it.

#### Day 6: Deploy/Rollback Drill

- [x] Deploy current tag (A).
- [x] Create and push next tag (B).
- [x] Run drill for A -> B -> A.
- [x] Record exact commands, timestamps, and total recovery time (log in `docs/ops-logs/`).

#### Day 7: Soak Gate

- [ ] Run 24h health checks (local + public).
- [ ] Confirm no URL rotation and no tunnel interstitial.
- [ ] Confirm no auth regressions.
- [ ] Fill 7-day log template (`docs/fuse-phase1-soak-log-template.md`).
- [ ] Mark Phase 1 gate passed.

## Phase 2 (Week 2): Partner Data Model Activation

Parallel rule:

1. Phase 2 may run while Phase 1 soak continues.
2. FUSE-200 must pass before FUSE-201..205 production mutation windows start.
3. Any Sev-1 pauses new production mutations until recovery is confirmed.

| Issue | Title | Priority | Owner | Status | Definition of Done |
|---|---|---|---|---|---|
| FUSE-200 | YC/Apple reference baseline parity | P0 | Dhruv | IN_PROGRESS | Sidebar, page layout, AI agents, AI chat, and admin-panel-settings capability parity documented and accepted before Fuse-specific opinionation |
| FUSE-201 | Run bootstrap + verify 16 objects | P0 | Dhruv | TODO | All 16 Partner OS objects and relations visible; bootstrap idempotency and expected views verified |
| FUSE-202 | Schema freeze review | P0 | Dhruv | TODO | MVP schema locked and documented |
| FUSE-203 | Configure opinionated views | P0 | Dhruv | TODO | Default table/kanban/filter views saved |
| FUSE-204 | Seed sample records | P1 | Dhruv | TODO | Demo paths work without manual data entry |
| FUSE-205 | Terminology audit | P1 | Dhruv | TODO | UI uses retrieval checks/fit signals/gates/evidence |
| FUSE-206 | Cherry-pick Linaria migration | P1 | Codex | TODO | `git cherry-pick 1db2a409` clean, `nx build twenty-ui && nx build twenty-front` pass. Must land before FUSE-502 |

### FUSE-200 Merge Contract (Mandatory)

Use this for reference parity work before any Fuse-specific opinionation.

1. Work only on branch `integration/reference-parity`.
2. Ship one parity slice per PR: `sidebar`, `page-layout`, `agents`, `chat`, `admin-panel-settings`.
3. Treat workspace DB state as non-mergeable:
   - if state-only, codify reproducible setup steps/scripts and commit them.
4. Merge only if all checks pass:
   - `yc.localhost` parity PASS
   - `apple.localhost` parity PASS
   - deployed env parity PASS (`app.fusegtm.com`)
   - for `sidebar`, core editability + persistence PASS (reorder, color, add/remove)
   - for `admin-panel-settings`, low-risk write-and-revert validation PASS
   - no regressions in auth, deploy/health, or multi-workspace routing
5. Log evidence in `docs/ops-logs/fuse-phase2-reference-baseline-<timestamp>.md`.
6. If any check fails, keep PR open and do not proceed to FUSE-201+.

### Phase 2 Execution Assets

Use these to keep Phase 2 reproducible:

1. Pre-window gate helper:
   - `packages/twenty-docker/scripts/fuse-phase2-precheck.sh --ack-no-sev1`
2. Evidence templates:
   - `docs/ops-logs/templates/fuse-phase2-reference-baseline-template.md`
   - `docs/ops-logs/templates/fuse-phase2-reference-slice-admin-panel-template.md`
   - `docs/ops-logs/templates/fuse-phase2-bootstrap-template.md`
   - `docs/ops-logs/templates/fuse-phase2-schema-freeze-template.md`
   - `docs/ops-logs/templates/fuse-phase2-views-template.md`
   - `docs/ops-logs/templates/fuse-phase2-seed-template.md`
   - `docs/ops-logs/templates/fuse-phase2-terminology-template.md`
   - `docs/ops-logs/templates/fuse-phase2-fuse-206-checkpoint-template.md`
   - `docs/ops-logs/templates/fuse-phase2-closeout-template.md`

## Phase 3 (Weeks 3-5): Workflow Delivery

| Issue | Title | Priority | Owner | Status | Definition of Done |
|---|---|---|---|---|---|
| FUSE-301 | Register Exa webhook endpoint | P0 | Dhruv | TODO | Test events received and verified |
| FUSE-302 | Discovery initiation workflow | P0 | Dhruv | TODO | Run creates Exa webset and marks run streaming |
| FUSE-303 | Discovery ingestion workflow | P0 | Dhruv | TODO | Candidates/evaluations created from webhook events |
| FUSE-304 | Discovery completion scoring workflow | P0 | Dhruv | TODO | Fit score/confidence/gates computed and saved |
| FUSE-305 | Reconciliation workflow | P1 | Dhruv | TODO | Missing items backfilled when mismatch detected |
| FUSE-306 | Verify SSE real-time streaming | P0 | Dhruv | TODO | Candidates appear without page refresh |
| FUSE-307 | Co-sell/referral handoff workflow | P0 | Dhruv | TODO | Stage movement creates/updates lead + attribution event |
| FUSE-308 | Stale handoff reminder workflow | P1 | Dhruv | TODO | Daily reminder runs for stale maps |
| FUSE-309 | Duplicate map prevention | P0 | Dhruv | TODO | No duplicate active map tuple possible |
| FUSE-310 | Transcript insights workflow | P0 | Dhruv | TODO | Upload transcript -> profile insights + tasks |

## Phase 4 (Week 5): Reports

| Issue | Title | Priority | Owner | Status | Definition of Done |
|---|---|---|---|---|---|
| FUSE-401 | Partner pipeline report | P0 | Dhruv | TODO | Dashboard query supports weekly review |
| FUSE-402 | Discovery funnel metrics | P1 | Dhruv | TODO | Funnel conversion metrics visible by play |

## Phase 5 (Weeks 5-6): Rebrand + Onboarding

| Issue | Title | Priority | Owner | Status | Definition of Done |
|---|---|---|---|---|---|
| FUSE-501 | Replace customer-facing "Twenty" copy with "Fuse" | P0 | Dhruv | TODO | Branded UI in customer-facing surfaces |
| FUSE-502 | Theme pass (Linaria + Figma tokens) | P1 | Dhruv | TODO | Cherry-pick Linaria (`1db2a409`), define brand tokens in Figma (`SPb7b3wG9ZcFt0oy3nLQbi`), override `--t-xxx` CSS vars, verify in Storybook. See `docs/fuse-design-system-token-map.md` |
| FUSE-503 | Sidebar defaults for partner team | P1 | Dhruv | TODO | Nav order and defaults reflect partner workflows |
| FUSE-504 | Onboarding intake revision | P1 | Dhruv | TODO | New onboarding captures partner context |

## Phase 6 (Week 6): Hardening + Launch

| Issue | Title | Priority | Owner | Status | Definition of Done | Evidence |
|---|---|---|---|---|---|---|
| FUSE-601 | Ingress security (TLS allowlist) | P0 | Dhruv | DONE | Caddy `ask` endpoint validates workspace domains; rejects reserved/invalid subdomains | Operator-reported live with wildcard TLS ask flow active on EC2 (2026-03-02) |
| FUSE-602 | Backup restore drill | P0 | Dhruv | DONE | RDS PITR tested end-to-end with evidence | Operator reported restore drill path is ready, with EC2 IAM role scoped for restore-drill instances (`fuse-rds-restore-drill`) and script `fuse-backup-restore-drill.sh` ready (2026-03-02) |
| FUSE-603 | Deploy + incident runbook | P0 | Dhruv | DONE | Runbook executable by a new operator | `docs/fuse-deploy-incident-runbook.md` completed and aligned to AWS/Caddy stack (2026-03-02) |
| FUSE-604 | Alerting + operational visibility | P0 | Dhruv | DONE | SNS topic + CloudWatch alarms + health metric publisher | SNS topic `fuse-prod-alerts` + confirmed email subscription + 4 CloudWatch alarms (`fuse-ec2-status-check`, `fuse-rds-low-storage`, `fuse-rds-high-cpu`, `fuse-app-health-check`) + per-minute health metric cron live (2026-03-02) |
| FUSE-605 | Runtime watchdog (Caddy) | P1 | Dhruv | DONE | Watchdog restarts Caddy on public failure, server on local failure | EC2 cron every 5 minutes for watchdog is live; public/local recovery loop enabled (2026-03-02) |
| FUSE-606 | Launch gate review | P0 | Dhruv | TODO | Evidence-based go-live sign-off |
| FUSE-607 | Runtime reliability hardening (cron startup decoupling + MCP bootstrap resilience) | P0 | Codex | IN_PROGRESS | Startup remains healthy when cron registration is slow/failing; deploy runs post-health cron registration non-fatally; MCP bootstrap is idempotent/retry-safe/resumable with structured output | Acceptance evidence: `docs/ops-logs/fuse-runtime-outage-remediation-<timestamp>.md`, `docs/ops-logs/fuse-runtime-restart-drill-<timestamp>.md`, `docs/ops-logs/fuse-mcp-bootstrap-hardening-<timestamp>.md` |

## Blockers Log

| Date | Issue | Blocker | Owner | Next action |
|---|---|---|---|---|
| 2026-03-01 | FUSE-102 | RESOLVED — replaced Cloudflare tunnel with Caddy + Let's Encrypt on EC2. | Dhruv | n/a |
| 2026-03-01 | FUSE-105 | RESOLVED — Google OAuth live on `app.fusegtm.com` with multi-workspace routing aligned (`DEFAULT_SUBDOMAIN=app`). | Dhruv | n/a |
| 2026-03-02 | FUSE-200 | BLOCKED — production capability preconditions were unblocked (navigation/AI/layout feature flags seeded and server+worker restarted), but required production evidence for sidebar persistence and slices 2-4 is still incomplete. | Dhruv | Complete production sidebar capability checks (reorder/color/add-remove + persistence), close slices 2-4 with production evidence, then re-evaluate FUSE-200 gate. |
| 2026-03-02 | FUSE-201 | BLOCKED — FUSE-200 parity gate not yet PASS (by policy, no production mutation before FUSE-200 close). | Dhruv | Complete remaining FUSE-200 slices and mark explicit PASS in reference baseline log only when all 5 slices are green. |

## Change Log

| Date | Update | By |
|---|---|---|
| 2026-03-01 | Created execution tracker from architecture v2 | Codex |
| 2026-03-01 | Added FUSE-206 (Linaria cherry-pick), updated FUSE-502 with Figma/token map refs, added source docs | Codex |
| 2026-03-01 | Marked FUSE-101..107 IN_PROGRESS and started implementation work | Codex |
| 2026-03-01 | Began FUSE-101 execution evidence: preflight passed in local mode | Codex |
| 2026-03-01 | Executed pinned deploy (`partner-os-45e979039d`), added watchdog cron, wired OAuth env passthrough, validated compose/container env | Codex |
| 2026-03-01 | AWS production deploy: EC2 + RDS + Caddy + Let's Encrypt. FUSE-101 and FUSE-102 DONE. SG hardened, RDS CA bundle mounted, deploy guard added. Replaced all Cloudflare refs with AWS/Caddy reality. | Claude |
| 2026-03-01 | FUSE-103 and FUSE-104 DONE. Organization Self-Hosted plan active on fusegtm.twenty.com. License baseline documented in `docs/fuse-license-baseline.md`. | Claude |
| 2026-03-01 | Removed support-ticket confirmation as a Phase 1 gate. Legal acceptance is now based on public Twenty docs plus Organization plan screenshot evidence. | Codex |
| 2026-03-01 | Added Phase 1 closeout artifacts: OAuth readiness script, deploy/rollback drill script, identity migration note, soak log template, and closeout runbook. Marked FUSE-108 DONE. | Codex |
| 2026-03-01 | Switched Phase 1 auth gate to Google-first based on ICP. Microsoft OAuth explicitly deferred and removed as a blocking criterion. | Codex |
| 2026-03-01 | Fixed `app.app.fusegtm.com` redirect by aligning domain config (`SERVER_URL=https://app.fusegtm.com`, `FRONTEND_URL=https://fusegtm.com`, `IS_MULTIWORKSPACE_ENABLED=true`, `DEFAULT_SUBDOMAIN=app`), redeployed production, completed Google OAuth verification, and closed FUSE-105. | Codex |
| 2026-03-01 | Created second image tag `partner-os-7c718a54`, ran deploy/rollback drill A -> B -> A, and logged recovery time (`108s`) in `docs/ops-logs/fuse-deploy-rollback-20260301T232933Z.md`. Closed FUSE-106. | Codex |
| 2026-03-01 | Started 7-day soak log at `docs/ops-logs/fuse-phase1-soak-2026-03-01.md` with Day 1 health/auth evidence. | Codex |
| 2026-03-02 | Added automated daily soak checker (`packages/twenty-docker/scripts/fuse-soak-check.sh`) and logged Day 1 automated evidence in `docs/ops-logs/fuse-soak-check-20260302T004415Z.md` (public/local health, Google OAuth redirect, worker activity all PASS). | Codex |
| 2026-03-02 | Normalized ingress to one wildcard Caddy block (`*.fusegtm.com`) with on-demand TLS + ask endpoint; removed mixed explicit/wildcard block behavior that caused intermittent TLS failure on `app.fusegtm.com`. | Codex |
| 2026-03-02 | Added a decision-complete Phase 2 activation runbook (`docs/fuse-phase2-data-model-runbook.md`) covering FUSE-201..206 with exact execution order, commands, evidence artifacts, and closeout criteria. | Codex |
| 2026-03-02 | Added FUSE-200 as a hard pre-gate for Phase 2: YC/Apple baseline parity (sidebar, page layout, AI agents, AI chat) must pass before Fuse-specific opinionation. | Codex |
| 2026-03-02 | Added FUSE-200 branch+merge execution contract to both tracker and runbook: `integration/reference-parity` branch, one-slice PRs, explicit localhost+deployed parity checks, and evidence log requirement before Phase 2 opinionation. | Codex |
| 2026-03-02 | Added Phase 2 implementation assets: pre-window precheck script (`fuse-phase2-precheck.sh`), evidence templates in `docs/ops-logs/templates/`, and ops-log README updates so FUSE-200..206 can run with consistent artifacts. | Codex |
| 2026-03-02 | Began FUSE-200 execution on branch `integration/reference-parity`: ran pre-window gate (`fuse-phase2-precheck.sh --ack-no-sev1`), created baseline parity artifact `docs/ops-logs/fuse-phase2-reference-baseline-20260302T040351Z.md`, and opened first slice artifact `docs/ops-logs/fuse-phase2-reference-slice-sidebar-20260302T040351Z.md`. | Codex |
| 2026-03-02 | Automated sidebar parity capture for YC and Apple (JSON + screenshot + snapshot artifacts), captured current production sidebar/auth state, and updated FUSE-200 baseline/slice logs with evidence paths and a production-auth blocker. | Codex |
| 2026-03-02 | Fixed production workspace TLS/auth redirect failure for `fusegtm.fusegtm.com` by correcting Caddy on-demand TLS ask URL (use `ask http://127.0.0.1:9080/allow`, no placeholders). Verified `https://fusegtm.fusegtm.com/healthz` returns 200 and cert issuance succeeds. | Codex |
| 2026-03-02 | Captured authenticated production sidebar and settings/admin-panel evidence; updated FUSE-200 blocker from auth failure to parity gap (production nav has 7 items, missing Partner OS navigation compared with YC/Apple references). | Codex |
| 2026-03-02 | Expanded FUSE-200 to a five-slice gate by adding `admin-panel-settings` parity (YC/Apple/production) and required write-and-revert validation before unblocking FUSE-201..205. | Codex |
| 2026-03-02 | Executed production `admin-panel-settings` write-and-revert test on `Automatically enable new models` (`true -> false -> true`), captured fresh AI-tab evidence, passed post-checks (phase2 precheck, Google OAuth redirect, workspace routing), and marked slice 5 PASS in baseline/slice logs. | Codex |
| 2026-03-02 | Implemented idempotent Partner OS sidebar backfill in `workspace:bootstrap:partner-os` by extending `PartnerOsMetadataBootstrapService` to create missing workspace-level navigation menu items for existing Partner OS objects (plus runbook/evidence updates for Slice 1 recovery). | Codex |
| 2026-03-02 | Revised Phase 2 gate semantics: `FUSE-200 sidebar` now evaluates editability capability parity (not object-list parity), and Partner OS object inventory enforcement is explicitly moved to `FUSE-201`. | Codex |
| 2026-03-02 | Applied capability-first parity contract across runbook/tracker/baseline artifacts (sidebar = editability+persistence gate), updated sidebar slice checklist, refreshed baseline matrix parity-type labeling, and re-ran phase2 precheck PASS at `2026-03-02T06:47:56Z`. | Codex |
| 2026-03-02 | Operator seeded four production feature flags (including `IS_NAVIGATION_MENU_ITEM_ENABLED` and `IS_NAVIGATION_MENU_ITEM_EDITING_ENABLED`) and restarted server+worker so flag cache reloaded; runtime capability availability for sidebar editing, AI chat/agents, and page layout beta is now confirmed on `app.fusegtm.com`. | Codex |
| 2026-03-02 | Phase 1 Closeout + Launch Hardening scripts: TLS allowlist service (`fuse-caddy-ask-server.py`, `install-caddy-ask-service.sh`), watchdog rewrite (Caddy replaces Cloudflare), alerting (`fuse-setup-alerting.sh`, `fuse-publish-health-metric.sh`), backup drill (`fuse-backup-restore-drill.sh`), incident runbook (`docs/fuse-deploy-incident-runbook.md`). FUSE-601..605 IN_PROGRESS. | Claude |
| 2026-03-02 | Operator reported hardening stack live: EC2 IAM role (`fuse-prod-ec2`) attached, SNS topic+subscription confirmed, four CloudWatch alarms active, watchdog cron (`*/5`) and health metric cron (`* * * * *`) running. Updated FUSE-601..605 to DONE; only launch/soak gates remain. | Codex |
| 2026-03-02 | Started FUSE-607 reliability hardening: added startup timeout guard around cron registration, per-command timeout in `cron:register:all`, deploy post-health one-shot cron registration (non-fatal), low-memory preflight warning, and MCP bootstrap hardening (env-first token, retries+jitter, pagination, checkpoint/resume, JSON output, semantic select colors). | Codex |
| 2026-03-02 | Implemented sovereignty hardening defaults and outbound guards: env-only critical config (`IS_CONFIG_VARIABLES_IN_DB_ENABLED=false`, telemetry/icons/enrichment/help-center/marketplace/version-check controls), signup+record icon gating, company enrichment default-off, AI telemetry env gate, marketplace/version remote-call gates, help-center tool gating/removal from preloaded tools, strict deploy preflight assertions, and tenant lifecycle ops scripts (`fuse-tenant-bootstrap.sh`, `fuse-workspace-creation-report.sh`). | Codex |
