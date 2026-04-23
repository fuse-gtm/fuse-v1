# Wave 2B Backend Cherry-pick Log — 2026-04-23

Branch: `integration/upstream-wave2-backend`
Base: `18c6ffb35e28983e4dbf1d44fa611ce76430f84c` (post-2A main, commit `18c6ffb35e`)
Ledger: `docs/fuse-upstream-patch-ledger.md` (rows where Wave = `2B-backend`)

## Summary

- Cherry-picks attempted: 231
- Cherry-picks successful: 227
- Cherry-picks skipped: 4
- Conflicts auto-resolved (via rules 4-7): 55

## Skipped cherry-picks

All 4 skips were empty commits — the upstream SHA was a rollup whose content had already arrived via a prior cherry-pick in the same wave. No sovereignty-protected paths were conflicted.

| SHA | Reason | Rule |
|---|---|---|
| `b86e6189c0` | empty-commit-already-applied (Remove position from Timeline Activities + fix workflow title placeholder #18777) | empty-commit |
| `d389a4341d` | empty-commit-already-applied (Vertical bar charts data range fix #18748) | empty-commit |
| `9d613dc19d` | empty-commit-already-applied (Improve helm chart + linting + Redis externalSecret #18157) | empty-commit |
| `34ab72c460` | empty-commit-already-applied (Fix duplicate workflow agent node names #19015) | empty-commit |

No skips under enterprise-module-conflict, partner-os-conflict, or feature-flag-boundary rules.

## Conflicts resolved (branded / logic)

Full per-file log: `/tmp/wave2b-conflict.log` (55 cherry-picks involved conflict resolution, 0 branded-file preservations).

No branded frontend files (SignInUp.tsx, FooterNote.tsx, NotFound.tsx, SyncEmails.tsx, SettingsAIPrompts.tsx, getTimelineActivityAuthorFullName.ts, manifest.json) were encountered in this wave — expected, since wave 2B is backend-scoped.

Conflicts in cherry-picks 2B resolved by favoring upstream (`--theirs`) per rules 5-7:
- Migrations / core.datasource / upgrade-command files (multiple commits)
- GraphQL resolvers, DTOs, generated-metadata
- Workflow version-step, workspace-iterator, credit-cap gating
- Backend logic-vs-logic where Fuse had no divergent edit

## Schema surface deltas

- Migrations added: **-1** (183 → 182). Four upstream migrations were intentionally removed by "Prepare 1.21 (#19501)" and "chore: remove registeredCoreMigration (#19376)" as upstream consolidation; three new migrations replace them. Net: -1. This matches upstream's 1.21 release state.
  - Removed: `1773945207801-add-messaging-infrastructure-metadata-entities.ts`, `1775129420309-add-view-field-group-id-index-on-view-field.ts`, `1775165049548-migrate-messaging-calendar-to-core.ts`, `1775200000000-addEmailThreadWidgetType.ts`
  - Added: `1774005903909-add-messaging-infrastructure-metadata-entities.ts` (renamed from 1773945207801 — upstream fix to restore original timestamp), `1775649426693-add-error-message-to-upgrade-migration.ts`, `1775909335324-add-is-initial-to-upgrade-migration.ts`
- Most recent migration pre: `1775553825848-add-workspace-id-to-upgrade-migration.ts`
- Most recent migration post: `1775909335324-add-is-initial-to-upgrade-migration.ts`
- **Out-of-order NEW migrations: `1774005903909-add-messaging-infrastructure-metadata-entities.ts`** (timestamp 1774005903909 is lower than the pre-wave last-applied 1775553825848). TypeORM tracks applied migrations individually so this will still run on new installs; flagged here because the upstream authors themselves noted "restore original migration timestamp" in #18810.
- Entity files added: 0 (no `.entity.ts` net change)
- GraphQL schema / resolver / DTO touches: **39 files** (see `/tmp/wave2b-graphql-touches.txt`)

## Verification status

Deferred to CI (sandbox network-restricted; local lint/typecheck/test/migration-dry-run not runnable).

Required CI checks on the PR:
- `NODE_OPTIONS="--max-old-space-size=8192" npx nx lint:diff-with-main twenty-server`
- `npx nx typecheck twenty-server`
- `npx nx test twenty-server`
- `npx nx run twenty-server:test:integration:with-db-reset`
- `npx nx database:reset twenty-server && npx nx run twenty-server:database:migrate:prod` (migration dry-run on scratch DB — validates the out-of-order migration above)
- `npx nx run twenty-front:graphql:generate` — must produce zero diff (39 GraphQL-touching files)

## Guardrail A — telemetry scan (post-wave-2B) — PASS

Scans run against `git diff origin/main...integration/upstream-wave2-backend` (2,689 files, 209,611 lines).

- Egress patterns (`twenty.com|twentyhq|clickhouse|posthog|segment|mixpanel|amplitude|\.track\(|analytics\.(track|identify|page)`): 475 hits — all classified OK. Breakdown:
  - README/docs cosmetic links to `twenty.com`, `docs.twenty.com`, `discord.gg`: safe (branding will be covered by follow-up task).
  - `twentyhq/twenty` → GitHub repo references in the new GitHub-connector example app (dev docs only).
  - `segment` hits → the Resend-audience "segment" domain object and the new upgrade-sequence "workspace segment" terminology; neither is the Segment analytics SDK.
  - `workspace.twenty.com` → OAuthDiscoveryController test fixture hostname.
  - `twentyhq.github.io/placeholder-images/...` → all on `-` (removed) lines; Fuse kept its own placeholder avatars.
  - `ClickHouseApplicationLogDriver` → imported by the orphan `application-logs.module.ts` (see Deep review P1 blocker); the driver itself is not on disk.
  - `messagingMonitoringService.track(` → pre-existing no-op method (`// TODO: replace once we have Prometheus`); body is commented out.
- Phone-home / license-validate adds (`phone-home|verifyEnterprise|validateLicense|licenseValidity`): 9 hits — all inside `packages/twenty-website*/src/app/api/enterprise/...` Next.js routes and `packages/twenty-website*/src/shared/enterprise/enterprise-jwt.ts`. Fuse does not deploy `twenty-website*`; these files ship as source but are not loaded by the Fuse server runtime.
- New telemetry SDK deps (`posthog|segment|@clickhouse|mixpanel|amplitude` in `package.json` / `yarn.lock`): 9 hits — all a `1.18.2 → 1.18.1` version **downgrade** of the already-present `@clickhouse/client` / `@clickhouse/client-common`. No new SDKs.

Verdict: **PASS** — no new outbound telemetry paths are introduced in the Fuse runtime.

## Guardrail B — partner-os surface — PASS

- `git diff origin/main...integration/upstream-wave2-backend -- packages/twenty-server/src/modules/partner-os/` → **0 lines** (file-count = 0, patch-size = 0).
- Jest execution deferred to CI (sandbox network-restricted).

Verdict: **PASS** — zero accidental cascade into partner-os.

## Guardrail C — feature-flag drift — PASS

- `packages/twenty-shared/src/types/FeatureFlagKey.ts` exists.
- `IS_PARTNER_OS_ENABLED` still present (1 match).
- Diff on `FeatureFlagKey.ts` → 0 lines.
- Diff on `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/seed-feature-flags.util.ts` → 0 lines.

Verdict: **PASS** — no wave-2D feature-flag commits bled into wave 2B.

## Deep file review — DONE_WITH_CONCERNS (1 P1 build blocker)

### Subsystem breakdown (2,689 touched files)

| Subsystem | Files |
|---|---|
| `packages/twenty-server/src` | 586 |
| `packages/twenty-docs/l/*` (translations) | 551 |
| `packages/twenty-website-new/src` | 397 |
| `packages/twenty-website-new/public` | 192 |
| `packages/twenty-apps/community` | 171 |
| `packages/twenty-sdk/src` | 145 |
| `packages/twenty-front/src` | 138 |
| `packages/twenty-apps/internal` | 72 |
| `packages/twenty-server/test` | 51 |
| `packages/twenty-apps/fixtures` | 48 |
| `packages/twenty-website/src` | 40 |
| `packages/twenty-apps/examples` | 39 |
| `packages/twenty-front-component-renderer/src` | 34 |
| `packages/twenty-docs/developers` | 27 |
| `packages/twenty-docs/twenty-ui` | 25 |
| `packages/twenty-docs/user-guide` | 23 |
| `packages/twenty-shared/src` | 18 |
| other | 232 |

Twenty-server deep breakdown — the risk-heavy surface:

| Path | Files |
|---|---|
| `engine/core-modules` | 174 |
| `engine/metadata-modules` | 161 |
| `engine/workspace-manager` | 95 |
| `database/commands` | 49 |
| `engine/api` | 43 |
| `modules/messaging` | 14 |
| `modules/workflow` | 9 |

Core-modules depth: `upgrade/` (30), `application/` (28), `tool-provider/` (26), `geo-map/` (11), `logic-function/` (10), `auth/` (6), `billing/` (3).

### Migrations reviewed (5 files)

Each `up()` / `down()` read end-to-end. All reversible and partner-os-safe.

1. `1774005903909-add-messaging-infrastructure-metadata-entities.ts` (**out-of-order**, timestamp earlier than existing `1774100000000-drop-workspace-ai-columns.ts`): creates `core.connectedAccount`, `core.messageChannel`, `core.messageFolder`, `core.calendarChannel` + FKs. Clean `down()`. Benign per TypeORM (migrations tracked by name in `migrations` table, not filesystem order). Matches executor's pre-existing WATCH flag.
2. `1775129420309-add-view-field-group-id-index-on-view-field.ts` (**deleted**): logic moved into `database/commands/upgrade-version-command/1-21/1-21-instance-command-fast-1775129420309-add-view-field-group-id-index-on-view-field.ts`. Net behavior preserved.
3. `1775165049548-migrate-messaging-calendar-to-core.ts` (**deleted**): logic moved to the 1-21 instance-command-fast equivalent.
4. `1775649426693-add-error-message-to-upgrade-migration.ts` (new): adds nullable `errorMessage text` to `core.upgradeMigration`.
5. `1775909335324-add-is-initial-to-upgrade-migration.ts` (new): adds `isInitial boolean NOT NULL DEFAULT false` to `core.upgradeMigration`.

`1775200000000-addEmailThreadWidgetType.ts` (**deleted**) — logic moved to `database/commands/upgrade-version-command/1-21/1-21-instance-command-fast-1775200000000-add-email-thread-widget-type.ts`. Per `f1a1be0f43` ("Prepare 1.21") — upstream expects self-host operators to manually inject the `migrations` row for the deleted file if the DB has already run it. **Operational nit for Fuse deploy runbook**, not a build blocker.

### Auth / permissions / billing spot-checks

- `auth.resolver.ts`, `sso-auth.controller.ts`, `oidc-auth.guard.ts`, `saml-auth.guard.ts`, `saml.auth.strategy.ts`, `oidc-auth.spec.ts` — all pure `sSOService` → `ssoService` variable renames. **Zero logic change.** Safe.
- `permissions.service.ts` — removes a "retry once with cache invalidation" branch in the API-key role lookup (commit upstream decided cached `apiKeyRoleMap` should not silently retry). Tightens behavior; not a security weakening. **Nit — monitor for elevated `API_KEY_ROLE_NOT_FOUND` errors post-deploy.**
- `billing-subscription.service.ts` — adds `workspaceId` argument to one internal call; no outbound fetch additions.
- `billing/crons/enforce-usage-cap.job.ts` + its new test — uses existing `BillingUsageCapService` which already gates on `isClickHouseEnabled()`; self-hosted ClickHouse, no remote egress.

### Top-5 commit spot-checks

1. `80d6a760fb` (#19559, Implement cross version upgrade) — scoped to `upgrade/` module and test utilities; refactors upgrade orchestration to a sequence-based model. Large blast radius but bounded to release machinery; Fuse does not author `twenty-current-version.constant.ts` or the 1-21/2-0/2-1 upgrade command modules. No partner-os touches.
2. `f1a1be0f43` (#19501, Prepare 1.21) — consolidates 3 common migrations into new `upgrade-version-command/1-21/*` files; adds release-history rows. **Self-host operational note:** existing Fuse databases will have `AddViewFieldGroupIdIndexOnViewField1775129420309`, `MigrateMessagingCalendarToCore1775165049548`, and `AddEmailThreadWidgetType1775200000000` rows in the `migrations` table; after wave 2B those rows remain without a corresponding file, which is fine for TypeORM. Needs a manual note in the deploy runbook (parity with upstream's release notes).
3. `b0e40801ab` (#18787, secure/user-scope metadata resolvers) — adds `@HideField()` on sensitive token/cursor fields, introduces user-scoped `myConnectedAccounts`, `myMessageChannels`, `myCalendarChannels`, `myMessageFolders`. **Tightens** permissions. Safe.
4. `e208119729` (#19443, store upgrade commands error message) — tied to `1775649426693-add-error-message-to-upgrade-migration.ts`. Benign.
5. `831967d4bc` (#19907, bump to 2.0.0) — see V5 below.

### P1 — Application-logs module orphan (BUILD BLOCKER candidate)

**Files present after wave 2B:**
- `packages/twenty-server/src/engine/core-modules/application-logs/application-logs.module.ts`
- `packages/twenty-server/src/engine/core-modules/application-logs/application-logs.module-factory.ts`
- `packages/twenty-server/src/engine/core-modules/application-logs/interfaces/application-log-driver.enum.ts`
- `packages/twenty-server/src/engine/core-modules/application-logs/interfaces/application-logs-module-options.type.ts`

**Files referenced by the module but MISSING on disk:**
- `application-logs.service.ts`
- `application-logs.constants.ts`
- `application-logs.module-definition.ts`
- `drivers/clickhouse.driver.ts`
- `drivers/console.driver.ts`
- `drivers/disabled.driver.ts`

**Root cause:** `docs/fuse-upstream-patch-ledger.md` REJECTed commit `36fbfca069` (#19486 — "Add application-logs module with driver pattern for logic function log persistence") on sovereignty grounds (telemetry SDK path). The *follow-up rename* commit `0ff04f6f4f` (#19600 — "Add APPLICATION_LOG_DRIVER=CONSOLE to twenty-app-dev container") was NOT rejected and got cherry-picked in wave 2B, bringing the module scaffold files with it but leaving the service/driver files behind.

**Impact:** `ApplicationLogsModule` is not imported by any other NestJS module (verified via grep across the server), so it will NOT crash at runtime. However, TypeScript `--noEmit` / `nx typecheck twenty-server` will fail on the missing import paths, blocking CI lint/typecheck.

**Options for CTO:**
1. **Delete the orphan files on this branch** (`application-logs.module.ts` and `application-logs.module-factory.ts`), keeping the 2 interface files. Equivalent to a selective revert of the file-added lines from `0ff04f6f4f`. Safest.
2. **Add stub implementations** for the 6 missing files with no-op logic. Larger surface to maintain.
3. **Merge with known failing typecheck** and clean up in a follow-up PR — not recommended.

Not reverted by this verifier agent per plan constraints ("do not modify any other file on the 2B branch"). Flagged for CTO decision.

### Other concerns (nits, no action on this branch)

- Permissions cache retry loop removed (`permissions.service.ts`, section above).
- `1775200000000-addEmailThreadWidgetType.ts` deletion note for deploy runbook (section above).
- 39 GraphQL-touching files in the wave; `twenty-front:graphql:generate` expected to produce zero diff. Deferred to CI.

## V5 — Version collision check — OK

1. **Root `package.json`** version unchanged: `"0.2.1"` both before and after wave 2B. Fuse keeps its own versioning.
2. **No Fuse-specific version strings** (`fuse-v1`, `fusegtm`) in any `package.json` — nothing to collide with.
3. `#19907` (`831967d4bc`) bumps three Twenty-published SDK packages:
   - `packages/create-twenty-app/package.json`: `0.8.0 → 2.0.0`
   - `packages/twenty-client-sdk/package.json`: `0.8.0 → 2.0.0`
   - `packages/twenty-sdk/package.json`: `0.8.0 → 2.0.0`
   Fuse does not publish these to NPM and does not bundle them into the Fuse server/docker image — they are only affected if someone runs `yarn workspace create-twenty-app ...`. Safe.
4. **Runtime version gating:**
   - `TWENTY_CURRENT_VERSION = '2.0.0'`, `TWENTY_NEXT_VERSIONS = ['2.1.0']`, `TWENTY_PREVIOUS_VERSIONS = ['1.21.0', '1.22.0', '1.23.0']`.
   - These are consumed **only inside `engine/core-modules/upgrade/`** — specifically by `upgrade-command-registry.service.ts`, `removed-since-version.type.ts`, `twenty-cross-upgrade-supported-version.constant.ts`, `twenty-all-versions.constant.ts`, and the `database/commands/generate-instance-command.command.ts` CLI.
   - Grep confirms no Fuse partner-os code or branded-server code reads these constants.
5. **Upgrade-command side-effect:** the first `npx nx run twenty-server:command -- upgrade` on a Fuse instance post-merge will walk the full `1.21.0 → 1.22.0 → 1.23.0 → 2.0.0` command sequence. The 2-0 and 2-1 `UpgradeVersionCommandModule`s are empty per the commit message, so no commands will run for those versions — but the fast/workspace commands from 1-21 **will** run on any workspace whose cursor is still below 1.21. Since Fuse is forked at Twenty 1.18.1 and wave 2A only brought security fixes, workspace cursors are still at the pre-upgrade baseline — the full 1-21 catalog will execute on first upgrade.

Verdict: **OK** — no immediate collision, but deploy runbook needs a note about the 1-21 upgrade-command fan-out on first post-wave-2B upgrade run.

## Verifier summary

| Check | Verdict |
|---|---|
| Guardrail A (telemetry/egress) | PASS |
| Guardrail B (partner-os surface) | PASS |
| Guardrail C (feature-flag drift) | PASS |
| Deep file review | DONE_WITH_CONCERNS (1 P1 build blocker) |
| V5 (version collision) | OK |

**Ready for CI** only after the `application-logs` orphan is resolved (Option 1 — delete the two orphan files — is the recommended path; CTO decides).
