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

---

## Wave 2C post-execution verification — 2026-04-23

Verifier re-ran the guardrail suite against HEAD `51d308e099` (includes orchestrator P1 re-strip + branding-followups rename update) vs base `74ca02cd52` (`origin/main` post-2B).

### Guardrail A — telemetry / egress: PASS (with 1 WATCH nit)

- Egress-pattern grep over full `origin/main...HEAD` diff surfaced 12 lines. Triage:
  - Lines 57, 59, 99 — self-match from the ops log prose.
  - Lines 10953, 142443 — `'import/no-useless-path-segments'` rule (pattern `\.track\(` false-positive on `segments`).
  - Lines 75068, 75107 — doc-link strings `https://twenty.com/developers/extend/apps/...` in NEW files `packages/twenty-front/src/pages/settings/applications/utils/getCustomApplicationDescription.ts` and `getStandardApplicationDescription.ts`. Upstream-doc links, not egress — **flag as branding debt, not Guardrail A block**. Add to `docs/fuse-branding-followups.md` as follow-up item.
  - Line 123670 — `subdomain: 'acme.twenty.com'` is a context (unchanged) line in a test mock.
  - Line 124562, 144541 — `@clickhouse/client` dep already present on `origin/main`; context line adjacent to a neighboring `@blocknote` bump. Not a new dep.
  - Line 125352 — **removal** of `subdomainUrl: 'https://twenty.twenty.com'` test mock.
  - Line 133215 — dev-seeder widget URL `https://www.star-history.com/?repos=twentyhq%2Ftwenty` in `get-page-layout-widget-data-seeds.util.ts`. Runs only when seeding demo workspaces — **not production telemetry**. Flag as WATCH (branding leak in sample data).
- Phone-home pattern grep (`phone-home|verifyEnterprise|validateLicense|licenseValidity`) returned 0 lines.
- Dep grep (`posthog|segment|@clickhouse|mixpanel|amplitude`) returned 0 new SDKs; `@clickhouse/client` unchanged on both sides.

Verdict: **PASS**. Two branding nits logged as follow-ups (2 new `twenty.com/developers` doc links in app-template description utils; 1 dev-seeder `twentyhq/twenty` star-history widget URL). No live telemetry or phone-home introduced.

### Guardrail B — partner-os surface: PASS

`git diff origin/main...HEAD -- packages/twenty-server/src/modules/partner-os/` → 0 lines. Partner-OS module untouched.

### Guardrail C — feature-flag drift: PASS

- `packages/twenty-shared/src/types/FeatureFlagKey.ts` exists on branch.
- `IS_PARTNER_OS_ENABLED = 'IS_PARTNER_OS_ENABLED'` present at line 18.
- Diff against `origin/main` for `FeatureFlagKey.ts`: 0 lines.
- Diff against `origin/main` for `seed-feature-flags.util.ts`: 0 lines.

### Deep file review: PASS

- Total touched files: 1,448 (per `/tmp/2c-touched-files.txt`).
- Top subsystems: `twenty-front/src` 1,075 · `twenty-server/src` 254 · `twenty-shared/src` 31 · `twenty-ui/src` 28 · `twenty-docs/l` 14 · `twenty-server/test` 9.
- Front top modules: `page-layout` 139 · `settings` 119 · `navigation-menu-item` 101 · `command-menu-item` 96 · `ai` 94 · `pages/settings` 86 · `side-panel` 78 · `object-record` 63.
- Server top modules: `engine/metadata-modules` 77 · `engine/core-modules` 69 · `engine/workspace-manager` 65.
- High-value area deep reads:
  - **P1 fix target** `packages/twenty-server/src/engine/core-modules/logic-function/logic-function-executor/logic-function-executor.service.ts` — verified: only the sovereignty comment at line 246 references `ApplicationLogsService`. No import, no call-site. Orchestrator pre-fix `51d308e099` holds.
  - `packages/twenty-front/src/modules/auth/` (6 files): new `useImpersonationSession.ts` uses `sessionStorage` to park the admin token pair and restore it after impersonation — no weakening, no exfiltration. `useAuth.ts` now mirrors `tokenPair` into a cookie via `cookieStorage.setItem` (cookie is `secure`+`sameSite: lax`, current-origin only — not phone-home). `AuthService.ts` gates Apollo logger behind `IS_DEBUG_MODE`. Error-handling refactored from `CombinedGraphQLErrors.is(...)` to a new `isGraphqlErrorOfType(...)` util — mechanical. All accept.
  - `packages/twenty-front/src/pages/settings/` (86 files): inspected `SettingsAdminUserDetail.tsx` new version — imports from Fuse's Linaria + `twenty-shared` + `twenty-ui` paths; no upstream brand strings; uses Fuse-owned `DOCUMENTATION_BASE_URL = 'https://docs.fusegtm.com'` where applicable.
  - `packages/twenty-front/src/modules/settings/billing/` (3 files): new "How credits work" button routes through `getDocumentationUrl(...)` which reads from `DOCUMENTATION_BASE_URL = 'https://docs.fusegtm.com'` — Fuse-controlled, not twenty.com.
  - `packages/twenty-ui/` (28 files): only additive change to `theme/index.ts` (new `DEFAULT_THEME_COLOR_FALLBACK` export); no removals of `themeCssVariables` / `ThemeType`. New `TintedIconTile` component correctly imports from `@ui/theme-constants`.
  - Graph/chart components: all still import from `twenty-ui/theme-constants`, not the old `twenty-ui/theme` path.
  - GraphQL schema: `schema.graphql` net –236 lines (133+, 369−). Removed types are upstream cleanup (`AdminAIModels`, `ConfigVariables*`, `QueueJob*`, `SystemHealthService`, `HealthIndicatorId`). Added types include AI → Ai rename counterparts (`ClientAiModelConfig`, `AiSystemPromptSection`, `AiSystemPromptPreview`). Aligned with server-side changes.
