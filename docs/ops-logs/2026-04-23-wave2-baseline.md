# Wave 2 Guardrail Baseline — 2026-04-23

Scanned main at commit: `d6397f97b2d820c49445f1b6940f793e1c479cd1`
(branch `claude/goofy-rubin-adb902`, one docs-only commit ahead of `origin/main` @ `196de79cd6`; no source changes).

Scope: baseline of `main` before wave 2 cherry-picks. Later wave-execution
agents should diff their integration branches against this report; anything
already listed here is not a contamination signal introduced by wave 2.

---

## Scan A — Telemetry / Egress

### Scan 1 — telemetry/egress regex (`twenty.com|ENTERPRISE_VALIDITY_TOKEN|twentyhq|clickhouse|posthog|segment|mixpanel|amplitude|\.track\(|analytics\.(track|identify|page)`)

Raw matches after excluding `node_modules`, `*.spec.ts`, `*.test.ts`,
`*.stories.ts`, `*.mock.ts`, `*.fixture.ts`, `dist/`, `build/`:
**1,379 lines across 155 files**.

Categorised:

#### OK — legitimate Fuse code / self-hosted infrastructure

- `packages/twenty-server/src/database/clickHouse/clickHouse.service.ts:23-38`
  — ClickHouse client. User-hosted analytics DB, only constructs a client if
  `CLICKHOUSE_URL` is set. `application: 'twenty'` is a client-label metadata
  string sent on connection to the *user's own* ClickHouse, not phone-home.
- `packages/twenty-server/src/database/clickHouse/migrations/run-migrations.ts`
  and `seeds/run-seeds.ts` — self-hosted schema bootstrap.
- `packages/twenty-server/src/engine/core-modules/enterprise/services/enterprise-plan.service.ts:226,231`
  — explicit Fuse stubs:
    - `refreshValidityToken()` returns `true` with comment
      `// Fuse: no outbound phone-home calls`
    - `reportSeats()` returns `true` with same comment
- `packages/twenty-server/src/engine/core-modules/enterprise/cron/jobs/enterprise-key-validation.cron.job.ts:33`
  — cron `handle()` body reduced to a log line, comment
  `// Fuse: phone-home disabled — enterprise features are always enabled`.
- `packages/twenty-server/src/modules/messaging/monitoring/services/messaging-monitoring.service.ts`
  — `MessagingMonitoringService.track()` is a **no-op** (only commented-out
  reference to a local audit service). All 12 `messagingMonitoringService.track(...)`
  callsites under `packages/twenty-server/src/modules/messaging/` are therefore
  harmless.
- `ENTERPRISE_VALIDITY_TOKEN` (config + auth exception codes + entity type +
  frontend `refreshEnterpriseValidityToken` mutation) — this token is a
  **locally-signed JWT** stored in `appToken` table with
  `type = 'ENTERPRISE_VALIDITY_TOKEN'`. `loadValidityToken()` reads from DB
  or env and `verifyJwt(...)` uses the local public key constant — no HTTP
  egress.
- Test / seed fixture hits for `segment.com`, `amplitude.com`, `twenty.com`
  (in `dev-seeder/data/constants/company-data-seeds.constant.ts`,
  `partner-os-seed-data.constant.ts`, `test/integration/**`, generated
  mock-data) — demo company names, not telemetry.
- `packages/twenty-oxlint-rules/**` — lint-rule strings mentioning
  `docs.twenty.com` for developer help URLs. Lint-only, never shipped.

#### WATCH — out-of-runtime, but worth noting

- `packages/twenty-utils/congratulate-dangerfile.ts:13-89`, `dangerfile.ts:45`
  — CI danger scripts fetch `twenty.com/api/contributors/...`. These run in
  GitHub Actions only, never ship in the server/frontend bundle. Left as-is
  since Fuse doesn't publish PRs to twenty.com.
- `packages/twenty-apps/community/stripe-synchronizer/src/index.ts:14`
  — default `TWENTY_API_URL` falls back to `https://api.twenty.com/rest` if
  the env var is unset. Community serverless app, user-installed; operator
  must set `TWENTY_API_URL` to self-hosted endpoint. Not loaded by the server
  process.
- `packages/twenty-emails/src/constants/DefaultWorkspaceLogo.ts:2`
  — placeholder logo URL `https://twentyhq.github.io/placeholder-images/...`.
  Only used as an email default when no workspace logo is set; this is a
  GitHub-hosted image, not telemetry. Noted in Fuse branding backlog.
