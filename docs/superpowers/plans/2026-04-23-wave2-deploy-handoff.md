# Wave 2 deploy handoff — deploy execution (2026-04-23)

Paste this at the top of a fresh chat. You are the next deploy-executor for Fuse. Everything you need to act is in this doc or linked from it. Do not re-derive decisions already made — the docs are the source of truth.

---

## Role + mission

You are the **deploy-executor of Fuse** — act as CTO for infra changes, with founder authorization.

- **Product in one sentence:** Fuse is a partnerships-native CRM, a sovereign fork of Twenty CRM v1.18.1 with custom `partner-os` module.
- **Founder:** Dhruv Raina (`dhruv@fusegtm.com`) — terse, decisive, solo-founder cadence. Do not ask for approval on routine tactical decisions; surface only real architectural forks or destructive production actions.
- **Phase:** wave 2 upstream sync **merged**; wave 2.5 SDK refactor **merged**; deploy pending. 16 PRs merged this session, 384 upstream cherry-picks on main.
- **Hard constraints:**
  - **Sovereignty** — no outbound egress to `twenty.com` / `twentyhq` beyond the already-accepted admin-UI billing fetches. Enforced at `packages/twenty-server/src/engine/core-modules/enterprise/services/enterprise-plan.service.ts` (3 live methods, 2 hard-stubbed); partner-os module never touched; ClickHouse explicitly rejected.
  - **Partner-OS preservation** — `packages/twenty-server/src/modules/partner-os/` must diff 0 lines against pre-wave state. Verified through all 4 sub-waves + 2.5.
  - **Branded files stay Fuse** — 7 files in `docs/fuse-branding-followups.md`; MD5 verified unchanged through wave 2.5.
  - **`IS_PARTNER_OS_ENABLED` preserved** in `packages/twenty-shared/src/types/FeatureFlagKey.ts:16`. Gates partner-os onboarding. Never remove.
  - **Never `--no-verify`**, never `git push --force` on main, never bypass signing hooks.

---

## Working directory + project IDs

```
Repo:          https://github.com/fuse-gtm/fuse-v1.git
Local clone:   ~/fuse-platform (or wherever you keep it)
Main branch:   main @ 8f8addb7d0 (Merge PR #30 wave 2.5 SDK; 384 cherry-picks since wave-1 base 4583bd0af7)
Base branch:   main — no branch protection, admin-merge available
Worktrees:     many under /private/tmp/ and ~/.codex/ from prior codex sessions — all prunable; ignore
```

| Key | Value |
|---|---|
| Prod host | EC2 `i-05b90467e22fec9d2` @ `52.20.136.71` (`app.fusegtm.com`) |
| Prod workspace ID | `06e070b2-80eb-4097-8813-8d2ebe632108` |
| Image registry | `ghcr.io/fuse-gtm/fuse-v1` |
| Image tag format | `partner-os-<short-sha>` (immutable) |
| Reverse proxy | Caddy (systemd) |
| Node / runtime | **24.5.0** (`.nvmrc`, `package.json` engines) |
| GitHub repo | `fuse-gtm/fuse-v1` — always pass `--repo fuse-gtm/fuse-v1` to `gh` (otherwise infers `twentyhq/twenty` from the `upstream` remote) |

---

## Required reading (precedence order)

1. `docs/ops-logs/2026-04-23-wave2-deploy-commands.md` — **the paste-ready deploy**. Phase 0 → Phase 4. Everything you need to execute is here.
2. `docs/ops-logs/2026-04-23-wave2-followup-index.md` — all 32 open items, 2 P0s, 8 P1s, 13 P2s, 5 carried-to-wave-3, 4 pending decisions. Read top-to-bottom before deploy — may add runbook steps.
3. `docs/ops-logs/2026-04-23-wave2-deploy-readiness.md` — full SPEC-004-aligned pre-flight, rollback plan, validation checklist.
4. `docs/superpowers/plans/2026-04-24-apollo-activation.md` — Phase 4 of deploy (post-deploy Apollo activation).
5. `docs/ops-logs/2026-04-23-wave2-closeout.md` — full-repo state report; answers "did CI go green on each wave?".
6. `docs/agent-specs/SPEC-001-upstream-cherry-picks.md` — sovereignty charter + "Recurring Triage Footguns" (important for any future upstream touch).
7. `docs/agent-specs/SPEC-004-deploy-runbook.md` — canonical deploy procedure (deploy-commands.md is its execution-ready form).
8. `docs/fuse-upstream-patch-ledger.md` — closed-out ledger. Reference only; don't modify unless you start a new sync wave.

