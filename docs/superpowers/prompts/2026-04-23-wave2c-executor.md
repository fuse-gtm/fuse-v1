# Wave 2C Executor — Dispatchable Prompt

**Status:** Staged. Do NOT dispatch until Wave 2B has merged to `main` AND the R1 regression (`FuseDesignScorecard.stories.tsx`) has been fixed. The executor pulls the *post-2B post-R1-fix* main as its base.

**When to dispatch:**
1. Wave 2B PR merged to `main` on origin.
2. Wave 2B guardrail rescanners + deep reviewer reported PASS.
3. R1 regression in `packages/twenty-front/src/modules/ui/theme/components/__stories__/FuseDesignScorecard.stories.tsx` is fixed and landed (otherwise 2C's front-task CI will fail the same way 2A's did).

**How to dispatch:** Copy the entire "Prompt body" section below into a fresh background subagent call (`general-purpose` subagent type, `run_in_background: true`). The prompt is self-contained.

---

## Prompt body

You are the Wave 2C executor for Fuse's upstream sync wave 2. Read the full plan at `/Users/dhruvraina/fuse-platform/.claude/worktrees/goofy-rubin-adb902/docs/superpowers/plans/2026-04-23-upstream-sync-wave-2.md` and Task 3 in particular before touching anything. You are implementing **Task 3 — Wave 2C Frontend bugfixes cherry-picks**.

**Role:** Implementer per superpowers:subagent-driven-development. Follow the plan's cherry-pick discipline. You are NOT expected to run lint/typecheck/jest/storybook locally — sandbox is network-restricted (`yarn install` fails with exit 144). Push the branch and open a PR; CI runs verification on GitHub.

**Preconditions you must verify before starting:**

1. Wave 2B (`integration/upstream-wave2-backend`) has merged to `main` on origin. Run:
   ```bash
   git fetch origin
   git log origin/main --oneline | grep -i "wave 2B\|Upstream wave 2B" | head -3
   ```
   You should see the merge commit. If not, STOP and report BLOCKED.

2. Wave 2B guardrail rescanners + deep review completed PASS. Check:
   ```bash
   git show origin/main:docs/ops-logs/2026-04-23-wave2b-backend-log.md | grep -E "Verdict.*PASS|Verdict.*BLOCK" | head -10
   ```
   All five verdicts (A, B, C, Deep, V5) should be PASS. Any BLOCK → STOP and report BLOCKED.

3. R1 regression fixed. Check:
   ```bash
   git log origin/main --oneline -- packages/twenty-front/src/modules/ui/theme/components/__stories__/FuseDesignScorecard.stories.tsx | head -3
   ```
   Expect a recent commit fixing `@emotion/react` + `twenty-ui/theme` imports. If the file still imports `@emotion/react`, STOP and report NEEDS_CONTEXT — R1 fix has not landed.

If all three pass, proceed.

**Working directory:** `/Users/dhruvraina/fuse-platform/.claude/worktrees/goofy-rubin-adb902`. Check out `main` fresh.