- `packages/twenty-website/**` and `packages/twenty-website-new/**`
  — upstream marketing site, not deployed by Fuse; ~186 of the 1,379 matches
  come from here.
- `packages/create-twenty-app/src/utils/download-example.ts:7`
  — scaffolding CLI pulling examples from `twentyhq` repo. Not in runtime.
- `packages/twenty-front/src/pages/settings/enterprise/SettingsEnterprise.tsx`
  — UI that triggers the local `refreshEnterpriseValidityToken` mutation
  (GraphQL -> local-signed JWT refresh). No external call.

#### DIRTY — none

**Scan 1 verdict: CLEAN.** No PostHog / Segment / Mixpanel / Amplitude
instrumentation. No actual twenty.com phone-home reaches the Fuse server
runtime. All `.track(` callsites go through the no-op
`MessagingMonitoringService`.

### Scan 2 — `phone-home|verifyEnterprise|validateLicense|licenseValidity` in `packages/twenty-server/src`

Matches (3, all explicit Fuse stubs — commit `377664545c`):

```
engine/core-modules/enterprise/cron/jobs/enterprise-key-validation.cron.job.ts:33
  // Fuse: phone-home disabled — enterprise features are always enabled
engine/core-modules/enterprise/services/enterprise-plan.service.ts:226
  // Fuse: no outbound phone-home calls
engine/core-modules/enterprise/services/enterprise-plan.service.ts:231
  // Fuse: no outbound phone-home calls
```

**Scan 2 verdict: CLEAN.** No live license-validation HTTP calls remain.

### Scan 3 — telemetry SDK deps in `package.json` / `yarn.lock`

Searched for `posthog`, `@segment/`, `mixpanel`, `amplitude`, `@clickhouse`:

- `package.json`: **only** `packages/twenty-server/package.json:33`
  `"@clickhouse/client": "^1.18.1"` (self-hosted analytics DB, OK).
- `yarn.lock`: `@clickhouse/client@npm:^1.18.1` and transitive
  `@clickhouse/client-common@npm:1.18.2`. Nothing else.
- Zero matches for PostHog, Segment, Mixpanel, Amplitude SDKs.

**Scan 3 verdict: CLEAN.**

### Scan A overall verdict: **CLEAN**

---

## Scan B — Partner-OS Baseline

- File count under `packages/twenty-server/src/modules/partner-os/`:
  **21 files** (includes 3 spec files + 1 fixtures file; 17 non-test files).
- 10 most recent commits touching partner-os:

  ```
  6f63901af1 fix(ci): absorb server rescue required by shared diff
  eb0225b62f feat(partner-os): duplicate map prevention, stale handoff cron, ClickHouse stub fix
  d87bb798f9 feat(partner-os): add opinionated filtered views to bootstrap (FUSE-203)
  7b10e4d29e feat(partner-os): add discovery workflows, co-sell handoff, seed command
  5c03edb111 fix: resolve all typecheck errors after full upstream sync (780 commits)
  fc134077bb test(partner-os): add comprehensive test coverage (84 tests, 98.75%)
  a0cd86c8bd fix(fuse): harden workspace redirects and migrate partner-track rename
  45e979039d stabilize fuse runtime contracts and partner os bootstrap schema
  a245ad45f8 feat(partner-os): add customer event and snapshot revenue spine objects
  d298110ef6 feat(partner-os): bootstrap partner objects, relations, views, and cli command
  ```

- Test run: **BLOCKED — dependencies not installed in worktree**, and
  `yarn install` could not complete in this sandbox (network-restricted /
  exit 144). Baseline test count remains the documented **84 tests, 98.75%
  coverage** from commit `fc134077bb`. Wave-execution agents should
  re-verify on their integration branch before trusting a drift signal.

**Baseline locked at: `d6397f97b2d820c49445f1b6940f793e1c479cd1`**
Newest partner-os commit: `6f63901af1`. Wave agents must not introduce new
commits under `packages/twenty-server/src/modules/partner-os/` unless
explicitly scoped.

---

## Scan C — Feature-flag Baseline

### Source of truth: `packages/twenty-shared/src/types/FeatureFlagKey.ts`

The enum has **already migrated to `twenty-shared`** on main. The only
non-generated authoritative `export enum FeatureFlagKey` is at:

