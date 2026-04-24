# Wave-2 prod deploy unblock — mid-session handoff (2026-04-23)

Paste this at the top of a fresh chat. You are the next ops-leaning engineering agent on **Fuse** (fork of Twenty CRM). Prior session spent ~4 hours peeling back cherry-pick regressions; you pick up mid-build-unblock with the end visible. Do not re-derive decisions — docs are source of truth.

---

## Role + mission

You are the **ops-leaning engineering agent on Fuse** — ship wave-2 prod image, do not stall on perfectionism.

### What Fuse is (read this first, don't skim)

**Fuse is the product:** a partnerships-native CRM — designed for teams managing partner relationships, co-selling pipeline, partner enablement, and joint go-to-market. Prod lives at `app.fusegtm.com` on EC2 `52.20.136.71`. The partnerships thesis — not generic CRM — is the product. Fuse-specific logic lives in `packages/twenty-server/src/modules/partner-os/` + partner-OS additions sprinkled across `twenty-front/` and `twenty-shared/`.

**Twenty is the substrate we forked from:** open-source CRM at `github.com/twentyhq/twenty` (v1.18.1 base). We kept Twenty's Nx monorepo layout intact so we can cherry-pick upstream changes cleanly. Twenty provides the object-metadata engine, GraphQL schema generator, record UI, table/kanban views, etc. Fuse layers partner-OS on top.

**The relationship is one-way:** upstream Twenty → Fuse. We consume via periodic cherry-pick waves (currently in wave-2), triaged commit-by-commit into `docs/fuse-upstream-patch-ledger.md` (ACCEPT / DEFER / REJECT). We **never** push Fuse commits back to upstream — the `upstream` remote's push URL is explicitly set to `NO_PUSH_ALLOWED`. Sovereignty stance: no data egress to `twenty.com`, no ClickHouse, no Twenty-controlled telemetry.

### Your job right now

Ship wave-2 to prod. Wave-2 is ~500 upstream cherry-picks accepted across 4 sub-waves (2A security, 2B backend, 2C frontend, 2D flags/RBAC) + 2.5 SDK, all already merged to Fuse `main`. The merges left the repo in a state where **the production Docker image build fails** due to ~300 import/export/declaration drift issues. This session has already closed ~280 of them via 11 commits on PR #35. Remaining: 1-3 CI cycles of iteration, then merge, then SSH deploy. Prod is currently running the **April 13 `partner-os-33d82e948c`** image (pre-wave-2) — agent work does not touch prod until founder executes Phase 2 SSH.

### Founder + constraints