If docs disagree with reality, reality wins — re-verify with `git log` + `gh pr list` + `gh run list` and document the drift in a new ops-log entry.

---

## What's shipped this session (16 PRs, all merged)

| PR | Title | Notes |
|---|---|---|
| #15 | Upstream wave 2A — security cherry-picks | 18 of 23; 5 skipped to `wave2a-skipped-followup.md` |
| #16 | Wave 2 upstream sync — planning + triage docs | Plan + ledger + baseline + preflight |
| #17 | Upstream wave 2B — backend bugfixes + perf | 227 of 231 + application-logs P1 surgical fix |
| #18 | docs: stage wave 2C executor prompt | Staged prompt (later used) |
| #19 | fix(front): repair FuseDesignScorecard Linaria regression (R1) | Pre-existing main CI red, unblocked wave 2C |
| #20 | Upstream wave 2C — frontend bugfixes | 125 of 126 + billing P1 re-fix for ApplicationLogsService recurrence |
| #21 | docs(branding): log wave 2C nits + auth-cookie note | 3 non-blocker nits folded in |
| #22 | Upstream wave 2D — flags + RBAC rebase | 11 of 16; 4 flags removed, IS_PARTNER_OS_ENABLED preserved |
| #23 | docs(plans): Apollo enrichment activation runbook | Wave 3 scope |
| #24 | docs(sync): wave 2 closeout — ledger + full-repo state | New-SHA mapping, CI status, invariants |
| #25 | docs(ops): wave 2 followup index — 32 items, yarn.lock P0 | Consolidated priority-sorted backlog |
| #26 | docs(specs): SPEC-001 + SPEC-002 post-wave-2 refresh | Recurring triage footguns added |
| #27 | docs(ops): wave 2 deploy readiness brief | Pre-flight + rollback |
| #29 | docs: codify 4 post-wave-2 decisions (Q1-Q4) | SDK-take-now, admin-panel-keep-deleted, massive-refactor-defer, stale-flag-on-deploy |
| #30 | Upstream wave 2.5 — SDK refactor (founder-scoped) | 3 of 3 + duplicate hello-world cleanup; 6/6 invariants PASS |
| #31 | docs(ops): paste-ready deploy commands for wave 2 + wave 2.5 | The file you execute |

---

## Known concerns that must be folded into your work

### K-1 (P0, blocking deploy) — yarn.lock drift on main
**Symptom:** CI `server-build`, `server-lint-typecheck`, `sdk-test`, `ui-task (test)` fail with `YN0028: lockfile would be modified`.
**Where:** `yarn.lock` vs `packages/{create-twenty-app,twenty-client-sdk,twenty-front,twenty-sdk,twenty-server}/package.json` post wave 2D + 2.5 cherry-picks.
**Fix:** Phase 0 of the deploy runbook. `nvm use 24.5.0 && yarn install && commit yarn.lock && push`. Then re-verify CI.

### K-2 (P0, pre-deploy) — `TRUST_PROXY=1` must be set in prod `.env`
**Symptom:** wave 2A's `oauth-discovery.controller.ts` derives issuer URL from `request.get('host')`; without proxy-trust, Host header is spoofable → attacker can publish URLs at OAuth well-known endpoints.
**Where:** `packages/twenty-docker/.env` on EC2 host. `.env.fuse-prod.example` already has it; prod may not.
**Fix:** Phase 2 of deploy runbook — grep + append if missing, then `docker compose restart twenty-server`.

