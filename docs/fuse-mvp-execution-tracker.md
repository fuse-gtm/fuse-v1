# Fuse MVP Execution Tracker

This is the working file.

Use this to run execution day by day.
Do not treat this as strategy. Treat it as operations.

Source documents:
- `docs/fuse-mvp-architecture-plan-v2.md` — architecture plan
- `docs/fuse-design-system-token-map.md` — Figma↔Code token mapping for FUSE-502
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

| Issue | Title | Priority | Owner | Status | Definition of Done |
|---|---|---|---|---|---|
| FUSE-201 | Run bootstrap + verify 16 objects | P0 | Dhruv | TODO | All objects and relations visible in workspace |
| FUSE-202 | Schema freeze review | P0 | Dhruv | TODO | MVP schema locked and documented |
| FUSE-203 | Configure opinionated views | P0 | Dhruv | TODO | Default table/kanban/filter views saved |
| FUSE-204 | Seed sample records | P1 | Dhruv | TODO | Demo paths work without manual data entry |
| FUSE-205 | Terminology audit | P1 | Dhruv | TODO | UI uses retrieval checks/fit signals/gates/evidence |
| FUSE-206 | Cherry-pick Linaria migration | P1 | Codex | TODO | `git cherry-pick 1db2a409` clean, `nx build twenty-ui && nx build twenty-front` pass. Must land before FUSE-502 |

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

| Issue | Title | Priority | Owner | Status | Definition of Done |
|---|---|---|---|---|---|
| FUSE-601 | Smoke test suite | P0 | Dhruv | TODO | All core flows pass on staging |
| FUSE-602 | Backup baseline | P0 | Dhruv | TODO | Automated backup + tested restore |
| FUSE-603 | Deploy + incident runbook | P0 | Dhruv | TODO | Runbook executable by a new operator |
| FUSE-604 | Launch gate review | P0 | Dhruv | TODO | Evidence-based go-live sign-off |

## Blockers Log

| Date | Issue | Blocker | Owner | Next action |
|---|---|---|---|---|
| 2026-03-01 | FUSE-102 | RESOLVED — replaced Cloudflare tunnel with Caddy + Let's Encrypt on EC2. | Dhruv | n/a |
| 2026-03-01 | FUSE-105 | RESOLVED — Google OAuth live on `app.fusegtm.com` with multi-workspace routing aligned (`DEFAULT_SUBDOMAIN=app`). | Dhruv | n/a |

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