- **Founder:** Dhruv Raina (`dhruv@fusegtm.com`) — terse, ship-oriented, approval-fatigued. Does NOT want sweeping rewrites mid-ship, direct-to-`main` commits, new PR scope creep, or framing like "this is just Twenty with a partnerships tab" (it's not — the partnerships thesis is the product).
- **Hard constraints:**
  - **No data egress to Twenty endpoints.** Enforced in `docs/fuse-upstream-patch-ledger.md` reject list + `MEMORY.md` sovereignty constraints.
  - **Founder runs SSH deploy.** The `ubuntu@52.20.136.71` key is not on agent machines. Agent prepares paste-ready blocks; founder executes.
  - **All PRs target `fuse-gtm/fuse-v1`.** Never push commits upstream to `twentyhq/twenty`. Upstream is fetch-only; push URL explicitly `NO_PUSH_ALLOWED`.
  - **Never modify committed instance-command `up`/`down` logic.** See `packages/twenty-server/docs/UPGRADE_COMMANDS.md`.
  - **Nx monorepo structure is load-bearing** — keep Twenty's package layout intact so future cherry-picks apply. Don't reorganize `packages/` unless the change comes from upstream.

**Phase:** Wave-2 prod deploy unblock. PR #33 closed Phase 0 with 8 fixes (merged). PR #35 (currently 11 commits, active) closes Docker image build. PR #36 (1 commit, open) scopes SPEC-006 Partner Artifact Generator — separate, founder-scope-gate.

---

## Working directory + project IDs

```
Repo:          /Users/dhruvraina/fuse-platform (or re-clone /tmp/fuse-deploy-sweet)
Main branch:   main @ 1a19bb1109 ("Phase 0 wave 2 deploy unblock — 8 cherry-pick regression fixes + runbook patch")
               Earlier stable prod: 33d82e948c (April 13 image, currently live at app.fusegtm.com)
Active branch: fix/front-component-renderer-stale-imports @ a09a37ab1d (PR #35, 11 commits ahead of main)
Scope PR:      docs/spec-006-artifact-generator @ 8ce2bec5e7 (PR #36, 1 commit — SPEC-006 artifact generator scope, unblocked)
Worktree:      .claude/worktrees/sweet-taussig-09d775 (sonnet-spawned, active)
```

| Key | Value |
|---|---|
| Prod EC2 | `52.20.136.71` (SSH `ubuntu@`, compose dir `/opt/fuse/packages/twenty-docker/`) |
| Prod URL | `https://app.fusegtm.com` (live, serving `partner-os-33d82e948c`) |
| GHCR image target | `ghcr.io/fuse-gtm/fuse-v1:partner-os-<short-sha>` |
| Workspace ID | `06e070b2-80eb-4097-8813-8d2ebe632108` |
| Node | 24.5.0 (see `.nvmrc` + `package.json` engines) |
| Node heap for server lint | `NODE_OPTIONS="--max-old-space-size=8192"` (OOM otherwise) |
| Build gate | Fuse Image Build workflow (`.github/workflows/fuse-image-build.yml`) dispatched via `gh workflow run` |
| Latest CI run | `24862425453` (in_progress at handoff time; `gh run view 24862425453 --repo fuse-gtm/fuse-v1`) |

**Gate command:** Fuse Image Build CI (linux/amd64 prod Dockerfile build). NOT local `nx run twenty-front:build` — local machine is colima-based with disk pressure (host at 89% full during prior attempt) and will OOM or I/O-error. Use GitHub Actions.

---

## Required reading (in order, highest precedence first)

If two docs disagree, the one higher on this list wins.

1. **`/Users/dhruvraina/fuse-platform/CLAUDE.md`** — agent instructions + architecture essentials. Load-bearing rules:
   - Functional components only, named exports only, string literals over enums.
   - Composition over inheritance; props down, events up.
   - No `any` — strict TS.
   - Instance commands: generate via `database:migrate:generate --name <n> --type <fast|slow>`. Never modify committed `up`/`down` logic.
2. **Memory: sovereignty + decisions** (`~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/MEMORY.md`) — Fuse identity, upstream sync process, active work. Reject list inheritance.
3. **Prior handoff** (`docs/superpowers/plans/2026-04-23-wave2-deploy-handoff.md`) — explains how wave-2 cherry-pick waves landed + deploy-readiness state at session start. Your session is the unblock-and-ship follow-on.
4. **Deploy runbook** (`docs/ops-logs/2026-04-23-wave2-deploy-commands.md`) — paste-ready deploy commands (Phase 0/1/2/3). Corrections from earlier in this session are already merged (ubuntu@, /opt/fuse/, bundled TRUST_PROXY + ALLOW_REQUESTS_TO_TWENTY_ICONS). Use as-is.
5. **SPEC-004 Deploy Runbook** (`docs/agent-specs/SPEC-004-deploy-runbook.md`) — canonical deploy contract.
6. **Wave-2 followup index** (`docs/ops-logs/2026-04-23-wave2-followup-index.md`) — all deferred items across all waves.
7. **Upstream patch ledger** (`docs/fuse-upstream-patch-ledger.md`) — reject list (6 sovereignty rejects), wave assignment for all 1,222 upstream commits.
8. **SPEC-006 Partner Artifact Generator** (`docs/agent-specs/SPEC-006-partner-artifact-generator.md`) — PR #36, scoped-not-started. Do NOT kick off implementation without founder approval. 5 open questions in §6 need founder resolution first.

---

## Shipped this session — commit changelog

HEAD at handoff: `a09a37ab1d` on `fix/front-component-renderer-stale-imports`. 11 commits from `7c09a78a55` (oldest) through `a09a37ab1d` (newest). Grouped by fix class:

| # | Commit | Class | One-liner |
|---|---|---|---|
| 1 | `7c09a78a55` | Stale @/ prefix | FrontComponentRenderer.tsx: `@/front-component-renderer/remote/...` → `@/remote/...` (7 imports) |
| 2 | `466de54da5` | Conflict markers + dup imports | 7 files with `<<<<<<<< HEAD` markers resolved + 8 files upstream-restored |
| 3 | `33ef2b04d9` | Rename shims | 31 path-prefix shim files (`navigation-menu-item/utils/` → `common/utils/`) and 2 symbol renames |
| 4 | `3b4d09a7d4` | CoreView + orphan delete | 2 CoreView type-alias shims + deleted 11 orphan per-entity SSE effect files |
| 5 | `305f68aea9` | Stubs | 17 dead-symbol stubs (jotai atoms, noop fns, null components) |
| 6 | `167be88eaf` | JSX repair | 2 files with duplicate declarations + malformed JSX |
| 7 | `c618d1873e` | Stubs | 43 final single-consumer stubs (HeadlessEngineCommandMountRoot, etc.) |
| 8 | `2ff737c9b3` | Relative stubs | 3 `useNavigationMenuItemsData` stubs + 2 `useNavigationMenuItemsByFolder` shims |
| 9 | `495557cc3d` | Rename exports | 6 files where HEAD side had upstream's rename'd exports at Fuse's original paths — renamed back (isMinimalMetadataReadyState restored from upstream) |
| 10 | `fe5c3aefbf` | Codegen stubs | 60 missing exports appended to `generated-metadata/graphql.ts` |
| 11 | `a09a37ab1d` | Named-export stubs | 23 missing named exports appended to existing files (CoreView extensions, spreadsheet-import types, casing mismatches) |

**PR #33 merged earlier this session** (already on main): 8-commit Phase 0 deploy unblock.

**PR #36 separately open** (not merged): 1 commit — SPEC-006 scope doc for partner artifact generator. Awaiting founder review of §6 open questions before kickoff.

Scope reduction across the session: **277 stale imports → 0 aliased imports + 54 unique named-export mismatches remaining at handoff.** Each CI cycle surfaces a new class; pattern is convergent.

---

## Remaining work

### Ready (no blockers)

- **WAVE2-R1 — Get CI 24862425453 (or successor) green.** When monitor fires, inspect `gh run view <id> --repo fuse-gtm/fuse-v1 --log-failed`. If another named-export mismatch surfaces, iterate the batch-shim pattern (see §Execution protocol). If disk-space/network/infrastructure error (unrelated), retry. **Estimate:** 1-3 more CI cycles (10-12 min each) based on trajectory.

- **WAVE2-R2 — Admin-merge PR #35.** Gate: `server-build` PASSES on the PR's CI (lint/typecheck/tests can remain red — prior wave-2 PRs all merged this way). Command:
  ```bash
  gh pr merge 35 --repo fuse-gtm/fuse-v1 --admin --squash
  ```

- **WAVE2-R3 — Build + push Docker image.** Dispatch `fuse-image-build.yml` on `main` post-merge, or confirm the branch-dispatched image is tagged `partner-os-<short-sha>`. Verify at `https://ghcr.io/fuse-gtm/fuse-v1`.

- **WAVE2-R4 — Phase 2 SSH deploy.** FOUNDER-ONLY — agent prepares paste block, founder executes. Block is already in `docs/ops-logs/2026-04-23-wave2-deploy-commands.md` Phase 2. Updates needed after CI green: replace `TAG=partner-os-2ff737c9b3` with actual merged-PR short-sha.

- **WAVE2-R5 — Phase 3 soak (60 min).** Monitor 5xx count, egress to unexpected endpoints (filter for `twenty.com`), memory stable under 70% of 2GB t3.small. Per `docs/ops-logs/2026-04-23-wave2-deploy-commands.md` Phase 3.

- **WAVE2-R6 — Post-deploy: update MEMORY.md** with new prod image SHA, timestamp, any runtime observations.

### Blocked (by R1-R5)

- **WAVE2-R7 — TOCTOU follow-up PR.** Re-apply `1f2dccb047` (Fuse-specific SDK-layer TOCTOU race fix) on top of upstream `lambda.driver.ts` restored in PR #33 commit `31fb8a7251`. The restore dropped the Fuse fix to unblock SWC syntax; must be re-applied post-deploy. Changes: `cacheLockService.withLock` on `sdk-layer-build:${layerName}` + `excludeVersionArn` param on `deleteAllLayerVersions` + publish-before-delete order. See commit `1f2dccb047` diff for the exact three hunks.

- **WAVE2-R8 — Follow-up on the ~54 named-export stubs.** Most are TODO(wave-3-cleanup) in code. When wave-3 syncs run or when dead features get removed, audit each TODO marker and replace the stub with real logic OR delete the consumer.

### Optional (founder decision)

- **SPEC-006 kickoff — Partner Artifact Generator.** PR #36 scoped. Do NOT start without founder resolving §6 open questions (marketplace publishing target, doc-editor scope, QBR cadence, PR distribution, LLM cost cap). Depends on SPEC-001 wave-2 close + SPEC-005 Apollo activation.

---

## Known concerns carried forward

### Deferred from wave-2 cherry-pick

- **lambda.driver.ts TOCTOU race (important, deferred to WAVE2-R7):** Sonarly #28633. Concurrent logic-function builds sharing one SDK layer can trip `CreateFunctionCommand: Layer version not found`. Fix exists (`1f2dccb047`) but was dropped when the cherry-pick left the file syntactically invalid. Restoring upstream `lambda.driver.ts` in commit `31fb8a7251` unblocked the build at the cost of the race fix. Low-severity until concurrent logic-function-build load.
- **schema.graphql duplicate types (low):** `packages/twenty-client-sdk/src/metadata/generated/schema.graphql` has duplicate `input GetApiKeyInput` and `type UserLookup`. Purely SDL — no build impact. Fix: regenerate from canonical schema.
- **`CD deploy main` workflow is a Twenty-upstream phone-home leftover (latent sovereignty bug).** `.github/workflows/cd-deploy-main.yaml` fires `repository_dispatch` to `twentyhq/twenty-infra` using `TWENTY_INFRA_TOKEN`. Fuse doesn't set that secret, so it fails harmlessly (7s exit). BUT: if anyone accidentally sets `TWENTY_INFRA_TOKEN`, every push to main would dispatch to Twenty's infra. Fix: delete or rebrand the workflow. Add to `docs/fuse-branding-followups.md`.

### From this session's shim work

- **~54 named-export stubs** all marked `TODO(wave-3-cleanup)` in code. These make the build pass at the cost of feature behavior on their specific paths. Runtime impact only if a feature-flagged-off path gets enabled. Per-file list: grep for `TODO(wave-3-cleanup)` in `fix/front-component-renderer-stale-imports`.

- **60 `graphql.ts` stubs** at the end of `packages/twenty-front/src/generated-metadata/graphql.ts`. The real fix is `nx run twenty-front:graphql:generate --configuration=metadata` against a live workspace schema; defer to wave-3 when the SDK regen lands.

- **11 orphan SSE effect files deleted** in commit `3b4d09a7d4` — `FieldMetadataSSEEffect`, `NavigationMenuItemSSEEffect`, `ObjectMetadataItemSSEEffect`, 3 `PageLayout*SSEEffect`, 5 `View*SSEEffect`. All replaced by upstream's unified `MetadataStoreSSEEffect`. Verified zero external consumers before delete.

- **2 null-stubbed Fuse components** (`NavigationDrawerSectionForWorkspaceItems.tsx`, `NavigationDrawerSectionForWorkspaceItemsListDndKit.tsx`). Renders nothing. Consumers still import the symbol. If Fuse's edit-mode navigation drawer gets turned on in prod, these MUST be replaced with real logic (likely by migrating consumers to upstream's `@/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionContainer`).