**Authoritative ledger:** `docs/fuse-upstream-patch-ledger.md`. Filter for rows where Wave column = `2C-frontend`. Count should be **126 commits** (includes the CTO reclassification of `c53a13417e` #18430 from 2D). Execute in ledger row order (chronological upstream order).

**NOT in this wave:**
- `i18n-bulk` (94 commits) — take as a separate mini-batch at the end of 2C or in its own PR.
- `2D-flags-rbac` — skip entirely; conditional wave, not scoped.

### Step 1: Branch from post-2B post-R1 main

```bash
cd /Users/dhruvraina/fuse-platform/.claude/worktrees/goofy-rubin-adb902
git fetch origin
git fetch upstream
git checkout -b integration/upstream-wave2-frontend origin/main
```

Record the base SHA: `git rev-parse HEAD` → save as `BASE_SHA` for ops log.

### Step 2: Extract the SHA list

Parse the ledger, pull SHAs where Wave = `2C-frontend`. Write to `/tmp/wave2c-shas.txt` one per line. Verify count is 126 (±5 tolerance for the CTO reclassifications). If deviation is larger, STOP and report BLOCKED.

### Step 3: Pre-cherry-pick baseline

Snapshot state before starting so you can measure:

```bash
find packages/twenty-front packages/twenty-ui -name "*.tsx" -type f | wc -l > /tmp/wave2c-pre-tsx-count.txt
find packages/twenty-front packages/twenty-ui -name "*.stories.tsx" -type f | wc -l > /tmp/wave2c-pre-stories-count.txt
grep -rln "@emotion/react\|@emotion/styled" packages/twenty-front/src packages/twenty-ui/src 2>/dev/null | wc -l > /tmp/wave2c-pre-emotion-imports.txt
```

### Step 4: Cherry-pick loop

```bash
while IFS= read -r sha; do
  echo "=== cherry-picking $sha ==="
  if ! git cherry-pick -x "$sha"; then
    echo "CONFLICT on $sha — applying rules..."
    # see conflict rules below
  fi
done < /tmp/wave2c-shas.txt
```

**Conflict resolution rules — ordered, first match wins:**

1. **Enterprise module** (`packages/twenty-server/src/engine/core-modules/enterprise/`): ABORT. Frontend commits sometimes touch enterprise controller types. Skip reason: `enterprise-module-conflict`.

2. **Partner-OS module** (`packages/twenty-server/src/modules/partner-os/`): ABORT. Skip reason: `partner-os-conflict`.

3. **Feature-flag enum / seed** (`packages/twenty-shared/src/types/FeatureFlagKey.ts`, `seed-feature-flags.util.ts`): ABORT. Skip reason: `feature-flag-boundary` (2D territory).

4. **Fuse-branded frontend files — keep Fuse version:**
   - `packages/twenty-front/src/pages/auth/SignInUp.tsx`
   - `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx`
   - `packages/twenty-front/src/pages/not-found/NotFound.tsx`
   - `packages/twenty-front/src/pages/onboarding/SyncEmails.tsx`
   - `packages/twenty-front/src/pages/settings/ai/SettingsAIPrompts.tsx`
   - `packages/twenty-front/src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts`
   - `packages/twenty-front/public/manifest.json`
   
   Rule: `git checkout HEAD -- <path>` → `git cherry-pick --continue`. Record in branded-preservations list.

5. **Fuse-added storybook/design files** — any path matching `packages/twenty-front/src/modules/ui/theme/components/__stories__/Fuse*.stories.tsx` or similar Fuse-prefixed files:
   - Keep Fuse version on conflict: `git checkout HEAD -- <path>` → continue.
   - Record in branded-preservations list.

6. **`FuseDesignScorecard.stories.tsx` specifically** (R1 file — just got fixed):
   - Upstream commits may have NEVER touched this file (it's Fuse-added), so conflicts here are unlikely. If a conflict appears, keep Fuse version and investigate — R1 fix should remain intact. Log in ops-log.

7. **Linaria / styled-components migration files** — if upstream cherry-pick reintroduces `@emotion/react` imports (rollback) that Fuse's Linaria migration already resolved, resolve in favor of the Linaria version already on our branch (i.e., prefer HEAD). Record rationale.

8. **GraphQL codegen output** (`generated-metadata/*.ts`, `schema.graphql`): favor upstream. Flag for `graphql:generate` re-run post-merge.

9. **All other frontend conflicts**: favor upstream. Resolve, `git add`, continue.

10. **Never skip hooks** (`--no-verify`).

**Progress reporting:** every 15 cherry-picks, write a line to `/tmp/wave2c-progress.log` with `<timestamp> <N>/126 successful, <M> skipped`.

### Step 5: Post-cherry-pick baseline delta

```bash
find packages/twenty-front packages/twenty-ui -name "*.tsx" -type f | wc -l > /tmp/wave2c-post-tsx-count.txt
find packages/twenty-front packages/twenty-ui -name "*.stories.tsx" -type f | wc -l > /tmp/wave2c-post-stories-count.txt
grep -rln "@emotion/react\|@emotion/styled" packages/twenty-front/src packages/twenty-ui/src 2>/dev/null | wc -l > /tmp/wave2c-post-emotion-imports.txt
```

Compute deltas:
- TSX files added = post - pre
- Stories added = post - pre  
- Emotion imports: pre and post. **If post > pre, that's a red flag** — upstream may have reintroduced Emotion somewhere the Linaria migration missed. List which files now have Emotion imports that didn't before:
  ```bash
  grep -rln "@emotion/react\|@emotion/styled" packages/twenty-front/src packages/twenty-ui/src 2>/dev/null | sort > /tmp/wave2c-post-emotion-files.txt
  ```
  Compare against a main snapshot you should have taken earlier. Flag in ops log.

### Step 6: GraphQL codegen detection

```bash
git diff origin/main...HEAD --name-only | grep -E '(\.resolver\.ts|\.dto\.ts|\.graphql$|generated-metadata/)' > /tmp/wave2c-graphql-touches.txt
wc -l /tmp/wave2c-graphql-touches.txt
```

If non-empty, PR body MUST note `graphql:generate` needs re-run post-merge.

### Step 7: Branding regression scan

After all cherry-picks, **verify branded strings are still Fuse, not reverted to Twenty:**

```bash
for f in \
  packages/twenty-front/src/pages/auth/SignInUp.tsx \
  packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx \
  packages/twenty-front/src/pages/not-found/NotFound.tsx \
  packages/twenty-front/src/pages/onboarding/SyncEmails.tsx \
  packages/twenty-front/src/pages/settings/ai/SettingsAIPrompts.tsx \
  packages/twenty-front/src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts \
  packages/twenty-front/public/manifest.json; do
    if grep -q "Twenty\|twenty\.com" "$f" 2>/dev/null; then
      echo "BRANDING-REGRESSION: $f"
    fi
  done > /tmp/wave2c-branding-check.txt
wc -l /tmp/wave2c-branding-check.txt
```

Any output = BLOCK. Branded files must not have reverted to Twenty. If triggered, STOP and report BLOCKED — something in rule #4 failed.

### Step 8: Create the ops log

Write `docs/ops-logs/2026-04-23-wave2c-frontend-log.md` matching the wave 2B format plus a `## Branding regression scan` section showing the empty output as proof. Include pre/post counts for TSX, stories, Emotion imports. List which files (if any) added new Emotion imports.

Commit:

```bash
git add docs/ops-logs/2026-04-23-wave2c-frontend-log.md
git commit -m "docs(ops): wave 2c frontend cherry-pick log"
```

### Step 9: Push branch + open PR

```bash
git push -u origin integration/upstream-wave2-frontend
# Pass --repo explicitly; gh infers twentyhq/twenty from the upstream remote otherwise.
gh pr create --repo fuse-gtm/fuse-v1 --base main --head integration/upstream-wave2-frontend \
  --title "Upstream wave 2C — frontend bugfixes" \
  --body "$(cat <<'PRBODY'
## Summary

Cherry-picks the `2C-frontend` commits from the wave-2 upstream backlog per `docs/fuse-upstream-patch-ledger.md` — bugfixes and UX improvements across `packages/twenty-front/` and `packages/twenty-ui/`. Enterprise module, partner-os module, and feature-flag enum/seed are all hands-off; any conflict in those dirs was aborted and recorded as skipped for CTO manual review.

## Per-cherry-pick provenance

Each commit retains its upstream SHA via `-x`. See `docs/ops-logs/2026-04-23-wave2c-frontend-log.md` for full cherry-pick attempt log, skipped commits with reasons, conflict resolutions, branded-file preservations, branding regression scan results, and GraphQL codegen status.

## Branding sovereignty

All 7 Fuse-branded files (SignInUp, FooterNote, NotFound, SyncEmails, SettingsAIPrompts, getTimelineActivityAuthorFullName, manifest.json) verified post-cherry-pick to still say "Fuse" not "Twenty". Verified via grep — see ops log §Branding regression scan.

## Verification

- Local lint / typecheck / jest / storybook: **deferred to CI** (sandbox network-restricted).
- CI required to run:
  - `npx nx build twenty-shared` + `npx nx build twenty-front`
  - `npx nx lint:diff-with-main twenty-front`
  - `npx nx typecheck twenty-front`
  - `npx nx test twenty-front`
  - `npx nx run twenty-front:graphql:generate` (verify zero diff)
  - `npx nx run twenty-front:graphql:generate --configuration=metadata` (same)
  - `npx nx storybook:build twenty-front`
- Guardrail rescanners (telemetry, partner-os surface, feature-flag drift) will be dispatched post-push by the orchestrator.
- Deep file reviewer will run post-push before merge approval.

## Test plan

- [ ] CI green — lint, typecheck, tests, graphql-codegen zero-diff, storybook build
- [ ] Telemetry guardrail rescanner CLEAN against baseline
- [ ] Partner-os surface diff = 0 lines
- [ ] Feature-flag guardrail: `IS_PARTNER_OS_ENABLED` still in enum; enum not moved
- [ ] Deep file reviewer approves
- [ ] Preview deploy smoke: sign-in, partner-os dashboard, settings pages load
- [ ] Visual smoke on branded surfaces: SignInUp shows "Welcome to Fuse", FooterNote shows "By using Fuse"
- [ ] If emotion-imports delta > 0: investigate each new file listed in ops log

🤖 Generated with [Claude Code](https://claude.com/claude-code)
PRBODY
)"
```

### Step 10: Report back

Structure:
- Branch name + final SHA
- PR URL
- Cherry-pick counts: attempted / successful / skipped
- Skipped list: SHA + reason (categorize by rule)
- Branded-file preservations: SHA + file
- Branding regression scan: PASS (empty) or list of files
- Emotion imports delta: pre → post
- GraphQL touches: count + file list
- Top 5 most interesting commits
- Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

**Absolute constraints:**
- Do not commit to `main`.
- Do not commit to `claude/goofy-rubin-adb902`.
- Do not touch `packages/twenty-server/src/modules/partner-os/` or `packages/twenty-server/src/engine/core-modules/enterprise/` outside of aborted cherry-picks.
- Do not touch `packages/twenty-shared/src/types/FeatureFlagKey.ts` or `seed-feature-flags.util.ts`.
- Do not use `--no-verify` on commits.
- Do not use `git push --force`.
- Do not delete branches.
- Do not invoke `gh pr merge`.
- **If you skip >20 commits (16% of wave)**, STOP and report BLOCKED — high skip rate signals misclassification or base-branch drift.
- **If branding regression scan shows ANY output**, STOP and report BLOCKED — branded-file preservation rule failed.
- **If post-wave Emotion imports count > pre-wave count**, DO NOT block. Record the delta in ops log and flag in PR body for deep reviewer to assess.

---

## Notes on why this prompt is structured this way

- **Step 3/5 Emotion-imports delta** catches upstream accidentally reintroducing `@emotion/react` imports that Fuse's Linaria migration already resolved. If post > pre, something regressed.
- **Step 7 branding scan** is the wave 2C equivalent of the partner-os surface check in 2B — a proof-of-invariant. The 7 branded files were verified at baseline; we assert they stay branded after the wave.
- **R1 precondition** is new to 2C because frontend cherry-picks are the first thing that re-triggers the `FuseDesignScorecard.stories.tsx` typecheck failure. R1 must be fixed before 2C CI is meaningful.
- **Skip cap at 20** is lower than 2B's 30 because 2C is a smaller wave (126 vs 231); same 16% threshold.
- **i18n-bulk split out** keeps the main wave 2C PR focused on behavioral fixes. i18n churn can be its own mini-PR afterwards.