### K-3 (P1, deferred) — admin-UI enterprise fetches still phone home
**Symptom:** `enterprise-plan.service.ts` `getSubscriptionStatus`/`getPortalUrl`/`getCheckoutUrl` call `https://twenty.com/api/enterprise/*` when admin loads the Enterprise settings page. Founder has accepted this as-is because Fuse holds a real signed Twenty enterprise key and the calls are legitimate subscription management.
**Where:** `packages/twenty-server/src/engine/core-modules/enterprise/services/enterprise-plan.service.ts:235,291,342`.
**Fix:** none this deploy. If twenty.com becomes flaky, Option B in `wave2a-watch-items.md §Concern #1` adds `AbortController` timeouts. No code change required.

### K-4 (P1, note only) — 4 feature flags removed by wave 2D leave orphan DB rows
**Symptom:** `IS_DRAFT_EMAIL_ENABLED`, `IS_USAGE_ANALYTICS_ENABLED`, `IS_RECORD_TABLE_WIDGET_ENABLED`, `IS_AI_ENABLED` removed from enum; rows in `core."featureFlag"` tolerated by TypeORM but worth cleaning.
**Where:** prod Postgres `core."featureFlag"` table.
**Fix:** Phase 2 of deploy runbook — `DELETE` SQL executes in the same SSH session as the docker compose pull.

### K-5 (P2, future) — 3 massive-refactor defers (ledger-tagged)
- `b11f77df2a` #18319 — 349-file command-menu conditional-availability refactor
- `cee4cf6452` #18784 — 149-file ConnectedAccount metadata schema migration
- `d5a7dec117` #18830 — 440-file ObjectMetadataItem rename
Per founder decision 2026-04-23, each needs a dedicated sub-wave. Low urgency, no partner-os or Apollo dependency. Reclassified to `defer` in the ledger.

### K-6 (P2, future) — SDK scaffolding templates have twentyhq/twenty brand drift
`create-twenty-app` template scaffolds a CI workflow pulling `twentyhq/twenty/.github/actions/spawn-twenty-docker-image@main`. Not runtime egress — only bites users who run the scaffolder. Track as future fork-branding task.

### K-7 (noise only) — dangling worktrees under `/private/tmp/` and `~/.codex/`
Prior codex sessions left ~25 worktrees. All prunable (`git worktree prune`). Do not touch unless doing housekeeping.

---

## Remaining work (dependency order)

**Ready (no blockers):**

1. **Deploy execution** — walk `docs/ops-logs/2026-04-23-wave2-deploy-commands.md` top-to-bottom. Phases 0–3 land wave 2 + 2.5 on prod. Phase 4 (Apollo) is optional.
2. **Validate deploy** — Phase 3 soak (60 min). Confirm: no `5xx` errors, no new egress to twenty.com outside the 3 accepted enterprise-UI methods, memory stable.
3. **Post-deploy MEMORY.md update** — append wave 2 + 2.5 deploy timestamp + image tag to `~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/MEMORY.md` Completed Work section.

**Blocked on deploy success:**

4. **Apollo activation** — follow `docs/superpowers/plans/2026-04-24-apollo-activation.md` if founder greenlights. 6 steps, ~30 minutes including OAuth portal setup.
5. **Orphan-flag DELETE verification** — after Phase 2 SQL, verify row count hit zero via the Postgres MCP.

**Future (not this session):**

6. **Massive-refactor sub-waves** (K-5) when scoped — each commit gets its own plan + executor + verifier dispatch following the pattern documented in `docs/superpowers/plans/2026-04-23-upstream-sync-wave-2.md`.
7. **SDK scaffolding brand surface** (K-6) if Fuse publishes/promotes the scaffolder externally.
8. **Un-forking evaluation** — post-Apollo, re-evaluate whether to stop tracking upstream (discussed mid-session; deferred to post-wave-3).

---

## Execution protocol

Solo-founder cadence. You have full tool access: `yarn install`, `docker buildx`, `ssh`, `gh` API. Run the deploy commands directly from the repo/worktree.