---

## Execution protocol

### CI-driven iteration loop (primary)

This session ran the loop below 11 times. Continue the pattern until `conclusion=success`:

1. Dispatch: `gh workflow run fuse-image-build.yml --repo fuse-gtm/fuse-v1 --ref fix/front-component-renderer-stale-imports --field push_branch_alias=false`.
2. Get run ID: `gh run list --repo fuse-gtm/fuse-v1 --workflow=fuse-image-build.yml --limit 1`.
3. Arm Monitor tool with: `until [ "$(gh run view <id> --repo fuse-gtm/fuse-v1 --json status --jq .status 2>/dev/null)" = "completed" ]; do sleep 30; done` + emit conclusion + failing-log grep.
4. On failure, read failing log, identify error class:
   - **Could not resolve** — missing module (create shim at `@/` or relative path).
   - **not exported by** — named export missing (append to existing file).
   - **duplicate identifier** — conflict-marker or duplicate import leftover (dedupe).
   - **SyntaxError** — JSX or duplicate const in function body (repair manually).
   - **Docker disk I/O / colima OOM** — infra, retry.
5. Write the minimum-scope fix. Commit. Push. Redispatch.

### Bulk scan to avoid serial grind

Before dispatching CI, run the local scanner to find ALL missing imports of that class at once:

```python
# See commits 305f68aea9 and a09a37ab1d for prior scripts.
# Key insight: scanner must handle BOTH aliased (@/, ~/) AND relative (./, ../) imports
# AND destructuring exports (export const [A, B] = ...).
```

Scanner template is embedded in commit messages of the 11 commits — copy from `a09a37ab1d`.

### Escape hatches if CI keeps failing

1. **Relax vite onwarn strictness** in `packages/twenty-front/vite.config.ts` — add `onwarn: () => {}` to suppress unresolved-import warnings. Gets buildable image at cost of runtime crashes on those paths. Last resort.
2. **Revert PR #30 (wave 2.5 SDK merge) from main.** The single largest source of drift. Keeps wave 2A/B/C/D intact. Dhruv has NOT authorized this — escalate first.
3. **Build image from pre-PR-#30 SHA** (`174276d5eb`, parent of the wave-2.5 merge). Same risk/benefit as option 2.

### Dangling worktrees — don't panic

`git worktree list` from the main repo shows ~20 dangling Codex worktrees at stale SHAs. Safe to ignore. Do NOT prune without founder confirmation — some may hold uncommitted changes.

### Hard-rules escalation

1. **Stop.** Do not implement. Do not workaround.
2. Write a rationale — what rule, why the violation is necessary.
3. **Ask the founder** in chat. Do not self-amend.
4. If approved, land the amendment in the same commit as the implementation.