- `packages/twenty-shared/src/types/FeatureFlagKey.ts` (source)
- `packages/twenty-front/src/generated-metadata/graphql.ts:1733` (generated
  GraphQL schema mirror, not hand-edited)

No `feature-flag-key.enum.ts` file exists at the plan-specified path
`packages/twenty-server/src/engine/core-modules/feature-flag/enums/`.
Server code imports the enum via `from 'twenty-shared/types'`.

### Enum keys (18)

```
IS_UNIQUE_INDEXES_ENABLED
IS_JSON_FILTER_ENABLED
IS_AI_ENABLED
IS_COMMAND_MENU_ITEM_ENABLED
IS_MARKETPLACE_SETTING_TAB_VISIBLE
IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED
IS_PUBLIC_DOMAIN_ENABLED
IS_EMAILING_DOMAIN_ENABLED
IS_JUNCTION_RELATIONS_ENABLED
IS_DRAFT_EMAIL_ENABLED
IS_CONNECTED_ACCOUNT_MIGRATED
IS_USAGE_ANALYTICS_ENABLED
IS_RICH_TEXT_V1_MIGRATED
IS_RECORD_PAGE_LAYOUT_GLOBAL_EDITION_ENABLED
IS_RECORD_TABLE_WIDGET_ENABLED
IS_DATASOURCE_MIGRATED
IS_PARTNER_OS_ENABLED
```

(17 shown; line 19 is the closing brace — the enum contains 17 keys.)

### Seed file: `packages/twenty-server/src/engine/workspace-manager/dev-seeder/core/utils/seed-feature-flags.util.ts`

(Plan path
`packages/twenty-server/src/engine/core-modules/feature-flag/utils/seed-feature-flags.util.ts`
does not exist. The actual path is under `dev-seeder/core/utils/`.)

Keys seeded with default values (10):

```
IS_UNIQUE_INDEXES_ENABLED                       = false
IS_AI_ENABLED                                   = true
IS_PUBLIC_DOMAIN_ENABLED                        = true
IS_EMAILING_DOMAIN_ENABLED                      = true
IS_JUNCTION_RELATIONS_ENABLED                   = true
IS_MARKETPLACE_SETTING_TAB_VISIBLE              = true
IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED           = true
IS_USAGE_ANALYTICS_ENABLED                      = true
IS_RECORD_PAGE_LAYOUT_GLOBAL_EDITION_ENABLED    = true
IS_RECORD_TABLE_WIDGET_ENABLED                  = true
```

A second seed list at
`packages/twenty-server/src/engine/workspace-manager/workspace-migration/constant/default-feature-flags.ts`
contains only:

```
DEFAULT_FEATURE_FLAGS = [FeatureFlagKey.IS_DATASOURCE_MIGRATED]
```

### IS_PARTNER_OS_ENABLED

- Present in enum: **YES** (`FeatureFlagKey.ts:18`).
- Present in seed: **NO** — not in `seedFeatureFlags` or
  `DEFAULT_FEATURE_FLAGS`. Feature is opt-in per-workspace.
- Referenced at runtime:
  `packages/twenty-server/src/engine/core-modules/onboarding/onboarding.service.ts:91`.

### `packages/twenty-shared/src/types/FeatureFlagKey.ts` exists: **YES**

Landed previously as part of upstream sync commit `5c03edb111 fix: resolve
all typecheck errors after full upstream sync (780 commits)`. The plan
cites the move to twenty-shared as a wave 2D signal — **but it is already
on main today**, so this is the baseline state, not a wave 2D contamination.
Wave 2D agents should treat the existing shared enum as the starting
point, not as a signal their patch introduced.

### Enum moved to shared: **YES (already landed; deviation from plan expectation)**

---

## Summary

- **Scan A:** CLEAN. No live telemetry/egress on main. Phone-home stubs,
  local JWT validity token, no-op monitoring service, and self-hosted
  ClickHouse are all accounted for.
- **Scan B:** partner-os baseline = 21 files, top commit `6f63901af1`.
  Tests not executable in this sandbox; count remains documented 84 @
  98.75% from `fc134077bb`.
- **Scan C:** 17 enum keys, 10 seeded (+ 1 in `DEFAULT_FEATURE_FLAGS`).
  `IS_PARTNER_OS_ENABLED` in enum only. `twenty-shared/FeatureFlagKey.ts`
  already exists — flag for wave 2D planners that this move is already
  complete on main.
