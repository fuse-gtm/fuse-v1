# Upstream Sync Wave 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Parallelize per superpowers:multi-agent-orchestration — see §Orchestration.

**Goal:** Pull the 1,221 upstream Twenty commits that have accumulated on `twentyhq/twenty:main` since the last merge (`4583bd0af7`, wave 1, 2026-03-20) into Fuse `main` — accepting by default, rejecting only for clear regressions, sovereignty breaks, or surveillance/telemetry hooks.

**Architecture:** Triage all upstream commits into an in-repo ledger (`docs/fuse-upstream-patch-ledger.md`), then run four cherry-pick waves (Security → Backend/Perf → Frontend → optional Feature-Flag/RBAC rebase) as separate integration branches, each its own PR. Guardrail agents run in parallel to every wave: telemetry/egress scanner, partner-os surface diff, feature-flag seed drift check, and a deep file-review pass. No workbench work. No website-repo work (scaffold already live on Vercel).

**Tech Stack:** git cherry-pick, nx lint/typecheck/test, jest, twenty-server NestJS, twenty-front React+Linaria, Postgres MCP for schema verification, Exa (`get-code-context-exa`) for upstream context lookup when commit messages are thin.

**Explicitly not in scope:**
- Workbench V1 — exploration only, see `docs/workbench-v1-exploration-only.md`.
- Fuse website — scaffold already live on Vercel; no platform-repo work.
- Apollo enrichment (SPEC-005) — deferred until feature-flag block lands.
- Table performance (SPEC-003) — upstream branch still unmerged.

---

## File Structure

**Created / modified during this plan:**

- Create: `docs/fuse-upstream-patch-ledger.md` — the ledger (Task 0).
- Modify: `docs/agent-specs/SPEC-001-upstream-cherry-picks.md` — refresh counts, re-classify blocks against current main (Task 0).
- Modify: `docs/fuse-branding-followups.md` — close out items superseded by upstream changes (end of each wave if applicable).
- Create (one per wave): integration branch `integration/upstream-wave2-<scope>` containing cherry-picked commits.
- Create (one per wave): `docs/ops-logs/2026-04-XX-wave2-<scope>-log.md` — outcome log, conflict resolutions, verification results.

**No source file is modified outside of cherry-picks.** If a cherry-pick conflicts with Fuse-branded files, resolve with `git checkout HEAD -- <path>` to keep Fuse version, then record the decision in the ledger.

---

## Orchestration

Follow **superpowers:multi-agent-orchestration**. Four role types, dispatched under **superpowers:subagent-driven-development**:

| Role | Skill stack | Count | Parallelism |
|---|---|---|---|
| Triage classifier | `superpowers:writing-plans`, `get-code-context-exa` | 1 | sequential (produces the ledger) |
| Wave executor | `superpowers:subagent-driven-development`, `superpowers:verification-before-completion` | 1 per wave (max 4) | waves sequential, but waves 2B + 2C may run in parallel worktrees after 2A ships |
| Guardrail scanner | `superpowers:systematic-debugging` | 3 instances (telemetry, partner-os, flag-drift) | parallel with every wave |
| Deep file reviewer | `feature-dev:code-reviewer`, `get-code-context-exa` | 1 per wave | runs after wave executor finishes, before PR merge |

Dispatch pattern: start triage (Task 0). When ledger is ready, dispatch wave 2A executor + all 3 guardrail scanners in a single message (parallel). When 2A executor reports back, dispatch deep-review for 2A + wave 2B executor in parallel. Same for 2C. 2D only if explicitly scoped in.

---

## Ledger Guidance (read before Task 0)

**Default verdict: ACCEPT.** Err toward pulling a commit unless there is a clear, concrete regression vector. Use these lenses:

**Reject only if the commit:**
- Calls out to Twenty-controlled endpoints at runtime (phone-home, billing validation, usage analytics to `twenty.com` or `twenty-website`).
- Introduces ClickHouse, Segment, PostHog, or any telemetry SDK not already in use.
- Re-enables the enterprise-license verification chain that `377664545c` disabled.
- Removes the `IS_PARTNER_OS_ENABLED` flag or any flag partner-os depends on.
- Touches `packages/twenty-server/src/modules/partner-os/` in a way that conflicts with shipped behavior.
- Is pure `i18n - translations (#XXXXX)` noise with no code impact — these are DEFER (not reject; take in a bulk batch at the end to avoid churn).