**Workflow for the deploy itself:** read `docs/ops-logs/2026-04-23-wave2-deploy-commands.md`. Execute Phase 0 → Phase 1 → Phase 2 → Phase 3. Phase 4 (Apollo) on founder greenlight only.

**Workflow if something breaks:** the deploy doc has a rollback block. Execute it. Open an ops-log entry at `docs/ops-logs/YYYY-MM-DD-wave2-deploy-rollback.md` capturing: failed validation step, log excerpts, rollback image tag, whether the issue is on main (needs fix-PR) or runbook-specific.

**Protocol bugs observed this session:**

- `gh pr create` / `gh pr merge` without `--repo fuse-gtm/fuse-v1` will infer `twentyhq/twenty` from the upstream remote and fail with 401 or wrong-repo errors. Always pass `--repo` explicitly.
- Subagents share git working-tree state. If you dispatch a background agent that checks out a branch, your foreground `git checkout` will clobber its state. Use `git worktree add /tmp/<name>` for orthogonal work.
- `yarn install` from the main worktree needs Node 24.5.0 — use `nvm use 24.5.0` first. Peer-dependency warnings are normal (`YN0002`); the failure signature is `YN0028`.

---

## Skills-per-task matrix

| Task | Skill | Why |
|---|---|---|
| Execute deploy runbook | — (no skill needed) | Doc is paste-ready; no decisions to make |
| Handle rollback | `superpowers:systematic-debugging` | Scientific method for diagnosing breakage |
| Apollo activation | `operations:runbook` (if available) or read the runbook doc | 6 sequential steps, most user-UI |
| MEMORY.md update | `claude-md-management:revise-claude-md` | Structured memory editing pattern |
| If new regression surfaces on main | `superpowers:verification-before-completion` + `superpowers:test-driven-development` | Reproduce before fixing |
| If founder opens a new sync wave (wave 2.5.x, wave 3) | `superpowers:writing-plans` + `multi-agent-orchestration` + `superpowers:subagent-driven-development` | Same pattern as wave 2 |
| If any doc seems stale mid-task | `session-handoff` receiver checklist | Force a sync commit before proceeding |

Don't spam skills. The deploy is mostly mechanical — the doc is the contract. Invoke skills only when a decision surfaces.

---

## Immediate next action (4 steps)

1. **Sync the receiver checklist** — run `git fetch origin && git log origin/main --oneline | head -3` to confirm HEAD is `8f8addb7d0`. Confirm `docs/ops-logs/2026-04-23-wave2-deploy-commands.md` exists. If either mismatches, do not proceed — investigate drift first.

2. **Run Phase 0 of the deploy runbook** (yarn install + push yarn.lock). One command block in the doc. Wait for CI green on the resulting commit (should take ~10 min).

3. **Run Phase 1 + Phase 2** (buildx + push + SSH + TRUST_PROXY + compose pull + migrate + stale-flag DELETE). Single SSH heredoc in the doc.

4. **Smoke + soak** — Phase 3 external curl + sign-in + 60-min soak. Report results back to founder. If green, suggest Phase 4 Apollo activation. If red, execute rollback block and open the ops-log-rollback doc.

Do not ask the founder "should I deploy?" — they have authorized it. Only ask if you hit a destructive decision point (data migration that can't roll back, env var change affecting auth, etc.).

---

## Session context carried forward

- Founder explicitly rejected i18n-bulk wave (94 commits).
- Founder decided SDK refactor ships now, not later, because solo-founder sync cadence doesn't justify deferring.
- Founder accepted the 3 live `enterprise-plan.service.ts` fetches as-is (real enterprise key in prod, admin-UI-only calls).
- Founder considered unforking from Twenty mid-session; deferred to post-wave-3 re-evaluation.
- `TRUST_PROXY` on prod `.env`: status unknown to prior agent (sandbox blocked SSH). Confirm + fix in Phase 2.
- The paste-ready deploy runbook deliberately avoids presuming sandbox limitations — it's written as "open a terminal and paste". You can execute it directly.

End of handoff. Execute Phase 0 first.