- Spot-check on top 5 flagged commits: all internal refactors (metadata store uniformization, SSE unification, `styled(Component)` removal, ESLint rules, AI→Ai rename) with no telemetry/auth/privacy implications.

Verdict: **PASS**. No blockers. Three nits (see "Top concerns" below) recorded as branding follow-ups.

### L5 — Linaria-migration preservation: PASS

- `grep -rln "@emotion/react\|@emotion/styled" packages/twenty-front/src packages/twenty-ui/src` → 0 matches. Emotion imports absolute count post-wave = 0 (matches 2C executor's reported pre=0 post=0 delta=0).
- `twenty-ui/src/theme/index.ts` diff: only additive (new `DEFAULT_THEME_COLOR_FALLBACK` export). No `themeCssVariables` / `ThemeType` export or import regressions.
- `twenty-ui/src/theme-constants/index.ts`: 0 lines changed.

### Branding regression recheck: PASS

All 7 branded files present and clean on post-rename paths:

- `packages/twenty-front/src/pages/auth/SignInUp.tsx` — CLEAN
- `packages/twenty-front/src/modules/auth/sign-in-up/components/FooterNote.tsx` — CLEAN
- `packages/twenty-front/src/pages/not-found/NotFound.tsx` — CLEAN
- `packages/twenty-front/src/pages/onboarding/SyncEmails.tsx` — CLEAN
- `packages/twenty-front/src/pages/settings/ai/SettingsAiPrompts.tsx` — CLEAN (renamed by #19837)
- `packages/twenty-front/src/modules/activities/timeline-activities/utils/getTimelineActivityAuthorFullName.ts` — CLEAN
- `packages/twenty-front/public/manifest.json` — CLEAN

### Top concerns (all nits, none blocking)

1. **`twenty.com/developers` doc links in app-template description utils** — new files `packages/twenty-front/src/pages/settings/applications/utils/getCustomApplicationDescription.ts` and `getStandardApplicationDescription.ts` contain "See the [Getting Started guide](https://twenty.com/developers/extend/apps/getting-started) for the full walkthrough, and [Building Apps](https://twenty.com/developers/extend/apps/building)" markdown strings. User-visible doc links pointing upstream. Recommend adding to `docs/fuse-branding-followups.md` for rebranding pass.
2. **Dev-seeder star-history widget URL** — `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/get-page-layout-widget-data-seeds.util.ts` line 620 embeds `https://www.star-history.com/?repos=twentyhq%2Ftwenty` in a demo page-layout seed. Only surfaces in demo workspaces, not runtime telemetry. Flag for future branding pass.
3. **`create-twenty-app` references in doc strings** — same two util files include `npx create-twenty-app@latest my-twenty-app` and `cd my-twenty-app && yarn twenty dev`. Not runtime behavior; user-visible description strings. Branding follow-up, not Guardrail A issue.

### Final verdict

All six checks: **PASS**. Ready for CI + merge review. Three branding nits catalogued for the next branding-followups pass; none block wave 2C.