**Defer only if the commit:**
- Is part of a multi-commit block that cannot be cherry-picked atomically (Linaria-style), and the block has not been scoped for this wave.
- Touches feature-flag enum location (`FeatureFlagKey` move from server to shared) — the full RBAC rebase is optional wave 2D.
- Requires a dependency (`apollo-enrich`, SDK CLI OAuth) that is not yet scoped.

**Accept by default for everything else**, including: bugfixes, refactors, UI fixes, field/record/widget crashes, permission guard ports, migration entrypoint fixes, SSRF/XSS hardening, dep bumps, SDK regenerations, design fixes, admin UI improvements, pre-installed app *infrastructure* (not the apps themselves if the flag is deferred).

When in doubt: ACCEPT, then let the deep-reviewer agent flag it post-cherry-pick. We can always revert one commit; we cannot undo a stalled sync.

---

## Tasks

### Task 0: Ledger creation + SPEC-001 refresh

**Role:** Triage classifier (single sequential agent)

**Files:**
- Create: `docs/fuse-upstream-patch-ledger.md`
- Modify: `docs/agent-specs/SPEC-001-upstream-cherry-picks.md`

- [ ] **Step 1: Produce the raw commit list**

```bash
git fetch upstream
git log 4583bd0af7..upstream/main --oneline --reverse > /tmp/wave2-commits.txt
wc -l /tmp/wave2-commits.txt
```
Expected: ~1,221 lines. Save `/tmp/wave2-commits.txt` as source of truth for the triage pass.

- [ ] **Step 2: Scaffold the ledger**

Create `docs/fuse-upstream-patch-ledger.md` with columns:

```markdown
# Fuse Upstream Patch Ledger — Wave 2

Base: `4583bd0af7` (last synced commit on Fuse main)
Upstream tip at triage: <short-sha> (`upstream/main` at fetch time)
Triage date: 2026-04-23
Default verdict: ACCEPT (see plan §Ledger Guidance)

| # | SHA | PR | Title | Verdict | Wave | Reason (reject/defer only) |
|---|-----|----|-------|---------|------|----------------------------|
```

Wave column values: `2A-security`, `2B-backend`, `2C-frontend`, `2D-flags-rbac`, `i18n-bulk`, `reject`, `defer`.

- [ ] **Step 3: Classify every commit**

For each commit in `/tmp/wave2-commits.txt`:
- Fetch `git show --stat <sha>` to see touched paths.
- If title matches any `i18n - translations`, `i18n - docs translations` → `i18n-bulk`.
- If title/files touch `SecureHttpClient`, `dompurify`, `xss`, `ssrf`, `csrf`, `oauth`, `.github/workflows`, `rate-limit`, security headers → `2A-security`.
- If touched paths are all under `packages/twenty-server/` and not touching enum location / RBAC stack → `2B-backend`.
- If touched paths are all under `packages/twenty-front/` or `packages/twenty-ui/` → `2C-frontend`.
- If commit moves `FeatureFlagKey`, introduces RBAC role tables, or touches permissions stack → `2D-flags-rbac`.
- If commit matches a reject rule (see §Ledger Guidance) → `reject` and cite the specific rule.
- Everything else: accept, choose wave by touched paths; if unclear, `2B-backend` (server is easier to soak-test than frontend).

For thin-commit-message commits, use `get-code-context-exa` against the upstream repo to read the PR description.

- [ ] **Step 4: Refresh SPEC-001 counts and blocks**

Edit `docs/agent-specs/SPEC-001-upstream-cherry-picks.md`:
- Update "Upstream is now 588 commits ahead" → current count from ledger.
- Mark Block 1 (security) / Block 2 (Linaria) / Block 3 (perf) as **complete (wave 1)**.
- Add a pointer to the wave 2 ledger: `See docs/fuse-upstream-patch-ledger.md for the current backlog.`
- Keep the "DO NOT CHERRY-PICK" section intact — it is still the sovereignty charter.

- [ ] **Step 5: Commit**