---

## Commands cheat sheet

```bash
# Resume context
cd /Users/dhruvraina/fuse-platform/.claude/worktrees/sweet-taussig-09d775
git log --oneline -5  # expect a09a37ab1d on top
git status --short  # clean

# OR re-clone if the worktree is gone:
cd /tmp && git clone --depth 50 --branch fix/front-component-renderer-stale-imports \
  https://github.com/fuse-gtm/fuse-v1.git fuse-deploy-sweet && cd fuse-deploy-sweet
git remote add upstream https://github.com/twentyhq/twenty.git
git remote set-url --push upstream NO_PUSH_ALLOWED  # sovereignty safety
git fetch upstream main --depth=50

# Dispatch CI
gh workflow run fuse-image-build.yml --repo fuse-gtm/fuse-v1 \
  --ref fix/front-component-renderer-stale-imports --field push_branch_alias=false
gh run list --repo fuse-gtm/fuse-v1 --workflow=fuse-image-build.yml --limit 3

# Check run result
RUN_ID=<id>
gh run view $RUN_ID --repo fuse-gtm/fuse-v1 --json status,conclusion --jq '.status, .conclusion'
gh run view $RUN_ID --repo fuse-gtm/fuse-v1 --log-failed 2>&1 | \
  grep -iE "error during|Rollup failed|Could not resolve|not exported|Cannot find|error TS[0-9]|SyntaxError" | head

# Merge PR (admin — bypasses CI red)
gh pr merge 35 --repo fuse-gtm/fuse-v1 --admin --squash

# Prod prod smoke
curl -sS -o /dev/null -w "HTTP %{http_code} in %{time_total}s\n" https://app.fusegtm.com/
```

