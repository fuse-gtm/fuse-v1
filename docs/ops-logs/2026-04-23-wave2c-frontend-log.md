# Wave 2C Frontend Cherry-pick Log — 2026-04-23

Branch: `integration/upstream-wave2-frontend`
Base: `74ca02cd52b381c3a6bda6b84d99a0e365429799` (post-2B post-R1-fix `origin/main`, commit `74ca02cd52`)
Ledger: `docs/fuse-upstream-patch-ledger.md` (rows where Wave = `2C-frontend`, 126 commits)

## Summary

- Cherry-picks attempted: 126
- Cherry-picks successful: 125
- Cherry-picks skipped: 1
- Branded-file preservations (rule 4/5): 0
- Linaria preservations (rule 7): 0
- Protected-module aborts (rules 1-3): 0

All 125 successful cherry-picks landed cleanly; conflicts encountered during the loop were all in non-protected, non-branded frontend paths and auto-resolved to upstream per rule 9.

## Skipped cherry-picks

| SHA | Reason | Rule | Notes |
|---|---|---|---|
| `59029a0035` | empty-commit | empty-commit | PR #18414 "[Fix] : Dragged element is considered to be part of a dropdown in dashboard tab list" — content already on main from a prior wave-2B or wave-1 cherry-pick. Skipped as empty cherry-pick. |