```bash
git add docs/fuse-upstream-patch-ledger.md docs/agent-specs/SPEC-001-upstream-cherry-picks.md
git commit -m "docs(sync): triage wave 2 upstream backlog — $(wc -l < /tmp/wave2-commits.txt) commits"
```

**Acceptance:** Every commit in the raw list has exactly one row in the ledger. Counts per wave are reported in the commit message body.

---

### Task 1: Wave 2A — Security cherry-picks

**Role:** Wave executor + Guardrail scanners (parallel)

**Why first:** Smallest, most targeted, lowest conflict risk, highest consequences if skipped.

**Files:**
- Create branch: `integration/upstream-wave2-security` from current `main`
- Create log: `docs/ops-logs/2026-04-XX-wave2a-security-log.md`

- [ ] **Step 1: Create the integration branch**

```bash
git checkout main
git pull origin main
git checkout -b integration/upstream-wave2-security
```

- [ ] **Step 2: Cherry-pick each `2A-security` commit in ledger order**

For each commit with wave `2A-security`:

```bash
git cherry-pick -x <sha>
# On conflict: if Fuse-branded file, keep Fuse version:
#   git checkout HEAD -- <path> && git cherry-pick --continue
# If conflict is logic vs logic, resolve favoring upstream security fix
```

Record every conflict and its resolution in `docs/ops-logs/2026-04-XX-wave2a-security-log.md`.

- [ ] **Step 3: Run verification suite**

```bash
npx nx build twenty-shared
NODE_OPTIONS="--max-old-space-size=8192" npx nx lint:diff-with-main twenty-server
npx nx lint:diff-with-main twenty-front
npx nx typecheck twenty-server
npx nx typecheck twenty-front
npx nx test twenty-server --testPathPattern='(security|auth|ssrf|xss|oauth)'
```
Expected: all pass. Any failure → stop, log the failing commit, revert the last cherry-pick, investigate.

- [ ] **Step 4: Guardrail checkpoint (parallel scanners must all report green before PR)**

- Telemetry scan (Guardrail A) — see Task 5, re-run against `integration/upstream-wave2-security`.
- Partner-os surface diff (Guardrail B) — see Task 6.
- Feature-flag seed drift (Guardrail C) — see Task 7.

- [ ] **Step 5: Deep file review**

Dispatch deep reviewer agent — see Task 8. It reads every file touched by this wave's cherry-picks and flags concerns. Concerns triaged into: blocker (revert), nit (fix-forward), accept (noted in log).

- [ ] **Step 6: PR + merge**

```bash
git push origin integration/upstream-wave2-security
gh pr create --base main --head integration/upstream-wave2-security \
  --title "Upstream wave 2A — security cherry-picks" \
  --body "$(cat docs/ops-logs/2026-04-XX-wave2a-security-log.md)"
```
Merge after CI green + reviewer approval.

---

### Task 2: Wave 2B — Backend bugfixes + perf

**Role:** Wave executor + Guardrail scanners (parallel)

Can be worked in parallel worktree with Task 3 (wave 2C) once 2A has merged.

**Files:**
- Create branch: `integration/upstream-wave2-backend`
- Create log: `docs/ops-logs/2026-04-XX-wave2b-backend-log.md`

- [ ] **Step 1: Branch from post-2A main**

```bash
git fetch origin
git checkout -b integration/upstream-wave2-backend origin/main
```

- [ ] **Step 2: Cherry-pick each `2B-backend` commit in ledger order**

Same pattern as Task 1 Step 2. Common conflict surface: migration files, entity files overlapping with partner-os entities. For any migration conflict: verify ordering in `packages/twenty-server/src/database/typeorm/core/migrations/common/` — wave 2 migrations must run after existing partner-os migrations.

- [ ] **Step 3: Migration dry-run**

```bash
# On a scratch DB copy:
npx nx database:reset twenty-server
npx nx run twenty-server:database:migrate:prod
```
Expected: clean run. Any failure → stop, investigate before continuing cherry-picks.

- [ ] **Step 4: Verification suite**

```bash
NODE_OPTIONS="--max-old-space-size=8192" npx nx lint:diff-with-main twenty-server
npx nx typecheck twenty-server
npx nx test twenty-server
npx nx run twenty-server:test:integration:with-db-reset
```
Expected: all pass.

- [ ] **Step 5: Guardrail checkpoint + deep review**

