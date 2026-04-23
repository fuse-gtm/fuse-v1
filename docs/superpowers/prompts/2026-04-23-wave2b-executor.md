# Wave 2B Executor — Dispatchable Prompt

**Status:** Staged. Do NOT dispatch until Wave 2A has merged to `main`. The executor pulls the *post-2A* main as its base.

**When to dispatch:**
1. Wave 2A PR merged to `main` on origin.
2. Guardrail rescanners on 2A branch reported CLEAN.
3. Deep file reviewer on 2A branch reported no blockers.

**How to dispatch:** Copy the entire "Prompt body" section below into a fresh background subagent call (`general-purpose` subagent type, `run_in_background: true`). The prompt is self-contained — the subagent does not need this conversation.

---

## Prompt body

You are the Wave 2B executor for Fuse's upstream sync wave 2. Read the full plan at `/Users/dhruvraina/fuse-platform/.claude/worktrees/goofy-rubin-adb902/docs/superpowers/plans/2026-04-23-upstream-sync-wave-2.md` and Task 2 in particular before touching anything. You are implementing **Task 2 — Wave 2B Backend bugfixes + perf cherry-picks**.

**Role:** Implementer per superpowers:subagent-driven-development. Follow the plan's cherry-pick discipline. You are NOT expected to run lint/typecheck/jest locally — the sandbox is network-restricted and `yarn install` will fail (exit 144). Push the branch and open a PR; CI runs the verification suite on GitHub.

**Preconditions you must verify before starting:**

1. Wave 2A (`integration/upstream-wave2-security`) has merged to `main` on origin. Run:
   ```bash
   git fetch origin
   git log origin/main --oneline | grep -i "wave 2A\|Upstream wave 2A" | head -3
   ```
   You should see the merge commit. If not, STOP and report BLOCKED — wave 2A has not landed yet.

2. The guardrail rescanners and deep reviewer have reported PASS on 2A. Check:
   ```bash
   ls docs/ops-logs/2026-04-23-wave2a-*.md
   ```
   You should see at least the wave2a-security-log + the four guardrail completions appended. If any guardrail or reviewer is still TODO, STOP and report NEEDS_CONTEXT — wait for those to complete.

If both preconditions pass, proceed.