---

## Environment variable checklist (before Phase 2)

Prod compose `.env` file at `/opt/fuse/packages/twenty-docker/.env`.

| Var | Purpose | Expected | Notes |
|---|---|---|---|
| `TRUST_PROXY` | Express-level trust of X-Forwarded-For from Caddy | `1` | wave-2A requirement; Phase 2 adds if missing |
| `ALLOW_REQUESTS_TO_TWENTY_ICONS` | Enables `twenty-icons.com` favicon fetches for Company records | `true` | Already parsed in April 13 image (`config-variables.ts:185`) — just flipping the value |
| `TAG` | Docker image tag pin | `partner-os-<merged-pr-short-sha>` | Replace `<short-sha>` with actual post-merge value |

If any var is missing or malformed, **do not run `docker compose up -d`.** Restore from `.env.bak.wave2-*` snapshot.

---

## Skills to invoke — per task

### Always-on

- `superpowers:systematic-debugging` — before any fix. No fixes without identifying the exact error class + scope.
- `karpathy-guidelines` — surgical changes, read before write, simplicity.

### WAVE2-R1..R3 (CI + merge)

| Skill | When | Why |
|---|---|---|
| `commit-commands:commit-push-pr` | After each fix commit | Maintains session-standard commit-message form |
| `superpowers:verification-before-completion` | Before claiming "CI green" | Actually run `gh run view`; don't trust stale notifications |

### WAVE2-R4 (SSH deploy — founder-only)

| Skill | When | Why |
|---|---|---|
| `operations:runbook` | Pre-deploy review | Sanity-check the paste block one last time |
| `anthropic-skills:pdf` | If deploy-log artifact needs export | Non-blocking |

### WAVE2-R5 (soak) + R6 (MEMORY update)

| Skill | When | Why |
|---|---|---|
| `claude-md-management:revise-claude-md` | If a new hard rule surfaces | Post-deploy lessons into CLAUDE.md |
| `session-handoff` | End-of-session | Generate next handoff |

### WAVE2-R7 (TOCTOU follow-up)

| Skill | When | Why |
|---|---|---|
| `feature-dev:code-architect` | Planning re-apply of `1f2dccb047` | Understand the 3 hunks cleanly |
| `feature-dev:code-reviewer` | Before PR | TOCTOU races need expert eyes |

### SPEC-006 (if founder approves kickoff — optional)

| Skill | When | Why |
|---|---|---|
| `vercel:ai-sdk` | Prompt/provider setup | Vercel AI SDK is the specified layer |
| `vercel:chat-sdk` | Streaming + tool calls | If artifact generator grows chat UI |
| `ai-architect` (via agent) | Module architecture | Review SPEC-006 §3 design before coding |
| `superpowers:writing-plans` | Pre-implementation plan | Convert SPEC-006 into task breakdown |

### Meta (all tasks)

- `session-handoff` — wrapping up for the next agent.
- `commit-commands:commit` — any commit.
- `engineering:documentation` — updating plans / runbooks.

---

## Immediate next action

1. **Run the receiver checklist** at `~/.claude/skills/session-handoff/templates/receiver-checklist.md`. Do not skip. Commit any doc syncs as `docs: sync project tracking from wave2-deploy-unblock-handoff` before any task work.
2. **Read this doc + `/Users/dhruvraina/fuse-platform/CLAUDE.md` + MEMORY.md + `docs/ops-logs/2026-04-23-wave2-deploy-commands.md`.** ~15 min.
3. **Decide next dispatch based on CI state of run 24862425453:**
   - If `success`: WAVE2-R2 (admin-merge PR #35) → WAVE2-R3 (image tag) → prepare WAVE2-R4 paste block for founder.
   - If `failure`: read failing log, classify error (see Execution protocol step 4), batch-fix, commit, redispatch.
   - If `in_progress` (unlikely by resume): arm Monitor tool and wait.
4. **Respond to the founder terse:** `Ops agent resumed. Next: <task>. Synced: <summary>.`
5. **Go.**