Re-run Tasks 5–8 scoped to this branch.

- [ ] **Step 6: PR + merge**

Same pattern as Task 1 Step 6, retitled `Upstream wave 2B — backend + perf`.

---

### Task 3: Wave 2C — Frontend bugfixes

**Role:** Wave executor + Guardrail scanners (parallel)

Can run in parallel worktree with Task 2 after wave 2A merges.

**Files:**
- Create branch: `integration/upstream-wave2-frontend`
- Create log: `docs/ops-logs/2026-04-XX-wave2c-frontend-log.md`

- [ ] **Step 1: Branch from post-2A main**

```bash
git fetch origin
git worktree add ../wave2c integration/upstream-wave2-frontend origin/main
cd ../wave2c
```

- [ ] **Step 2: Cherry-pick each `2C-frontend` commit in ledger order**

Same pattern. Common conflict surface: Linaria style files, branded copy (`SignInUp`, `FooterNote`, `NotFound`, `SettingsAIPrompts`, `SyncEmails`, `getTimelineActivityAuthorFullName`, `manifest.json`). On branded conflicts, keep Fuse strings.

- [ ] **Step 3: Verification suite**

```bash
npx nx build twenty-shared
npx nx lint:diff-with-main twenty-front
npx nx typecheck twenty-front
npx nx test twenty-front
npx nx run twenty-front:graphql:generate
npx nx run twenty-front:graphql:generate --configuration=metadata
```
Expected: all pass, no uncommitted codegen diff.

- [ ] **Step 4: Storybook smoke**

```bash
npx nx storybook:build twenty-front
```
Expected: clean build, no missing-story errors.

- [ ] **Step 5: Guardrail checkpoint + deep review**

Re-run Tasks 5–8 scoped to this branch.

- [ ] **Step 6: PR + merge**

Same pattern, retitled `Upstream wave 2C — frontend bugfixes`.

---

### Task 4: Wave 2D — Feature-flag / RBAC rebase (CONDITIONAL)

**Role:** Wave executor only if explicitly scoped.

**Skip by default.** Only run if Apollo enrichment (SPEC-005) or multi-user permissions are scheduled in the next sprint. Requires SPEC-002 feature-flag backfill to be re-run against prod workspace `06e070b2-80eb-4097-8813-8d2ebe632108` after merge.

- [ ] **Step 1: Scope confirmation**

Before starting, founder must confirm: "Yes, take the feature-flag + RBAC rebase this wave." If no explicit confirmation — stop, mark `2D-flags-rbac` commits as `defer` in ledger for next wave.

- [ ] **Step 2: If scoped, plan in a separate doc**

Create `docs/superpowers/plans/2026-04-XX-flags-rbac-rebase.md` — this is a standalone sub-plan with its own file map, conflict matrix, and rollback plan. Do not attempt in-line with waves 2A–2C.

---

### Task 5 (Guardrail A): Telemetry + egress scan

**Role:** Guardrail scanner — runs in parallel with every wave.

**Files:** No file changes. Output: append findings to the wave log.

- [ ] **Step 1: Scan all cherry-picked diffs for egress patterns**

```bash
# From the integration branch:
git diff main... | grep -nE 'twenty\.com|ENTERPRISE_VALIDITY_TOKEN|twentyhq|clickhouse|posthog|segment|\.track\(|analytics\.' || echo "CLEAN"
```
Expected: `CLEAN`. Any match → flag to wave executor, investigate.

- [ ] **Step 2: Verify phone-home remains disabled**

```bash
grep -nR "phone-home\|verifyEnterprise\|validateLicense" packages/twenty-server/src/ | grep -v '\.spec\.' | grep -v 'disabled\|noop\|stub' || echo "CLEAN"
```
Expected: `CLEAN` or references only to the disabled/stub path from `377664545c`.

- [ ] **Step 3: Confirm no new dependencies pulled in**

```bash
git diff main... -- package.json yarn.lock | grep -nE '"posthog|"segment|"@clickhouse|"mixpanel|"amplitude' || echo "CLEAN"
```
Expected: `CLEAN`.

- [ ] **Step 4: Append findings to wave log**

Append results block to `docs/ops-logs/2026-04-XX-wave2X-*-log.md`:

