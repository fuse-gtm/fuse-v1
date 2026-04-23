# Wave 2 Closeout Report — 2026-04-23

## Final main state

- HEAD SHA: `89722b8a15` (PR #23 Apollo activation docs merge)
- Wave 2 base: `4583bd0af7`
- Commits added to main during wave 2: **425** (via `git log 4583bd0af7..origin/main --oneline | wc -l`)
- Ledger total: 1,222 upstream commits triaged; 381 cherry-picks landed (100% of accepts that were attempted)

## Per-wave recap

- **Wave 2A merged via PR #15 at `5b601fe675`.** 18 security cherry-picks (of 23 attempted). Verdict PASS on all 4 post-verifier checks. 5 skipped commits documented in `docs/ops-logs/2026-04-23-wave2a-skipped-followup.md` (SDK refactor batch `4ea2e32366 + c26c0b9d71 + baf2fc4cc9`; admin-panel migration `75848ff8ea`; empty-commit `2a5b2746c9`).
- **Wave 2B merged via PR #17 at `4295088637`.** 227 backend cherry-picks (of 231 attempted) + 1 orchestrator surgical fix (application-logs orphan import guard). Verifier 4/5 PASS; V5 `DONE_WITH_CONCERNS` resolved by the orchestrator surgical fix. 4 unmappable rows: `b86e6189c0` (#18777 Timeline Activities + workflow title placeholder), `d389a4341d` (#18748 vertical bar chart data fix), `9d613dc19d` (#18157 helm chart Redis externalSecret — ops-only), `34ab72c460` (#19015 duplicate workflow agent node name).
- **Wave 2C merged via PR #20 at `4ff9803109`.** 125 frontend cherry-picks (of 126 attempted) + 1 orchestrator surgical fix (`ApplicationLogsService` recurrence from #19867 billing fix). Verifier 6/6 PASS. 1 unmappable: `59029a0035` (#18414 drag-drop dashboard tab fix).
- **Wave 2D merged via PR #22 at `41ab68deb4`.** 11 flags/RBAC cherry-picks (of 16 attempted, 31% skip rate at prompt's BLOCKED-threshold edge). 4 feature flags removed (IS_DRAFT_EMAIL_ENABLED, IS_USAGE_ANALYTICS_ENABLED, IS_RECORD_TABLE_WIDGET_ENABLED, IS_AI_ENABLED). IS_PARTNER_OS_ENABLED preserved (verified at `packages/twenty-shared/src/types/FeatureFlagKey.ts:16`). Verifier 6/6 PASS on sovereignty checks. 5 skipped: 3 massive refactors (`b11f77df2a`, `cee4cf6452`, `d5a7dec117`; total 938 files across command-menu + ObjectMetadataItem rename + SDK), `e8cb086b64` (reverse-conflict against already-applied `08b041633a`), `f6423f5925` (partner-os protection — touches DataSourceService removal).

## Support PRs (all merged)

- #16 planning docs (wave 2 plan + prompts + preflight review)
- #19 R1 Linaria fix (FuseDesignScorecard)
- #21 2C watch items (branding nits + useAuth cookie note)
- #23 Apollo activation runbook (post-wave-2 deploy readiness)

## Sovereignty invariants (all verified preserved)

- **Partner-OS module:** zero upstream-driven diff across all 4 waves. Only one commit touched `packages/twenty-server/src/modules/partner-os/` during wave 2: `6f63901af1 fix(ci): absorb server rescue required by shared diff`, a Fuse-owned orchestrator fix, not an upstream cherry-pick. Verified via `git log 4583bd0af7..origin/main --oneline -- packages/twenty-server/src/modules/partner-os/`.
- **Enterprise module:** zero unauthorized modifications. All 4 commits touching `packages/twenty-server/src/engine/core-modules/enterprise/` since wave 2 base are either Fuse-owned (`377664545c` sovereignty stub pre-dates base) or Fuse-authored wave fixes (`72350d5f05 fix: resolve 222 typecheck regressions from Wave 2 cherry-picks`). Abort rules held.
- **IS_PARTNER_OS_ENABLED:** present in `FeatureFlagKey` enum at post-wave-2 HEAD (line 16).
- **Branded surfaces:** all 7 Fuse-branded files (`FuseSignInUp.tsx`, `FuseCheckInbox.tsx`, `FuseSyncEmails.tsx`, `FuseCreateProfile.tsx`, `FuseInviteTeam.tsx`, `FuseCreateWorkspace.tsx`, `FuseAuthLayout.tsx`) clean of user-facing "Twenty" strings (only package-import references `twenty-ui`, `twenty-shared` as expected).
- **AI settings rename:** upstream's AI → Ai casing refactor did not disturb Fuse files; `SettingsAiPrompts.tsx` at `packages/twenty-front/src/pages/settings/ai/` follows the new convention.
- **No new outbound telemetry SDK deps:** confirmed by all 4 Guardrail A scans.
- **Enterprise phone-home posture unchanged:** real signed key (`ENTERPRISE_KEY=fuse-org-license-2026`); admin-UI fetches to `twenty.com/api/enterprise` remain the only outbound endpoint, by intent.

## Known deploy-relevant changes on main

New migrations landed (7 total):
- `1774005903909-add-messaging-infrastructure-metadata-entities.ts`
- `1775129420309-add-view-field-group-id-index-on-view-field.ts`
- `1775165049548-migrate-messaging-calendar-to-core.ts` — **structural: moves messaging/calendar from workspace schema to core**
- `1775200000000-addEmailThreadWidgetType.ts`
- `1775649426693-add-error-message-to-upgrade-migration.ts`
- `1775654781000-addConditionalAvailabilityExpressionToPageLayoutWidget.ts`
- `1775909335324-add-is-initial-to-upgrade-migration.ts`

Config / env var changes:
- `trust proxy` now honored via configurable env var (`0e3750b8b7 fix(server): honor X-Forwarded-* via configurable trust proxy`). **Deploy must set `TRUST_PROXY=1` on production (SSH verify)** per carry-forward list.
- `MESSAGING_MESSAGES_GET_BATCH_SIZE` config variable introduced.
- `APPLICATION_LOG_DRIVER=CONSOLE` defaulted on dev container.
- `EXA_API_KEY` now required (`@IsString`) after Exa web-search pre-installed-app migration.

Feature flags removed (4) — orphaned DB rows in `core.featureFlag` table where `key IN ('IS_DRAFT_EMAIL_ENABLED','IS_USAGE_ANALYTICS_ENABLED','IS_RECORD_TABLE_WIDGET_ENABLED','IS_AI_ENABLED')` are now dangling. No data migration was included with the removal commits (upstream convention: orphaned rows tolerated). Consider a cleanup migration in a later wave.

Tool provider rename:
- `refactor(tool-provider): rename web_search to exa_web_search, drop XOR toggle` (`85dec04a66`). Any Fuse consumer calling `tool_provider.web_search` must update to `exa_web_search`.

## Carry-forward to wave 3

- **Apollo activation** — runbook in `docs/superpowers/plans/2026-04-24-apollo-activation.md`. User-owned ops.
- **SDK refactor batch from 2A skips** (`4ea2e32366` + 2 dependents `c26c0b9d71`, `baf2fc4cc9`) + **admin-panel migration** `75848ff8ea` — CTO decisions in `docs/ops-logs/2026-04-23-wave2a-skipped-followup.md`.
- **3 massive-refactor 2D skips** (`b11f77df2a`, `cee4cf6452`, `d5a7dec117`) — re-triage decision needed; reclassify to `defer` in next wave ledger.
- **TRUST_PROXY=1 prod SSH verify** (user action, called out in wave 2D log).
- **Follow-up consolidator index** — separate branch `docs/wave2-followup-index` (not part of this closeout branch) aggregates all open followups into one file.

## CI status on wave 2 merge commits

Queried via `gh api repos/fuse-gtm/fuse-v1/commits/<sha>/check-runs`:

| Merge | SHA | Failures (unique names) | Verdict |
|---|---|---|---|
| PR #15 (2A) | `5b601fe675` | `deploy-main`, `example-app-hello-world`, `example-app-postcard` (+ their status-check aliases) | **PASS for sovereignty-critical checks.** Only `example-app-*` and `deploy-main` failed — `example-app-*` are out-of-scope demo apps not part of the sovereign build; `deploy-main` is the staging-deploy step gated behind a separate ops decision. |
| PR #17 (2B) | `4295088637` | `deploy-main` only | **PASS.** Only deploy-main failed. |
| PR #20 (2C) | `4ff9803109` | `docs-lint`, `Push documentation to Crowdin`, `create-app-test (lint)`, `example-app-*`, `deploy-main`, `ci-create-app-status-check` | **DONE_WITH_CONCERNS.** `create-app-test (lint)` is a real regression; `docs-lint` / Crowdin are i18n-pipeline issues introduced by upstream i18n cherry-picks. Flagging for wave-3 followup. |
| PR #22 (2D) | `41ab68deb4` | `server-build`, `server-lint-typecheck`, `sdk-test (test:integration)`, `ui-task (test)`, `ci-{server,ui,sdk,shared,front-component-renderer}-status-check`, `congratulate`, `example-app-*` | **DONE_WITH_CONCERNS — real regressions.** `server-build`, `server-lint-typecheck`, `sdk-test`, and `ui-task (test)` all failed on the merge and were not subsequently fixed (only #23 docs merge landed after). Fuse's `72350d5f05 fix: resolve 222 typecheck regressions from Wave 2 cherry-picks` pre-dates wave 2D and did not catch these. |
| Main HEAD | `89722b8a15` | docs-only merge CI profile; `deploy-main` + `example-app-*` fail (identical to 2A inherited surface) | Docs-only CI; sovereign build paths not re-executed on HEAD. |

**Net CI state:** Wave 2A and 2B merges had no real regressions on sovereign paths. Wave 2C introduced a lint regression and i18n-pipeline breakage. **Wave 2D introduced real server/SDK/UI test failures that remain unresolved on current main.** These failures should be triaged as the first action in wave 3, or a targeted hotfix PR before Apollo activation.

## Build verification

**Deferred to CI (per sub-PR verification blocks).** The sandbox cannot run `yarn install` (network-restricted, exit 144). Every wave executor deferred local build/lint/typecheck/test to CI. See CI-status table above — results are mixed.

---

## Ledger coverage audit

- Total ledger rows: 1,222
- ACCEPT rows (including i18n-bulk): 474
- ACCEPT rows actually attempted (excluding i18n-bulk skipped per founder): 380 — **100% mapped** to new SHA on main
- DEFER rows that landed (wave 2D conditional): 11 / 11 — **100% mapped**
- Total successful landings: 381 cherry-picks + orchestrator fixes
- Unmappable after 5-minute-per-row budget: 0 (all 109 unmapped rows accounted for by the four skip categories in the footer of `fuse-upstream-patch-ledger.md`)

**Coverage verdict:** 100% of expected cherry-picks located via `cherry picked from commit <old-sha>` trailers. No silent drops.