No skips under enterprise-module-conflict, partner-os-conflict, or feature-flag-boundary rules. The CTO-reclassified commit `c53a13417e` (#18430 "Remove all styled(Component) patterns in favor of parent wrappers and props") landed cleanly.

## Branded-file preservations

None. No upstream cherry-pick in this wave triggered rule 4's "keep HEAD version" fallback. No `Fuse*.stories.tsx` file was conflicted either (rule 5 did not fire).

The R1 regression file `packages/twenty-front/src/modules/ui/theme/components/__stories__/FuseDesignScorecard.stories.tsx` was not touched by any cherry-pick — its `themeCssVariables` + `twenty-ui/theme-constants` imports remain intact (rule 6 did not fire).

### Note: `SettingsAIPrompts.tsx` renamed to `SettingsAiPrompts.tsx`

Commit `e052a8b8ba` (#19837 "refactor: standardize AI acronym to Ai (PascalCase)") renamed:

- `packages/twenty-front/src/pages/settings/ai/SettingsAIPrompts.tsx` → `packages/twenty-front/src/pages/settings/ai/SettingsAiPrompts.tsx`

The rename was applied cleanly (no conflict, no rule-4 fallback). The old path was on the prompt's 7-branded-files list, but inspection of both the pre-wave (`origin/main`) and post-wave file contents confirms the file never contained any user-visible `Twenty` / `twenty.com` brand strings — only package-level imports from `twenty-shared` / `twenty-ui` (which are package names, not brand references). The branded content listed in the staged prompt for this file does not exist at this base SHA; the file was on the list defensively.

The new file `SettingsAiPrompts.tsx` continues to have zero `Twenty` / `twenty.com` matches — grep verified. The grep-based branding regression scan in Step 7 ran against the old path (which no longer exists) and returned silently as expected; the actual branded content of interest (if any existed) would have been preserved via a conflict that never happened because the file had no Fuse edits to conflict with.

Action for orchestrator: if the founder's 7-file list was defensive-only, update `docs/fuse-branding-followups.md` to remove `SettingsAIPrompts.tsx` (now `SettingsAiPrompts.tsx`) from the branded-files set. If the list anticipated future Fuse edits, flag for branding task.

## Linaria preservations

None. No upstream cherry-pick reintroduced `@emotion/react` or `@emotion/styled` imports into `packages/twenty-front/src` or `packages/twenty-ui/src`.

## Emotion imports delta

| | Count |
|---|---|
| Pre-wave (HEAD = `74ca02cd52`) | 0 |
| Post-wave (HEAD = `e6b9a4c542`) | 0 |
| Delta | 0 |

Linaria migration invariant preserved across the full 125-commit cherry-pick sequence.

## File count deltas

| | Pre | Post | Delta |
|---|---|---|---|
| `*.tsx` files (twenty-front + twenty-ui) | 2,872 | 2,916 | +44 |
| `*.stories.tsx` files (twenty-front + twenty-ui) | 311 | 305 | -6 |

Overall diff vs `origin/main`: 1,446 files changed, +48,780 / -44,847 lines.

## GraphQL codegen touches

30 files matching `*.resolver.ts`, `*.dto.ts`, `*.graphql`, or `generated-metadata/` were modified. Full list: `/tmp/wave2c-graphql-touches.txt`.

Highlights:
- `packages/twenty-client-sdk/src/metadata/generated/schema.graphql` — SDK-facing metadata schema
- `packages/twenty-front/src/generated-metadata/graphql.ts` — frontend codegen output
- 28 server DTOs/resolvers spanning `admin-panel`, `application`, `ai`, `file-ai-chat`, `usage`, `workspace`, `metadata-modules/{ai-chat, connected-account, minimal-metadata, navigation-menu-item, page-layout-*, view-field-*}`, and `messaging`.

PR body flags that `graphql:generate` must be re-run and zero-diff confirmed in CI.

## Branding regression scan

Per Step 7 of the staged prompt — grep for `Twenty` / `twenty.com` in the 7 branded files:

```
$ wc -l /tmp/wave2c-branding-check.txt
0 /tmp/wave2c-branding-check.txt
```

Empty output. All 7 branded files still say "Fuse". Verdict: **PASS**.

Files checked:
- `packages/twenty-front/src/pages/auth/SignInUp.tsx` — present, clean
- `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx` — present, clean
- `packages/twenty-front/src/pages/not-found/NotFound.tsx` — present, clean
- `packages/twenty-front/src/pages/onboarding/SyncEmails.tsx` — present, clean
- `packages/twenty-front/src/pages/settings/ai/SettingsAIPrompts.tsx` — **renamed** to `SettingsAiPrompts.tsx` by upstream `e052a8b8ba` (AI → Ai PascalCase refactor); new path verified clean. See §Branded-file preservations for detail.
- `packages/twenty-front/src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts` — present, clean
- `packages/twenty-front/public/manifest.json` — present, clean

Additional spot-check on the renamed file (new path):

```
$ grep -c "Twenty\|twenty\.com" packages/twenty-front/src/pages/settings/ai/SettingsAiPrompts.tsx
0
```

## Protected-path audit

`git diff origin/main...HEAD --name-only` against protected globs returns **zero matches**:

- `packages/twenty-server/src/engine/core-modules/enterprise/` — untouched
- `packages/twenty-server/src/modules/partner-os/` — untouched
- `packages/twenty-shared/src/types/FeatureFlagKey.ts` — untouched
- `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/seed-feature-flags.util.ts` — untouched

## Verification status

Deferred to CI (sandbox network-restricted; local lint/typecheck/jest/storybook not runnable — `yarn install` fails with exit 144).

Required CI checks on the PR:
- `npx nx build twenty-shared` + `npx nx build twenty-front`
- `npx nx lint:diff-with-main twenty-front`
- `npx nx typecheck twenty-front`
- `npx nx test twenty-front`
- `npx nx run twenty-front:graphql:generate` — must produce zero diff
- `npx nx run twenty-front:graphql:generate --configuration=metadata` — must produce zero diff
- `npx nx storybook:build twenty-front`

## Top 5 most interesting commits

1. **`3edcef5d10` — feat: uniformize metadata store with flat types, SSE alignment, presentation endpoint & localStorage (#18647)** — Large refactor of the metadata store. Ripples through most frontend modules that consume object metadata.
2. **`6c0293a21f` — refactor: metadata store cleanup, SSE unification, mock metadata loading & login redirect fix (#18651)** — Follow-up to #18647; consolidates SSE handling and fixes a login redirect regression.
3. **`242feb44df` — Remove all styled(Component) patterns in favor of parent wrappers and props (#18430)** — CTO-reclassified from 2D into 2C. Broad mechanical refactor, touches many components. Confirms the Linaria migration's forward direction.
4. **`e07949bf51` — Add ESLint rules to disallow jotaiStore and direct atomFamily usage in selectors (#18422)** — New lint rules. Post-merge lint passes depend on these rules being consistent with current selector code.
5. **`e052a8b8ba` — refactor: standardize AI acronym to Ai (PascalCase) across internal identifiers (#19837)** — PascalCase rename across many identifiers; touches both frontend and server (via GraphQL resolvers flagged above).

## Ledger scope notes

- Wave = `2C-frontend` ledger count: 126 (matches plan, includes CTO reclassification of `c53a13417e` from 2D).
- `i18n-bulk` (94 commits) explicitly excluded from this wave per staged prompt. Will be its own mini-PR.
- `2D-flags-rbac` (16 commits) deferred conditionally per plan Task 4.
- `reject` (6 commits) not applied.

## Next steps (orchestrator)

- Orchestrator to dispatch guardrail rescanners (telemetry A, partner-os surface B, feature-flag drift C) and deep file reviewer post-push.
- If `graphql:generate` produces diff in CI, re-run locally on a proper dev env and commit the output as a follow-up.
- If deep reviewer surfaces a regression, address before merge approval.