**Working directory:** `/Users/dhruvraina/fuse-platform/.claude/worktrees/goofy-rubin-adb902`. Check out `main` fresh (not the worktree's own branch).

**Authoritative ledger:** `docs/fuse-upstream-patch-ledger.md`. Filter for rows where Wave column = `2B-backend`. That is your canonical cherry-pick list. Count should be **231 commits** (per the triage summary; verify). Execute in ascending row-number order (chronological upstream order).

**Execution steps:**

### Step 1: Branch from post-2A main

```bash
cd /Users/dhruvraina/fuse-platform/.claude/worktrees/goofy-rubin-adb902
git fetch origin
git fetch upstream
git checkout -b integration/upstream-wave2-backend origin/main
```

Record the base SHA: `git rev-parse HEAD` → save as `BASE_SHA` for the ops log.

### Step 2: Extract the SHA list

Parse `docs/fuse-upstream-patch-ledger.md`, pull the SHA column for every row whose Wave column is exactly `2B-backend`. Write to `/tmp/wave2b-shas.txt` one SHA per line. Verify count is 231 (expected); if the count deviates by more than ±5, STOP and report BLOCKED — something changed in the ledger.

### Step 3: Capture pre-cherry-pick migration + GraphQL state

Before cherry-picking, snapshot the current state so you can measure deltas:

```bash
ls packages/twenty-server/src/database/typeorm/core/migrations/common/ | wc -l > /tmp/wave2b-pre-migration-count.txt
ls packages/twenty-server/src/database/typeorm/core/migrations/common/ | sort | tail -1 > /tmp/wave2b-pre-migration-last.txt
find packages/twenty-server/src -name "*.entity.ts" -type f | wc -l > /tmp/wave2b-pre-entity-count.txt
```

You'll re-run these post-cherry-pick and diff.

### Step 4: Cherry-pick loop

```bash
while IFS= read -r sha; do
  echo "=== cherry-picking $sha ==="
  if ! git cherry-pick -x "$sha"; then
    echo "CONFLICT on $sha — applying rules..."
    # see conflict rules below
  fi
done < /tmp/wave2b-shas.txt
```

**Conflict resolution rules — ordered, first match wins:**

1. **Enterprise module (`packages/twenty-server/src/engine/core-modules/enterprise/`):** ABORT the cherry-pick. Add to skip list with reason `enterprise-module-conflict`. Run `git cherry-pick --abort`, continue the queue. These files are Fuse sovereignty-critical — CTO manual review required.

2. **Partner-OS module (`packages/twenty-server/src/modules/partner-os/`):** ABORT. Add to skip list with reason `partner-os-conflict`. Same pattern as #1.

3. **Feature-flag enum or seed — `packages/twenty-shared/src/types/FeatureFlagKey.ts` or `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/seed-feature-flags.util.ts`:** ABORT. Add to skip list with reason `feature-flag-boundary` — this is wave 2D territory, misclassified. Continue the queue.

4. **Fuse-branded frontend files — any of:**
   - `packages/twenty-front/src/pages/auth/SignInUp.tsx`
   - `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx`
   - `packages/twenty-front/src/pages/not-found/NotFound.tsx`
   - `packages/twenty-front/src/pages/onboarding/SyncEmails.tsx`
   - `packages/twenty-front/src/pages/settings/ai/SettingsAIPrompts.tsx`
   - `packages/twenty-front/src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts`
   - `packages/twenty-front/public/manifest.json`
   
   Keep Fuse version: `git checkout HEAD -- <path>` then `git cherry-pick --continue`.

5. **Migration file conflict** (under `packages/twenty-server/src/database/typeorm/core/migrations/`): favor upstream. Migrations are additive per-file; if a conflict arises it's almost always due to timestamp collision or formatting — accept upstream. Record the migration filename in the ops log's migrations-added list.

6. **GraphQL schema / codegen output** (any `generated-metadata/*.ts`, `schema.graphql`): favor upstream. Flag in the ops log so post-merge `npx nx run twenty-front:graphql:generate` is noted for re-run on merge.

7. **All other backend conflicts (logic vs logic):** favor upstream. Resolve, `git add`, `git cherry-pick --continue`.

8. **Never skip hooks** (`--no-verify`). If a pre-commit hook fails, fix the underlying issue.

**Progress reporting:** every 25 cherry-picks, write a progress line to `/tmp/wave2b-progress.log` with format `<timestamp> <N>/231 successful, <M> skipped`. Helps the orchestrator check in.

### Step 5: Post-cherry-pick snapshot deltas

```bash
ls packages/twenty-server/src/database/typeorm/core/migrations/common/ | wc -l > /tmp/wave2b-post-migration-count.txt
ls packages/twenty-server/src/database/typeorm/core/migrations/common/ | sort | tail -1 > /tmp/wave2b-post-migration-last.txt
find packages/twenty-server/src -name "*.entity.ts" -type f | wc -l > /tmp/wave2b-post-entity-count.txt
```

Compute deltas. Migrations added = post - pre. Entities added = post - pre.

**Migration ordering sanity check:** list any migration file whose timestamp is numerically **lower** than the pre-cherry-pick `wave2b-pre-migration-last.txt` value:

```bash
PRE_LAST=$(cat /tmp/wave2b-pre-migration-last.txt | sed 's/-.*//')
ls packages/twenty-server/src/database/typeorm/core/migrations/common/ | \
  while read f; do
    ts=$(echo "$f" | sed 's/-.*//')
    if [ "$ts" -lt "$PRE_LAST" ] 2>/dev/null; then
      # only report if it's NEW (not already on pre-base main)
      git log origin/main --name-only --pretty=format: -- "packages/twenty-server/src/database/typeorm/core/migrations/common/$f" | grep -q . || echo "NEW-OUT-OF-ORDER: $f"
    fi
  done
```

Any `NEW-OUT-OF-ORDER` lines → flag in ops log. TypeORM tracks migrations by applied-or-not, so out-of-order new migrations still run, but it's a signal worth surfacing.

### Step 6: GraphQL codegen detection

Check whether any cherry-pick touched the GraphQL schema or resolver typings:

```bash
git diff origin/main... --name-only | grep -E '(\.resolver\.ts|\.dto\.ts|\.graphql$|generated-metadata/)' | head -30 > /tmp/wave2b-graphql-touches.txt
wc -l /tmp/wave2b-graphql-touches.txt
```

If non-empty, the PR body MUST note that `graphql:generate` needs to be re-run post-merge (or that CI must verify `--check` passes).

### Step 7: Create the ops log

Write `docs/ops-logs/2026-04-23-wave2b-backend-log.md`:

```markdown
# Wave 2B Backend Cherry-pick Log — 2026-04-XX

Branch: `integration/upstream-wave2-backend`
Base: `<BASE_SHA>` (post-2A main)
Ledger: `docs/fuse-upstream-patch-ledger.md` (rows where Wave = 2B-backend)

## Summary
- Cherry-picks attempted: 231
- Cherry-picks successful: <N>
- Cherry-picks skipped: <M>
- Conflicts auto-resolved: <K>

## Skipped cherry-picks
| SHA | Reason | Rule |
|---|---|---|
...

## Conflicts resolved (branded / logic)
| SHA | File | Rule applied |
|---|---|---|
...

## Schema surface deltas
- Migrations added: <post - pre>
- Most recent migration pre: <ts>
- Most recent migration post: <ts>
- Out-of-order NEW migrations: <list or "none">
- Entity files added: <post - pre>
- GraphQL schema / resolver / DTO touches: <count> (see `/tmp/wave2b-graphql-touches.txt`)

## Verification status
Deferred to CI (sandbox network-restricted; local lint/typecheck/test/migration-dry-run not runnable).

## Guardrail checkpoint placeholders

## Guardrail A — telemetry scan (post-wave-2B)
TODO: scanner agent

## Guardrail B — partner-os surface
TODO: scanner agent

## Guardrail C — feature-flag drift
TODO: scanner agent

## Deep file review
TODO: deep-reviewer agent
```

Commit the log:

```bash
git add docs/ops-logs/2026-04-23-wave2b-backend-log.md
git commit -m "docs(ops): wave 2b backend cherry-pick log"
```

### Step 8: Push branch + open PR

```bash
git push -u origin integration/upstream-wave2-backend
# Pass --repo explicitly; gh infers twentyhq/twenty from the upstream remote otherwise.
gh pr create --repo fuse-gtm/fuse-v1 --base main --head integration/upstream-wave2-backend \
  --title "Upstream wave 2B — backend bugfixes + perf" \
  --body "$(cat <<'PRBODY'
## Summary

Cherry-picks the `2B-backend` commits from the wave-2 upstream backlog per `docs/fuse-upstream-patch-ledger.md` — bugfixes, refactors, perf improvements, and SDK regen entirely within `packages/twenty-server/`. Enterprise module and partner-os module are explicitly NOT touched; any cherry-pick that conflicted with those directories was aborted and recorded as skipped for CTO manual review.

## Per-cherry-pick provenance

Each commit retains its upstream SHA via `-x`. See `docs/ops-logs/2026-04-23-wave2b-backend-log.md` for full cherry-pick attempt log, skipped commits with reasons, conflict resolutions, schema deltas, and GraphQL codegen status.

## Verification

- Local lint / typecheck / jest / migration-dry-run: **deferred to CI** (sandbox network-restricted).
- CI required to run:
  - `NODE_OPTIONS="--max-old-space-size=8192" npx nx lint:diff-with-main twenty-server`
  - `npx nx typecheck twenty-server`
  - `npx nx test twenty-server`
  - `npx nx run twenty-server:test:integration:with-db-reset`
  - `npx nx database:reset twenty-server && npx nx run twenty-server:database:migrate:prod` (migration dry-run on scratch DB)
- If the schema-deltas section reports any GraphQL touches, CI must also verify `npx nx run twenty-front:graphql:generate` produces no diff.
- Guardrail rescanners (telemetry, partner-os surface, feature-flag drift) will be dispatched post-push by the orchestrator.
- Deep file reviewer will run post-push before merge approval.

## Test plan

- [ ] CI green — lint, typecheck, server tests, integration tests, migration dry-run
- [ ] GraphQL codegen produces no uncommitted diff (if schema-touching commits present)
- [ ] Telemetry guardrail rescanner reports CLEAN against baseline (`docs/ops-logs/2026-04-23-wave2-baseline.md`)
- [ ] Partner-os surface diff = 0 lines
- [ ] Feature-flag guardrail: `IS_PARTNER_OS_ENABLED` still in `packages/twenty-shared/src/types/FeatureFlagKey.ts`; `FeatureFlagKey.ts` still exists and was not relocated
- [ ] Deep file reviewer approves with no blockers
- [ ] Preview deploy smoke: sign-in, partner-os dashboard load, no new egress to twenty.com in server logs for 60 minutes
- [ ] (If migrations added) migration dry-run on scratch DB completes without error

🤖 Generated with [Claude Code](https://claude.com/claude-code)
PRBODY
)"
```

### Step 9: Report back

Final message structure:
- Branch name + final SHA
- PR URL
- Cherry-pick counts: attempted / successful / skipped
- Skipped list: SHA + reason (categorize by rule: enterprise-module, partner-os, feature-flag-boundary)
- Branded-file preservations: list of SHA + file
- Schema deltas: migrations-added / entities-added / graphql-touches-count
- Out-of-order migrations: list or "none"
- Top 5 most interesting commits in the wave (so the reviewer knows what to focus on)
- Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

**Absolute constraints:**
- Do not commit to `main` directly.
- Do not commit to `claude/goofy-rubin-adb902` (the worktree's own branch).
- Do not touch any file in `packages/twenty-server/src/modules/partner-os/` or `packages/twenty-server/src/engine/core-modules/enterprise/` outside of aborted cherry-picks.
- Do not touch `packages/twenty-shared/src/types/FeatureFlagKey.ts` or `seed-feature-flags.util.ts` — those are wave 2D boundary files.
- Do not use `--no-verify` on commits.
- Do not use `git push --force`.
- Do not delete branches.
- **If you skip >30 commits (13% of the wave), STOP and report BLOCKED** — high skip rate signals misclassification in the ledger or base-branch drift.
- **If any cherry-pick triggers TypeScript errors in partner-os files that you did not touch**, that's a silent upstream-rename that reached partner-os via a cascade — report DONE_WITH_CONCERNS and include the file list; CTO decides next step.

---

## Notes on why this prompt is structured this way

- **Step 3 + 5 snapshot deltas** catch silent schema drift (new tables, entity renames, migration-ordering gotchas) that wouldn't show up in test failures alone.
- **Step 6 GraphQL detection** is critical because the `graphql:generate` step is easy to miss locally and CI may not enforce it.
- **Feature-flag boundary (rule 3)** prevents 2B from accidentally dragging in a 2D commit — the plan deliberately scopes RBAC/flag moves to 2D.
- **Skip-cap at 30 (rule 5)** prevents runaway cherry-picks where the ledger filter is off; better to stop and re-triage than grind through 200 broken picks.
- **Deferred-to-CI verification** matches the sandbox constraint. The PR body explicitly enumerates the CI commands so reviewer knows what to check on GitHub.