```markdown
## Guardrail A — telemetry scan
- Egress patterns: CLEAN | <list>
- Phone-home surface: CLEAN | <list>
- New telemetry deps: CLEAN | <list>
- Verdict: PASS | BLOCK
```

---

### Task 6 (Guardrail B): Partner-OS surface diff

**Role:** Guardrail scanner — runs in parallel with every wave.

- [ ] **Step 1: Diff partner-os dir vs pre-wave main**

```bash
git diff main... -- packages/twenty-server/src/modules/partner-os/ | tee /tmp/partner-os-diff.patch
wc -l /tmp/partner-os-diff.patch
```
Expected: 0 lines. Any non-zero → a cherry-pick touched partner-os. Investigate:

```bash
git log main... --stat -- packages/twenty-server/src/modules/partner-os/
```

- [ ] **Step 2: If touched, classify**

- Accidental rename/cascade from upstream rename refactor → fix-forward, note in log.
- Logic change to partner-os service/entity → BLOCK, revert the offending cherry-pick, re-triage in ledger.

- [ ] **Step 3: Verify partner-os tests still pass**

```bash
cd packages/twenty-server && npx jest partner-os --config=jest.config.mjs
```
Expected: all pass (current baseline: 84 tests, 98.75% coverage per `fc134077bb`).

- [ ] **Step 4: Append findings to wave log**

```markdown
## Guardrail B — partner-os surface
- Diff line count: 0 | <n>
- Test result: PASS | FAIL
- Verdict: PASS | BLOCK
```

---

### Task 7 (Guardrail C): Feature-flag seed drift

**Role:** Guardrail scanner — runs at end of each wave before PR merge.

- [ ] **Step 1: Diff the feature-flag enum**

```bash
git diff main... -- packages/twenty-server/src/engine/core-modules/feature-flag/enums/feature-flag-key.enum.ts
git diff main... -- packages/twenty-server/src/engine/core-modules/feature-flag/utils/seed-feature-flags.util.ts
```

- [ ] **Step 2: Verify enum location (note: enum is already in twenty-shared as of pre-wave-2 main)**

The pre-flight review confirmed `packages/twenty-shared/src/types/FeatureFlagKey.ts` already exists on main (see `docs/ops-logs/2026-04-23-wave2-preflight-review.md` concern #2). The original plan assumed enum still lived in twenty-server; that assumption is obsolete. Updated check:

```bash
# Correct check: enum lives in twenty-shared. Only flag if it DISAPPEARS from there.
test -f packages/twenty-shared/src/types/FeatureFlagKey.ts || echo "BLOCK: enum removed from twenty-shared"
```
Expected: file exists, no output. If `BLOCK` — wave pulled a commit that removed/moved the enum. Revert.

- [ ] **Step 3: Confirm `IS_PARTNER_OS_ENABLED` still in enum**

```bash
grep -n 'IS_PARTNER_OS_ENABLED' packages/twenty-shared/src/types/FeatureFlagKey.ts || echo "BLOCK: partner-os flag missing"
```
Expected: match found.

- [ ] **Step 4: Check seed file against prod workspace via Postgres MCP**

Using the read-only Postgres MCP in `.mcp.json`:

```sql
SELECT key, value FROM core."featureFlag"
WHERE "workspaceId" = '06e070b2-80eb-4097-8813-8d2ebe632108'
ORDER BY key;
```

Compare against the seed file's enum keys. Any new enum entry not present in the workspace row → flag for post-merge SPEC-002 backfill.

- [ ] **Step 5: Append findings to wave log**

```markdown
## Guardrail C — feature-flag drift
- Enum moved to shared: NO | YES
- IS_PARTNER_OS_ENABLED present: YES | NO
- Prod workspace drift: NONE | <list of missing keys>
- Verdict: PASS | BLOCK | POST-MERGE-BACKFILL-NEEDED
```

---

### Task 8 (Deep File Review): Upstream context + regression sniff

**Role:** Deep file reviewer — runs after wave executor finishes, before wave PR merges.

**Skill:** `feature-dev:code-reviewer` with access to `get-code-context-exa` for upstream PR descriptions and StackOverflow/GitHub code context when a commit's purpose is unclear.

- [ ] **Step 1: Enumerate files touched by the wave**

```bash
git diff main... --name-only > /tmp/wave-touched-files.txt
wc -l /tmp/wave-touched-files.txt
```

- [ ] **Step 2: For each file, run the review loop**

For every file in `/tmp/wave-touched-files.txt`:
- Read the full file at current (post-cherry-pick) state.
- Read the diff `git diff main... -- <file>`.
- If the commit message is thin, call `get-code-context-exa` with the upstream PR URL or commit title to surface context.
- Grep the rest of the codebase for callers of any functions/symbols changed by the diff, verify no behavioral mismatch introduced:
  ```bash
  grep -nR "<changed-symbol>" packages/ --include='*.ts' --include='*.tsx'
  ```
- Classify each concern found:
  - **blocker** — regression, security issue, sovereignty break. Wave executor must revert the offending cherry-pick.
  - **nit** — cosmetic, style, non-functional. Fix-forward in a follow-up commit on the same integration branch.
  - **accept** — intentional upstream change, no action.

- [ ] **Step 3: Write the review report**

Append to wave log:

```markdown
## Deep file review
- Files reviewed: <n>
- Blockers: <list with file:line>
- Nits: <list>
- Accepted: <count>
- Verdict: PASS | BLOCK
```

- [ ] **Step 4: If blockers, revert and re-run wave executor**

```bash
git revert <offending-sha>
# re-run Steps 3–4 of the wave executor task
```

---

### Task 9: Final integration smoke + ledger close-out

**Role:** Wave executor — after all non-deferred waves merge to main.

- [ ] **Step 1: Full verification on main**

```bash
git checkout main
git pull
npx nx build twenty-shared
npx nx build twenty-front
npx nx build twenty-server
npx nx typecheck twenty-server
npx nx typecheck twenty-front
npx nx test twenty-server
npx nx test twenty-front
npx nx run twenty-server:test:integration:with-db-reset
```
Expected: all pass.

- [ ] **Step 2: Production smoke**

Deploy to staging via SPEC-004 deploy runbook. Verify:
- Sign-in + onboarding flow works with prefilled creds.
- Partner-os dashboard loads.
- No new egress to `twenty.com` in server logs for 60 minutes.

- [ ] **Step 3: Close out the ledger**

Edit `docs/fuse-upstream-patch-ledger.md`:
- Mark every accepted commit with its cherry-pick SHA on main.
- Mark every deferred commit with a pointer to the wave that will take it.
- Add a `Wave 2 completed: <date>` footer.

- [ ] **Step 4: Update MEMORY.md**

```bash
# in ~/.claude/projects/-Users-dhruvraina-fuse-platform/memory/MEMORY.md:
# - move upstream sync wave 2 from Active Work to Completed Work
# - note next wave base = current upstream/main tip
```

- [ ] **Step 5: Commit ledger close-out**

```bash
git add docs/fuse-upstream-patch-ledger.md
git commit -m "docs(sync): close out wave 2 — <N> accepted, <N> deferred, <N> rejected"
git push origin main
```

---

## Verification Commands (quick reference)

```bash
# From any integration branch:
NODE_OPTIONS="--max-old-space-size=8192" npx nx lint:diff-with-main twenty-server
npx nx lint:diff-with-main twenty-front
npx nx typecheck twenty-server
npx nx typecheck twenty-front
npx nx test twenty-server
npx nx test twenty-front
npx nx run twenty-server:test:integration:with-db-reset
```

## Rollback

Each wave is one branch. Rollback is `git revert -m 1 <merge-sha>` on main, then re-open the integration branch. Because each wave is isolated, rolling back 2C does not require rolling back 2A or 2B.

## Known risk surface

- **Migration ordering** — if a wave 2B cherry-pick introduces a migration with a timestamp earlier than an already-shipped partner-os migration, TypeORM will skip it silently. Dry-run every wave-2B branch against a fresh DB (Task 2 Step 3).
- **Linaria cold cache** — wave 2C frontend builds may OOM on first build after many cherry-picks. Increase `NODE_OPTIONS="--max-old-space-size=12288"` for that specific build if needed.
- **SDK metadata regen** — any wave-2B commit that touches GraphQL schema requires `npx nx run twenty-front:graphql:generate` before the frontend typechecks.
